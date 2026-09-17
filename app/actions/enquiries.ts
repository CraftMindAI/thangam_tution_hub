"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { createClient } from "../lib/supabase/server";
import { createAdminClient } from "../lib/supabase/admin";
import { MAIL_FROM, sendNotificationEmail } from "../lib/mailer";
import { createStreamCall } from "./calendar";
import {
  ENQUIRY_MIN_DURATION_MINUTES,
  ENQUIRY_MAX_DURATION_MINUTES,
  ENQUIRY_MAX_SUGGESTED_TIMES,
  ENQUIRY_REJECTION_REASONS,
  formatEnquiryDate,
  formatTimeLabel,
  type EnquiryStatus,
} from "../lib/enquiries";

export type EnquiryActionState =
  | { error: string; conflict?: boolean }
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
    return { ok: false, error: "Only admins can manage enquiries." };
  }

  return { ok: true, supabase, userId: user.id };
}

const timeRegex = /^\d{2}:\d{2}$/;

const acceptSchema = z.object({
  enquiry_id: z.string().trim().min(1, "Missing enquiry."),
  admin_duration_minutes: z.coerce
    .number()
    .int()
    .min(ENQUIRY_MIN_DURATION_MINUTES, "Minimum duration is 40 minutes")
    .max(ENQUIRY_MAX_DURATION_MINUTES, "Maximum duration is 1 hour 30 minutes"),
  payment_amount: z.coerce.number().positive("Enter a valid payment amount"),
  proposed_date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date"),
  admin_note: z.string().trim().nullable(),
});

