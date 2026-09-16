"use server";

import { revalidatePath } from "next/cache";
import * as z from "zod";
import { createClient } from "../lib/supabase/server";
import { TASK_STATUSES, type TaskStatus } from "../lib/tasks";


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

const taskSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  // assigned_to is NOT NULL in the table, so a task must have an owner.
  assigned_to: z.string().uuid("Choose who this task is assigned to"),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid due date")
    .nullable(),
  due_time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Enter a valid due time")
    .nullable(),
  notes: z.string().nullable(),
});

export type TaskActionState =
  | { error: string }
  | { success: true; message: string }
  | undefined;

export async function createTask(
  _state: TaskActionState,
  formData: FormData
): Promise<TaskActionState> {
  const auth = await requireAdmin();
  if (!auth.ok) return { error: auth.error };

  const parsed = taskSchema.safeParse({
    title: formData.get("title"),
    assigned_to: formData.get("assigned_to"),
    due_date: optionalText(formData.get("due_date")),
    due_time: optionalText(formData.get("due_time")),
    notes: optionalText(formData.get("notes")),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { error } = await auth.supabase.from("tasks").insert({
    ...parsed.data,
    created_by: auth.userId,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/[sid]/[uid]", "layout");
  revalidatePath("/student/[sid]/[uid]", "layout");
  return { success: true, message: `Task "${parsed.data.title}" assigned.` };
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
  await auth.supabase.from("tasks").update({ status }).eq("id", id);
  revalidatePath("/admin/[sid]/[uid]", "layout");
  revalidatePath("/student/[sid]/[uid]", "layout");
}

export async function deleteTask(formData: FormData) {
  const auth = await requireAdmin();
  if (!auth.ok) return;

  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  await auth.supabase.from("tasks").delete().eq("id", id);
  revalidatePath("/admin/[sid]/[uid]", "layout");
}
