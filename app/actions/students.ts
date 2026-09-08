"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import * as XLSX from "xlsx";
import * as z from "zod";
import { createClient } from "../lib/supabase/server";
import { createAdminClient } from "../lib/supabase/admin";
import { STUDENT_CLASSES, normalizeClass } from "../lib/students";

const STUDENT_ROLE = "existing_student";

async function siteOrigin() {
  const h = await headers();
  const host = h.get("host");
  const proto =
    h.get("x-forwarded-proto") ??
    (host?.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

type AdminClient = ReturnType<typeof createAdminClient>;

/**
 * Invite (or look up) the auth user for a student and make sure they have a
 * profile row. Mirrors how admins are created. Returns the auth user id, or
 * null if the account could not be created or found.
 */
async function ensureStudentAuthUser(
  adminClient: AdminClient,
  email: string,
  fullName: string,
  phone: string,
  origin: string,
  existingByEmail: Map<string, string> | null
): Promise<{ id: string | null; note?: string }> {
  const redirectTo = `${origin}/reset-password`;
  const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email, {
    redirectTo,
  });

  let userId = data?.user?.id ?? null;

  if (!userId && error) {
    // Most common cause: the address is already registered. Resolve the id.
    if (!existingByEmail) {
      const { data: list } = await adminClient.auth.admin.listUsers({
        perPage: 1000,
      });
      existingByEmail = new Map(
        (list?.users ?? [])
          .filter((u) => u.email)
          .map((u) => [u.email!.toLowerCase(), u.id])
      );
    }
    userId = existingByEmail.get(email.toLowerCase()) ?? null;
    if (!userId) return { id: null, note: error.message };
  }

  if (userId) {
    // Insert the profile if missing; never overwrite an existing role.
    await adminClient.from("profiles").upsert(
      {
        id: userId,
        role: STUDENT_ROLE,
        full_name: fullName,
        phone: phone || null,
      },
      { onConflict: "id", ignoreDuplicates: true }
    );
  }

  return { id: userId };
}

export type StudentActionState =
  | { error: string }
  | { success: true; message: string }
  | undefined;

type Supabase = Awaited<ReturnType<typeof createClient>>;

type AdminCheck =
  | { ok: false; error: string }
  | { ok: true; supabase: Supabase; userId: string };

async function requireAdmin(): Promise<AdminCheck> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "You must be signed in as an admin." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { ok: false, error: "Only admins can manage students." };
  }

  return { ok: true, supabase, userId: user.id };
}

const phoneRe = /^\d{7,15}$/;

const studentSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  class: z
    .string()
    .transform((v) => normalizeClass(v))
    .refine(
      (v): v is (typeof STUDENT_CLASSES)[number] =>
        (STUDENT_CLASSES as readonly string[]).includes(v),
      { message: "Class must be LKG, UKG or 1–10" }
    ),
  school: z.string().trim().min(1, "School is required"),
  location: z.string().trim().min(1, "Location is required"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email"),
  phone: z
    .string()
    .transform((v) => v.replace(/[\s\-()+]/g, ""))
    .pipe(z.string().regex(phoneRe, "Enter a valid phone number")),
  parent_email: z
    .string()
    .trim()
    .optional()
    .transform((v) => v || null)
    .pipe(z.union([z.null(), z.string().email("Enter a valid parent email")])),
  parent_phone: z
    .string()
    .transform((v) => v.replace(/[\s\-()+]/g, ""))
    .pipe(z.string().regex(phoneRe, "Enter a valid parent phone number")),
});

