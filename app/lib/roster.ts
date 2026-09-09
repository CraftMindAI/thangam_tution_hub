import "server-only";
import { createAdminClient } from "./supabase/admin";
import { normalizeClass } from "./students";

const STUDENT_ROLES = ["new_student", "existing_student"] as const;

export type RosterStudent = {
  userId: string;
  name: string;
  email: string;
  class: string;
  school: string;
  location: string | null;
  phone: string | null;
  parent_phone: string | null;
  parent_email: string | null;
};

type IntakeRow = {
  user_id: string;
  student_name: string | null;
  standard: string | null;
  school_name: string | null;
  created_at: string;
};

/**
 * The student roster, rebuilt from auth.users + profiles + the latest intake
 * row per user. Replaces the retired public.students table.
 */
export async function getRoster(): Promise<RosterStudent[]> {
  const admin = createAdminClient();

  const [{ data: userList }, { data: profiles }, { data: newReqs }, { data: existingReqs }] =
    await Promise.all([
      admin.auth.admin.listUsers({ perPage: 1000 }),
      admin
        .from("profiles")
        .select("id, full_name, phone, location, parent_phone, parent_email, role")
        .in("role", STUDENT_ROLES as unknown as string[]),
      admin
        .from("new_student_requests")
        .select("user_id, student_name, standard, school_name, created_at")
        .order("created_at", { ascending: false }),
      admin
        .from("existing_student_requests")
        .select("user_id, student_name, standard, created_at")
        .order("created_at", { ascending: false }),
    ]);

  const emailById = new Map(
    (userList?.users ?? [])
      .filter((u) => u.email)
      .map((u) => [u.id, u.email as string])
  );

  // First (newest) row wins per user.
  const latestIntake = new Map<string, IntakeRow>();
  for (const row of [
    ...((newReqs ?? []) as IntakeRow[]),
    ...((existingReqs ?? []).map((r) => ({ ...r, school_name: null })) as IntakeRow[]),
  ].sort((a, b) => b.created_at.localeCompare(a.created_at))) {
    if (!latestIntake.has(row.user_id)) latestIntake.set(row.user_id, row);
  }

  return (profiles ?? []).map((p) => {
    const intake = latestIntake.get(p.id);
    return {
      userId: p.id,
      name: p.full_name ?? intake?.student_name ?? emailById.get(p.id) ?? "",
      email: emailById.get(p.id) ?? "",
      class: normalizeClass(intake?.standard ?? ""),
      school: intake?.school_name ?? "",
      location: p.location ?? null,
      phone: p.phone ?? null,
      parent_phone: p.parent_phone ?? null,
      parent_email: p.parent_email ?? null,
    };
  });
}

/** Roster filtered to a single class (used for calendar invite matching). */
export async function getRosterByClass(cls: string | null): Promise<RosterStudent[]> {
  const roster = await getRoster();
  if (!cls) return roster;
  return roster.filter((s) => s.class === cls);
}
