"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import * as XLSX from "xlsx";
import * as z from "zod";
import { createClient } from "../lib/supabase/server";
import { createAdminClient } from "../lib/supabase/admin";
import { sendPasswordSetupEmail } from "../lib/mailer";
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

type StudentInput = z.infer<typeof studentSchema>;

type EnsureResult =
  | { ok: true; id: string; emailed: boolean }
  | { ok: false; error: string };

/**
 * Create the student's account and profile: create (or look up) the auth user,
 * write every field from the form onto public.profiles, then email them a
 * set-password link. These two tables are the only places a student is stored.
 *
 * Account creation and the email are deliberately separate steps — Supabase's
 * own invite mail is rate limited to a couple of messages an hour, so we
 * generate the link without sending and deliver it over our own SMTP.
 */
async function saveStudent(
  adminClient: AdminClient,
  student: StudentInput,
  origin: string,
  existingByEmail: Map<string, string> | null
): Promise<EnsureResult> {
  const { data, error } = await adminClient.auth.admin.createUser({
    email: student.email,
    password: randomBytes(24).toString("base64url"),
    email_confirm: true,
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
    userId = existingByEmail.get(student.email.toLowerCase()) ?? null;
    if (!userId) return { ok: false, error: error.message };
  }
  if (!userId) return { ok: false, error: "Could not create the account." };

  // Re-adding an admin's address must never demote them to a student.
  const { data: existing } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  if (existing?.role === "admin") {
    return { ok: false, error: `${student.email} belongs to an admin account.` };
  }

  const { error: profileErr } = await adminClient.from("profiles").upsert(
    {
      id: userId,
      role: STUDENT_ROLE,
      full_name: student.name,
      phone: student.phone || null,
      class: student.class,
      school: student.school,
      location: student.location,
      parent_phone: student.parent_phone || null,
      parent_email: student.parent_email,
    },
    { onConflict: "id" }
  );
  if (profileErr) return { ok: false, error: profileErr.message };

  const emailed = await sendSetPasswordLink(
    adminClient,
    student.email,
    student.name,
    origin
  );

  return { ok: true, id: userId, emailed };
}

/**
 * Generate a set-password link (no mail sent by Supabase) and deliver it over
 * our own SMTP. Never throws — a failed email leaves the account intact.
 */
async function sendSetPasswordLink(
  adminClient: AdminClient,
  email: string,
  name: string,
  origin: string
): Promise<boolean> {
  const { data, error } = await adminClient.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: `${origin}/reset-password` },
  });

  const link = data?.properties?.action_link;
  if (error || !link) {
    console.error(`Could not generate a set-password link for ${email}`, error);
    return false;
  }

  return sendPasswordSetupEmail(email, name, link);
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
  const result = await saveStudent(
    adminClient,
    parsed.data,
    await siteOrigin(),
    null
  );

  if (!result.ok) return { error: result.error };

  revalidatePath("/admin/[sid]/[uid]", "layout");

  return {
    success: true,
    message: `${parsed.data.name} added to the roster.${
      result.emailed
        ? " A link to set their password was emailed."
        : " Note: the password email could not be sent — use Reset password to retry."
    }`,
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
  let emailed = 0;
  let saved = 0;

  for (const v of valid) {
    const result = await saveStudent(adminClient, v, origin, existingByEmail);
    if (result.ok) {
      saved += 1;
      if (result.emailed) emailed += 1;
    } else {
      errors.push(`${v.email}: ${result.error}`);
    }
  }

  if (saved === 0) {
    return {
      error:
        `No rows could be imported.` +
        (errors.length ? ` ${errors.slice(0, 3).join("; ")}` : ""),
    };
  }

  revalidatePath("/admin/[sid]/[uid]", "layout");

  let message = `Imported ${saved} student${saved === 1 ? "" : "s"} (${emailed} password link${emailed === 1 ? "" : "s"} emailed).`;
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
  const name = formData.get("name");

  // Same path as adding a student: generate the link, send it over our own
  // SMTP, so this isn't throttled by Supabase's built-in mailer.
  const sent = await sendSetPasswordLink(
    createAdminClient(),
    email,
    typeof name === "string" && name ? name : email,
    await siteOrigin()
  );

  if (!sent) {
    return { error: "Could not send the email. Check the mail settings." };
  }

  return { success: true, message: `Password reset link sent to ${email}.` };
}

export async function deleteStudent(formData: FormData) {
  const auth = await requireAdmin();
  if (!auth.ok) return;

  const userId = formData.get("id");
  if (typeof userId !== "string" || !userId) return;

  // Removing the auth user cascades to profiles + intake rows.
  const adminClient = createAdminClient();
  await adminClient.auth.admin.deleteUser(userId);
  revalidatePath("/admin/[sid]/[uid]", "layout");
}

const phoneRegex = /^[6-9]\d{9}$/;

const optionalTrimmed = (v: FormDataEntryValue | null) =>
  typeof v === "string" && v.trim() ? v.trim() : null;

const updateStudentProfileSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your name"),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Enter a valid 10-digit mobile number"),
  class: z
    .string()
    .transform((v) => normalizeClass(v))
    .refine(
      (v): v is (typeof STUDENT_CLASSES)[number] =>
        (STUDENT_CLASSES as readonly string[]).includes(v),
      { message: "Choose a valid class" }
    ),
  school: z.string().trim().min(1, "School is required"),
  location: z.string().trim().min(1, "Location is required"),
  parent_name: z.string().trim().nullable(),
  parent_phone: z
    .string()
    .nullable()
    .refine((v) => v === null || phoneRegex.test(v), {
      message: "Enter a valid 10-digit parent mobile number",
    }),
  parent_email: z
    .string()
    .nullable()
    .pipe(z.union([z.null(), z.string().trim().email("Enter a valid parent email")])),
});

export type UpdateStudentProfileState =
  | { error: string }
  | { success: true }
  | undefined;

export async function updateStudentProfile(
  _state: UpdateStudentProfileState,
  formData: FormData
): Promise<UpdateStudentProfileState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to do this." };
  }

  const parsed = updateStudentProfileSchema.safeParse({
    full_name: formData.get("full_name"),
    phone: formData.get("phone"),
    class: formData.get("class"),
    school: formData.get("school"),
    location: formData.get("location"),
    parent_name: optionalTrimmed(formData.get("parent_name")),
    parent_phone: optionalTrimmed(formData.get("parent_phone")),
    parent_email: optionalTrimmed(formData.get("parent_email")),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("profiles")
    .update({
      full_name: parsed.data.full_name,
      phone: parsed.data.phone,
      class: parsed.data.class,
      school: parsed.data.school,
      location: parsed.data.location,
      parent_name: parsed.data.parent_name,
      parent_phone: parsed.data.parent_phone,
      parent_email: parsed.data.parent_email,
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/student", "layout");
  return { success: true };
}