export async function addStudent(
  _state: StudentActionState,
  formData: FormData
): Promise<StudentActionState> {
  const auth = await requireAdmin();
  if (!auth.ok) return { error: auth.error };

  const parsed = studentSchema.safeParse({
    name: formData.get("name"),
    class: formData.get("class"),
    school: formData.get("school"),
    location: formData.get("location"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    parent_email: formData.get("parent_email"),
    parent_phone: formData.get("parent_phone"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const adminClient = createAdminClient();
  const { id: userId, note } = await ensureStudentAuthUser(
    adminClient,
    parsed.data.email,
    parsed.data.name,
    parsed.data.phone,
    await siteOrigin(),
    null
  );

  const { error } = await auth.supabase
    .from("students")
    .insert({ ...parsed.data, created_by: auth.userId, user_id: userId });

  if (error) return { error: error.message };

  revalidatePath("/admin/students");

  const suffix = userId
    ? " An invite to set a password was emailed."
    : note
      ? ` Account not created: ${note}`
      : "";
  return {
    success: true,
    message: `${parsed.data.name} added to the roster.${suffix}`,
  };
}

type RawRow = Record<string, unknown>;

function normalizeRow(row: RawRow) {
  const map: Record<string, string> = {};
  for (const [k, v] of Object.entries(row)) {
    map[k.toLowerCase().replace(/[^a-z0-9]/g, "")] = String(v ?? "").trim();
  }
  const get = (...keys: string[]) => {
    for (const key of keys) if (map[key]) return map[key];
    return "";
  };
  return {
    name: get("name", "studentname", "student", "fullname"),
    class: get("class", "standard", "std", "grade"),
    school: get("school", "schoolname"),
    location: get("location", "area", "city", "place", "town", "address"),
    email: get("email", "emailid", "studentemail", "mailid"),
    phone: get(
      "phone",
      "mobile",
      "phonenumber",
      "mobilenumber",
      "contact",
      "contactnumber"
    ),
    parent_email: get(
      "parentemail",
      "parentsemail",
      "guardianemail",
      "parentmailid"
    ),
    parent_phone: get(
      "parentphone",
      "parentsphone",
      "parentmobile",
      "guardianphone",
      "parentcontact",
      "parentsphonenumber",
      "parentmobilenumber"
    ),
  };
}

export async function importStudents(
  _state: StudentActionState,
  formData: FormData
): Promise<StudentActionState> {
  const auth = await requireAdmin();
  if (!auth.ok) return { error: auth.error };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an Excel (.xlsx / .xls) or CSV file to import." };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { error: "File is too large (max 5 MB)." };
  }

  let rows: RawRow[];
  try {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array" });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    rows = XLSX.utils.sheet_to_json<RawRow>(sheet, { defval: "" });
  } catch {
    return { error: "Could not read that file. Make sure it's a valid spreadsheet." };
  }

  if (rows.length === 0) {
    return { error: "The spreadsheet has no data rows." };
  }

  const valid: z.infer<typeof studentSchema>[] = [];
  const errors: string[] = [];

  rows.forEach((raw, i) => {
    const normalized = normalizeRow(raw);
    if (
      !normalized.name &&
      !normalized.email &&
      !normalized.class &&
      !normalized.school
    ) {
      return; // skip fully blank rows silently
    }
    const parsed = studentSchema.safeParse(normalized);
    if (parsed.success) {
      valid.push(parsed.data);
    } else {
      errors.push(
        `Row ${i + 2}: ${parsed.error.issues[0]?.message ?? "invalid data"}`
      );
    }
  });

  if (valid.length === 0) {
    return {
      error:
        `No rows could be imported.` +
        (errors.length ? ` ${errors.slice(0, 3).join("; ")}` : ""),
    };
  }

  // Invite an auth user for each valid row (same flow as adding one student).
  const adminClient = createAdminClient();
  const origin = await siteOrigin();
  const { data: userList } = await adminClient.auth.admin.listUsers({
    perPage: 1000,
  });
  const existingByEmail = new Map<string, string>(
    (userList?.users ?? [])
      .filter((u) => u.email)
      .map((u) => [u.email!.toLowerCase(), u.id])
  );
  let invited = 0;

  const payload: (z.infer<typeof studentSchema> & {
    created_by: string;
    user_id: string | null;
  })[] = [];

  for (const v of valid) {
    const { id } = await ensureStudentAuthUser(
      adminClient,
      v.email,
      v.name,
      v.phone,
      origin,
      existingByEmail
    );
    if (id) invited += 1;
    payload.push({ ...v, created_by: auth.userId, user_id: id });
  }

  const { error } = await auth.supabase.from("students").insert(payload);

  if (error) return { error: error.message };

  revalidatePath("/admin/students");

  let message = `Imported ${valid.length} student${valid.length === 1 ? "" : "s"} (${invited} invite${invited === 1 ? "" : "s"} emailed).`;
  if (errors.length) {
    message += ` Skipped ${errors.length} row${errors.length === 1 ? "" : "s"}: ${errors
      .slice(0, 3)
      .join("; ")}${errors.length > 3 ? "…" : ""}`;
  }
  return { success: true, message };
}

export async function sendStudentPasswordReset(
  _state: StudentActionState,
  formData: FormData
): Promise<StudentActionState> {
  const auth = await requireAdmin();
  if (!auth.ok) return { error: auth.error };

  const email = formData.get("email");
  if (typeof email !== "string" || !email) {
    return { error: "No email on file for this student." };
  }

  const headersList = await headers();
  const host = headersList.get("host");
  const proto =
    headersList.get("x-forwarded-proto") ??
    (host?.startsWith("localhost") ? "http" : "https");

  const { error } = await auth.supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${proto}://${host}/reset-password`,
  });

  if (error) return { error: error.message };

  return { success: true, message: `Password reset link sent to ${email}.` };
}

export async function deleteStudent(formData: FormData) {
  const auth = await requireAdmin();
  if (!auth.ok) return;

  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  await auth.supabase.from("students").delete().eq("id", id);
  revalidatePath("/admin/students");
}
