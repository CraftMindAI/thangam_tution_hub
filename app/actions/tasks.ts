"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";
import { createClient } from "../lib/supabase/server";
import { createAdminClient } from "../lib/supabase/admin";
import { getMailTransport, MAIL_FROM } from "../lib/mailer";
import { getMeetingInvitees, getStudentsByIds } from "../lib/roster";
import { STUDENT_CLASSES, STUDENT_TYPES, type StudentType } from "../lib/students";
import { TASK_STATUSES, SEND_TO_OPTIONS, type TaskStatus } from "../lib/tasks";


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
    return { ok: false, error: "Only admins can manage tasks." };
  }

  return { ok: true, supabase, userId: user.id };
}

type AuthedCheck =
  | { ok: false; error: string }
  | { ok: true; supabase: Supabase; userId: string };

async function requireAuthed(): Promise<AuthedCheck> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "You must be signed in." };
  }

  return { ok: true, supabase, userId: user.id };
}

const optionalText = (v: FormDataEntryValue | null) =>
  typeof v === "string" && v.trim() ? v.trim() : null;

function resolveClassFilter(raw: string): string | null {
  return raw && (STUDENT_CLASSES as readonly string[]).includes(raw)
    ? raw
    : null;
}

function resolveTypeFilter(raw: string): StudentType | null {
  return raw && (STUDENT_TYPES as readonly string[]).includes(raw)
    ? (raw as StudentType)
    : null;
}

const taskSchema = z.object({
  subject: z.string().trim().min(1, "Subject is required"),
  description: z.string().nullable(),
  class_filter: z.string().trim(),
  type_filter: z.string().trim(),
  send_to: z.enum(SEND_TO_OPTIONS).default("all"),
  duration_days: z
    .coerce.number()
    .int()
    .min(1)
    .max(365)
    .nullable(),
});

export type TaskEmailResult = { email: string; sent: boolean };

export type TaskActionState =
  | { error: string }
  | { success: true; message: string; results: TaskEmailResult[] }
  | undefined;

/**
 * Homework/task documents are sent as an email attachment only — nothing is
 * uploaded to storage or persisted on the task row, per admin request.
 */
async function readAttachment(
  file: FormDataEntryValue | null
): Promise<{ filename: string; content: Buffer } | null> {
  if (!(file instanceof File) || file.size === 0) return null;
  if (file.size > 10 * 1024 * 1024) return null;
  const content = Buffer.from(await file.arrayBuffer());
  return { filename: file.name, content };
}

/**
 * Emails each student individually (rather than one bcc blast) so a failure
 * for one address doesn't hide whether the others actually went out — the
 * admin needs to see exactly which emails sent and which didn't.
 */
async function notifyStudents(
  students: { name: string; email: string }[],
  subject: string,
  description: string | null,
  dueDate: string | null,
  attachment: { filename: string; content: Buffer } | null
): Promise<TaskEmailResult[]> {
  const transport = getMailTransport();
  if (!transport) {
    return students.map((s) => ({ email: s.email, sent: false }));
  }

  const dueLine = dueDate
    ? `Due by: ${new Date(`${dueDate}T00:00:00`).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}`
    : "";

  const textLines = [
    `New task assigned: ${subject}`,
    "",
    description ?? "",
    dueLine,
    attachment ? `Attached: ${attachment.filename}` : "",
  ].filter(Boolean);

  const html = `<div style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6">
      <h2 style="margin:0 0 8px">${subject}</h2>
      ${description ? `<p style="margin:0 0 10px">${description.replace(/\n/g, "<br>")}</p>` : ""}
      ${dueLine ? `<p style="margin:0 0 10px"><strong>${dueLine}</strong></p>` : ""}
      ${attachment ? `<p style="margin:0;color:#78716c;font-size:12px">Attached: ${attachment.filename}</p>` : ""}
    </div>`;

  const results: TaskEmailResult[] = [];
  for (const s of students) {
    try {
      await transport.sendMail({
        from: MAIL_FROM,
        to: s.email,
        subject: `Task assigned: ${subject}`,
        text: textLines.join("\n"),
        html,
        attachments: attachment ? [attachment] : [],
      });
      results.push({ email: s.email, sent: true });
    } catch (err) {
      console.error(`Failed to send task notification email to ${s.email}`, err);
      results.push({ email: s.email, sent: false });
    }
  }
  return results;
}

