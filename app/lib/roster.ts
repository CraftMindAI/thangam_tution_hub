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

/** Roster filtered to a single class (used for calendar invite matching). */
export async function getRosterByClass(cls: string | null): Promise<RosterStudent[]> {
  const roster = await getRoster();
  if (!cls) return roster;
  return roster.filter((s) => s.class === cls);
}