export async function acceptEnquiryProposal(
  _state: EnquiryActionState,
  formData: FormData
): Promise<EnquiryActionState> {
  const auth = await requireAdmin();
  if (!auth.ok) return { error: auth.error };

  const suggestedTimes = [
    formData.get("time_1"),
    formData.get("time_2"),
    formData.get("time_3"),
  ]
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter(Boolean)
    .slice(0, ENQUIRY_MAX_SUGGESTED_TIMES);

  if (suggestedTimes.length === 0) {
    return { error: "Suggest at least one class time." };
  }
  if (!suggestedTimes.every((t) => timeRegex.test(t))) {
    return { error: "Enter valid times (e.g. 18:00)." };
  }

  const parsed = acceptSchema.safeParse({
    enquiry_id: formData.get("enquiry_id"),
    admin_duration_minutes: formData.get("admin_duration_minutes"),
    payment_amount: formData.get("payment_amount"),
    proposed_date: formData.get("proposed_date"),
    admin_note: formData.get("admin_note") || null,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const admin = createAdminClient();
  const { data: enquiry } = await admin
    .from("student_enquiries")
    .select("id, user_id, title, status")
    .eq("id", parsed.data.enquiry_id)
    .single();
  if (!enquiry) return { error: "Enquiry not found." };
  if ((enquiry.status as EnquiryStatus) !== "requested") {
    return { error: "This enquiry has already been reviewed." };
  }

  const dayStart = new Date(`${parsed.data.proposed_date}T00:00:00`);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);
  const { data: dayEvents } = await admin
    .from("calendar_events")
    .select("starts_at, duration_minutes")
    .gte("starts_at", dayStart.toISOString())
    .lt("starts_at", dayEnd.toISOString());

  const durationMs = parsed.data.admin_duration_minutes * 60 * 1000;
  const conflictingTimes = suggestedTimes.filter((t) => {
    const start = new Date(`${parsed.data.proposed_date}T${t}`).getTime();
    const end = start + durationMs;
    return (dayEvents ?? []).some((ev) => {
      const evStart = new Date(ev.starts_at).getTime();
      const evEnd = evStart + ev.duration_minutes * 60 * 1000;
      return start < evEnd && evStart < end;
    });
  });

  if (conflictingTimes.length > 0) {
    return {
      error: `You have a meeting on this time period (${conflictingTimes
        .map(formatTimeLabel)
        .join(", ")}). Choose other timing.`,
      conflict: true,
    };
  }

  const { error } = await admin
    .from("student_enquiries")
    .update({
      status: "reviewed",
      admin_duration_minutes: parsed.data.admin_duration_minutes,
      payment_amount: parsed.data.payment_amount,
      proposed_date: parsed.data.proposed_date,
      suggested_times: suggestedTimes,
      admin_note: parsed.data.admin_note,
      reviewed_by: auth.userId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.enquiry_id);
  if (error) return { error: error.message };

  const { data: authUser } = await admin.auth.admin.getUserById(enquiry.user_id);
  const studentEmail = authUser?.user?.email;
  if (studentEmail) {
    await sendNotificationEmail(studentEmail, `Proposal ready: ${enquiry.title}`, [
      `Good news — your enquiry "${enquiry.title}" has been reviewed.`,
      `Class duration: ${parsed.data.admin_duration_minutes} minutes`,
      `Payment amount: ₹${parsed.data.payment_amount}`,
      `Proposed date: ${formatEnquiryDate(parsed.data.proposed_date)}`,
      `Suggested times: ${suggestedTimes.map(formatTimeLabel).join(", ")}`,
      parsed.data.admin_note ? `Note: ${parsed.data.admin_note}` : "",
      "Sign in to your student portal to pick a time and pay.",
    ]);
  }

  revalidatePath("/admin/[sid]/[uid]", "layout");
  revalidatePath("/student/[sid]/[uid]", "layout");
  return { success: true, message: "Proposal sent to the student." };
}

const rejectSchema = z.object({
  enquiry_id: z.string().trim().min(1, "Missing enquiry."),
  reason: z.enum(ENQUIRY_REJECTION_REASONS),
  admin_note: z.string().trim().nullable(),
});

export async function rejectEnquiry(
  _state: EnquiryActionState,
  formData: FormData
): Promise<EnquiryActionState> {
  const auth = await requireAdmin();
  if (!auth.ok) return { error: auth.error };

  const parsed = rejectSchema.safeParse({
    enquiry_id: formData.get("enquiry_id"),
    reason: formData.get("reason"),
    admin_note: formData.get("admin_note") || null,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  if (parsed.data.reason === "Other" && !parsed.data.admin_note) {
    return { error: "Give the student a reason." };
  }
  const finalNote =
    parsed.data.reason === "Other" ? parsed.data.admin_note! : parsed.data.reason;

  const admin = createAdminClient();
  const { data: enquiry } = await admin
    .from("student_enquiries")
    .select("id, user_id, title, status")
    .eq("id", parsed.data.enquiry_id)
    .single();
  if (!enquiry) return { error: "Enquiry not found." };
  if ((enquiry.status as EnquiryStatus) !== "requested") {
    return { error: "This enquiry has already been reviewed." };
  }

  const { error } = await admin
    .from("student_enquiries")
    .update({
      status: "rejected",
      admin_note: finalNote,
      reviewed_by: auth.userId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.enquiry_id);
  if (error) return { error: error.message };

  const { data: authUser } = await admin.auth.admin.getUserById(enquiry.user_id);
  const studentEmail = authUser?.user?.email;
  if (studentEmail) {
    await sendNotificationEmail(studentEmail, `Update on your enquiry: ${enquiry.title}`, [
      `Your enquiry "${enquiry.title}" could not be taken forward.`,
      `Reason: ${finalNote}`,
      "You're welcome to submit a new enquiry any time.",
    ]);
  }

  revalidatePath("/admin/[sid]/[uid]", "layout");
  revalidatePath("/student/[sid]/[uid]", "layout");
  return { success: true, message: "Enquiry rejected and student notified." };
}

const scheduleSchema = z.object({
  enquiry_id: z.string().trim().min(1, "Missing enquiry."),
  date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date"),
  time: z.string().trim().regex(timeRegex, "Enter a valid time"),
});

export async function scheduleEnquiryMeeting(
  _state: EnquiryActionState,
  formData: FormData
): Promise<EnquiryActionState> {
  const auth = await requireAdmin();
  if (!auth.ok) return { error: auth.error };

  const parsed = scheduleSchema.safeParse({
    enquiry_id: formData.get("enquiry_id"),
    date: formData.get("date"),
    time: formData.get("time"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const admin = createAdminClient();
  const { data: enquiry } = await admin
    .from("student_enquiries")
    .select("id, user_id, title, status, admin_duration_minutes")
    .eq("id", parsed.data.enquiry_id)
    .single();
  if (!enquiry) return { error: "Enquiry not found." };
  if ((enquiry.status as EnquiryStatus) !== "paid") {
    return { error: "This enquiry hasn't been paid for yet." };
  }

  const startsAt = new Date(`${parsed.data.date}T${parsed.data.time}`);
  if (Number.isNaN(startsAt.getTime())) {
    return { error: "Enter a valid date and time." };
  }
  const durationMinutes = enquiry.admin_duration_minutes ?? 60;

  const callId = randomUUID();
  const callCreated = await createStreamCall(
    callId,
    auth.userId,
    startsAt,
    enquiry.title,
    durationMinutes
  );

  const { data: event, error: eventErr } = await admin
    .from("calendar_events")
    .insert({
      title: enquiry.title,
      meeting_type: "inquiry",
      starts_at: startsAt.toISOString(),
      duration_minutes: durationMinutes,
      enquiry_user_id: enquiry.user_id,
      call_id: callCreated ? callId : null,
      created_by: auth.userId,
    })
    .select("id")
    .single();
  if (eventErr || !event) {
    return { error: eventErr?.message ?? "Could not create the meeting." };
  }

  const { error } = await admin
    .from("student_enquiries")
    .update({
      status: "scheduled",
      scheduled_event_id: event.id,
      scheduled_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.enquiry_id);
  if (error) return { error: error.message };

  await admin
    .from("payments")
    .update({ meeting_id: event.id })
    .eq("enquiry_id", parsed.data.enquiry_id);

  const { data: authUser } = await admin.auth.admin.getUserById(enquiry.user_id);
  const studentEmail = authUser?.user?.email;
  const when = startsAt.toLocaleString("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
  });
  if (studentEmail) {
    await sendNotificationEmail(studentEmail, `Class scheduled: ${enquiry.title}`, [
      `Your class "${enquiry.title}" has been scheduled.`,
      `When: ${when} (${durationMinutes} min)`,
      "You'll find it under Meetings in your student portal.",
    ]);
  }
  if (MAIL_FROM) {
    await sendNotificationEmail(MAIL_FROM, `Class scheduled: ${enquiry.title}`, [
      `The enquiry "${enquiry.title}" has been scheduled.`,
      `When: ${when} (${durationMinutes} min)`,
      callCreated ? `Join link: /admin/meeting/${callId}` : "Video call could not be created.",
    ]);
  }

  revalidatePath("/admin/[sid]/[uid]", "layout");
  revalidatePath("/student/[sid]/[uid]", "layout");
  return { success: true, message: "Class scheduled and student notified." };
}