export async function createTask(
  _state: TaskActionState,
  formData: FormData
): Promise<TaskActionState> {
  const auth = await requireAdmin();
  if (!auth.ok) return { error: auth.error };

  const parsed = taskSchema.safeParse({
    subject: formData.get("subject"),
    description: optionalText(formData.get("description")),
    class_filter: formData.get("class_filter") ?? "",
    type_filter: formData.get("type_filter") ?? "",
    send_to: formData.get("send_to") ?? "all",
    duration_days: optionalText(formData.get("duration_days")),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const classFilter = resolveClassFilter(parsed.data.class_filter);
  const typeFilter = resolveTypeFilter(parsed.data.type_filter);
  const selectedStudentIds = formData
    .getAll("selected_student_ids")
    .map(String)
    .filter(Boolean);

  const targets =
    parsed.data.send_to === "selected"
      ? await getStudentsByIds(selectedStudentIds)
      : await getMeetingInvitees(classFilter, typeFilter);

  const withEmail = targets.filter((s) => s.email);
  if (withEmail.length === 0) {
    return { error: "No students matched — pick a class or students with an email on file." };
  }

  const dueDate = parsed.data.duration_days
    ? new Date(Date.now() + parsed.data.duration_days * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10)
    : null;

  const attachment = await readAttachment(formData.get("document"));

  // Send first so each row can record whether its student's email actually
  // went out, rather than defaulting every row to "pending" and forgetting.
  const results = await notifyStudents(
    withEmail,
    parsed.data.subject,
    parsed.data.description,
    dueDate,
    attachment
  );
  const sentByEmail = new Map(results.map((r) => [r.email, r.sent]));

  const { error } = await auth.supabase.from("tasks").insert(
    withEmail.map((s) => ({
      title: parsed.data.subject,
      notes: parsed.data.description,
      assigned_to: s.userId,
      due_date: dueDate,
      due_time: null,
      notified_email: s.email,
      email_status: sentByEmail.get(s.email) ? "sent" : "failed",
      created_by: auth.userId,
    }))
  );

  if (error) return { error: error.message };

  revalidatePath("/admin/[sid]/[uid]", "layout");
  revalidatePath("/student/[sid]/[uid]", "layout");
  const sentCount = results.filter((r) => r.sent).length;
  return {
    success: true,
    message: `Task "${parsed.data.subject}" assigned to ${withEmail.length} student${
      withEmail.length === 1 ? "" : "s"
    }. Emailed ${sentCount} of ${results.length}.`,
    results,
  };
}

export async function setTaskStatus(formData: FormData) {
  const auth = await requireAuthed();
  if (!auth.ok) return;

  const id = formData.get("id");
  const status = formData.get("status");
  if (typeof id !== "string" || !id) return;
  if (!TASK_STATUSES.includes(status as TaskStatus)) return;

  // RLS (tasks_select_own_or_admin / tasks_update_own_status_or_admin) makes
  // this a no-op unless the caller is the assignee or an admin.
  await auth.supabase
    .from("tasks")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/[sid]/[uid]", "layout");
  revalidatePath("/student/[sid]/[uid]", "layout");
}

export type TaskSubmitState =
  | { error: string }
  | { success: true; message: string }
  | undefined;

/**
 * A student's completed-work submission. The PDF is emailed straight to the
 * admin who assigned the task and never stored — same "don't keep the file"
 * rule as task creation — and the task is marked completed on send.
 */
export async function submitTaskDocument(
  _state: TaskSubmitState,
  formData: FormData
): Promise<TaskSubmitState> {
  const auth = await requireAuthed();
  if (!auth.ok) return { error: auth.error };

  const id = formData.get("id");
  if (typeof id !== "string" || !id) return { error: "Invalid task." };

  const file = formData.get("document");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a PDF file to submit." };
  }
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return { error: "Only PDF files are accepted." };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { error: "File is too large (max 10 MB)." };
  }

  const { data: task } = await auth.supabase
    .from("tasks")
    .select("id, title, created_by")
    .eq("id", id)
    .eq("assigned_to", auth.userId)
    .maybeSingle();
  if (!task) return { error: "Task not found." };

  const { data: profile } = await auth.supabase
    .from("profiles")
    .select("full_name")
    .eq("id", auth.userId)
    .maybeSingle();
  const studentName = profile?.full_name ?? "A student";

  const adminClient = createAdminClient();
  const { data: adminUser } = await adminClient.auth.admin.getUserById(task.created_by);
  const adminEmail = adminUser?.user?.email ?? null;

  let emailed = false;
  if (adminEmail) {
    const transport = getMailTransport();
    if (transport) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        await transport.sendMail({
          from: MAIL_FROM,
          to: adminEmail,
          subject: `Task submitted: ${task.title}`,
          text: `${studentName} submitted "${task.title}". The document is attached.`,
          html: `<p>${studentName} submitted <strong>${task.title}</strong>. The document is attached.</p>`,
          attachments: [{ filename: file.name, content: buffer }],
        });
        emailed = true;
      } catch (err) {
        console.error("Failed to send task submission email", err);
      }
    }
  }

  const now = new Date().toISOString();
  const { error } = await auth.supabase
    .from("tasks")
    .update({ status: "completed", submitted_at: now, updated_at: now })
    .eq("id", id)
    .eq("assigned_to", auth.userId);
  if (error) return { error: error.message };

  revalidatePath("/admin/[sid]/[uid]", "layout");
  revalidatePath("/student/[sid]/[uid]", "layout");
  return {
    success: true,
    message: emailed
      ? "Submitted — emailed to your admin and marked completed."
      : "Submitted and marked completed, but the email could not be sent.",
  };
}

export async function deleteTask(formData: FormData) {
  const auth = await requireAdmin();
  if (!auth.ok) return;

  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  await auth.supabase.from("tasks").delete().eq("id", id);
  revalidatePath("/admin/[sid]/[uid]", "layout");
}
