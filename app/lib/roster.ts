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
        "id, full_name, phone, class, school, location, parent_phone, parent_email"
      )
      .in("role", STUDENT_ROLES as unknown as string[]),
  ]);

  const emailById = new Map(
    (userList?.users ?? [])
      .filter((u) => u.email)
      .map((u) => [u.id, u.email as string])
  );

  return (profiles ?? []).map((p) => ({
    userId: p.id,
    name: p.full_name ?? emailById.get(p.id) ?? "",
    email: emailById.get(p.id) ?? "",
    class: normalizeClass(p.class ?? ""),
    school: p.school ?? "",
    location: p.location ?? null,
    phone: p.phone ?? null,
    parent_phone: p.parent_phone ?? null,
    parent_email: p.parent_email ?? null,
  }));
}

/** Roster filtered to a single class (used for calendar invite matching). */
export async function getRosterByClass(cls: string | null): Promise<RosterStudent[]> {
  const roster = await getRoster();
  if (!cls) return roster;
  return roster.filter((s) => s.class === cls);
}
