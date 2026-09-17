"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../lib/supabase/server";
import {
  demoRequestSchema,
  DEMO_REQUEST_STATUSES,
  type DemoRequestFieldErrors,
  type DemoRequestStatus,
} from "../lib/validation/demo";

export type DemoRequestState =
  | { errors: DemoRequestFieldErrors; formError?: string }
  | { success: true }
  | undefined;

export async function submitDemoRequest(
  _state: DemoRequestState,
  formData: FormData
): Promise<DemoRequestState> {
  const parsed = demoRequestSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("demo_requests").insert(parsed.data);

  if (error) {
    return { errors: {}, formError: error.message };
  }

  return { success: true };
}

/** Admin-only: RLS (demo_requests_update_admin) enforces this at the DB level too. */
export async function setDemoRequestStatus(formData: FormData): Promise<void> {
  const id = formData.get("id");
  const status = formData.get("status");
  if (typeof id !== "string" || !id) return;
  if (!DEMO_REQUEST_STATUSES.includes(status as DemoRequestStatus)) return;

  const supabase = await createClient();
  await supabase.from("demo_requests").update({ status }).eq("id", id);

  revalidatePath("/admin/[sid]/[uid]", "layout");
}

/**
 * Auto-completes demo requests once their scheduled demo class has actually
 * finished (now is past starts_at + duration). There's no separate "the demo
 * happened" signal to hook into, so this reconciles by time instead — called
 * whenever the admin Demo Requests page loads.
 *
 * A demo request is linked to its meeting via calendar_event_invites, which
 * already records the exact email addresses invited to that event (works for
 * both "all pending" and hand-picked send-to modes).
 */
export async function reconcileCompletedDemoMeetings(): Promise<void> {
  const supabase = await createClient();

  const { data: pastDemoEvents } = await supabase
    .from("calendar_events")
    .select("id, starts_at, duration_minutes")
    .eq("meeting_type", "demo")
    .lt("starts_at", new Date().toISOString());

  const now = Date.now();
  const endedEventIds = (pastDemoEvents ?? [])
    .filter((e) => new Date(e.starts_at).getTime() + e.duration_minutes * 60 * 1000 < now)
    .map((e) => e.id);

  if (endedEventIds.length === 0) return;

  const { data: invites } = await supabase
    .from("calendar_event_invites")
    .select("email")
    .in("event_id", endedEventIds);

  const emails = [...new Set((invites ?? []).map((i) => i.email))].filter(Boolean);
  if (emails.length === 0) return;

  await supabase
    .from("demo_requests")
    .update({ status: "completed" })
    .eq("status", "pending")
    .in("email", emails);
}
