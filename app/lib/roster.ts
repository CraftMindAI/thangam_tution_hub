import "server-only";
import { createAdminClient } from "./supabase/admin";
import { normalizeClass, STUDENT_TYPES, type StudentType } from "./students";

const STUDENT_ROLES = STUDENT_TYPES;

export type RosterStudent = {
  userId: string;
  name: string;
  email: string;
  type: StudentType;
  class: string;
  school: string;
  location: string | null;
  phone: string | null;
  parent_phone: string | null;
  parent_email: string | null;
};

/**
 * The student roster: one entry per student profile, with the email read back
 * from their auth user. Students live only in auth.users + public.profiles.
 */
export async function getRoster(): Promise<RosterStudent[]> {
  const admin = createAdminClient();

  const [{ data: userList }, { data: profiles }] = await Promise.all([
    admin.auth.admin.listUsers({ perPage: 1000 }),
    admin
      .from("profiles")
      .select(
        "id, role, full_name, phone, class, school, location, parent_phone, parent_email"
      )
      .in("role", STUDENT_ROLES as unknown as string[]),
  ]);

  const emailById = new Map(
    (userList?.users ?? [])
      .filter((u) => u.email)
      .map((u) => [u.id, u.email as string])
  );

  return (profiles ?? [])
    .map((p) => ({
      userId: p.id,
      name: p.full_name ?? emailById.get(p.id) ?? "",
      email: emailById.get(p.id) ?? "",
      type: p.role as StudentType,
      class: normalizeClass(p.class ?? ""),
      school: p.school ?? "",
      location: p.location ?? null,
      phone: p.phone ?? null,
      parent_phone: p.parent_phone ?? null,
      parent_email: p.parent_email ?? null,
    }))
    // New students first, then offline students; alphabetical within each.
    .sort(
      (a, b) =>
        (a.type === b.type ? 0 : a.type === "new_student" ? -1 : 1) ||
        a.name.localeCompare(b.name)
    );
}

/**
 * Who gets emailed a meeting invitation.
 *
 * All students (both online and offline) who have an email address.
 * Pass a class to narrow further, or null for every class.
 */
export async function getMeetingInvitees(
  cls: string | null
): Promise<RosterStudent[]> {
  const roster = await getRoster();
  return roster.filter(
    (s) => s.email && (!cls || s.class === cls)
  );
}

/**
 * Fetch specific students by their auth user IDs.
 * Used when the admin hand-picks students (send_to = 'selected').
 */
export async function getStudentsByIds(
  userIds: string[]
): Promise<RosterStudent[]> {
  if (!userIds.length) return [];
  const roster = await getRoster();
  const idSet = new Set(userIds);
  return roster.filter((s) => idSet.has(s.userId) && s.email);
}


export type EnquiryStudent = {
  userId: string;
  name: string;
  email: string;
  /** Title of their most recent enquiry, shown to disambiguate the dropdown. */
  latestTitle: string;
};

/**
 * Students who have submitted at least one enquiry, newest first — the
 * candidates for an "Inquiry" meeting. One entry per student, not per enquiry.
 */
export async function getEnquiryStudents(): Promise<EnquiryStudent[]> {
  const admin = createAdminClient();

  const { data: enquiries } = await admin
    .from("student_enquiries")
    .select("user_id, title, created_at")
    .order("created_at", { ascending: false });

  if (!enquiries?.length) return [];

  const userIds = [...new Set(enquiries.map((e) => e.user_id))];

  const [{ data: userList }, { data: profiles }] = await Promise.all([
    admin.auth.admin.listUsers({ perPage: 1000 }),
    admin.from("profiles").select("id, full_name").in("id", userIds),
  ]);

  const emailById = new Map(
    (userList?.users ?? [])
      .filter((u) => u.email)
      .map((u) => [u.id, u.email as string])
  );
  const nameById = new Map(
    (profiles ?? []).map((p) => [p.id, p.full_name as string | null])
  );

  // enquiries is newest-first, so the first row per user is their latest.
  const seen = new Set<string>();
  const out: EnquiryStudent[] = [];
  for (const e of enquiries) {
    if (seen.has(e.user_id)) continue;
    seen.add(e.user_id);
    const email = emailById.get(e.user_id) ?? "";
    out.push({
      userId: e.user_id,
      name: nameById.get(e.user_id) || email || "Student",
      email,
      latestTitle: e.title,
    });
  }
  return out;
}
