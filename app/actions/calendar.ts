"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import * as z from "zod";
import { StreamClient } from "@stream-io/node-sdk";
import { createClient } from "../lib/supabase/server";
import { createAdminClient } from "../lib/supabase/admin";
import { getMailTransport, MAIL_FROM } from "../lib/mailer";
import { MEETING_TYPES, MEETING_TYPE_LABELS, SEND_TO_OPTIONS } from "../lib/calendar";
import { STUDENT_CLASSES } from "../lib/students";
import { getMeetingInvitees, getEnquiryStudents, getStudentsByIds } from "../lib/roster";

export type CalendarActionState =
  | { error: string }
  | { success: true; message: string }
  | undefined;

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "You must be signed in." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") {
    return { ok: false as const, error: "Only admins can manage the calendar." };
  }
  return { ok: true as const, supabase, userId: user.id, userEmail: user.email ?? null };
}

type Supabase = Awaited<ReturnType<typeof createClient>>;

async function siteOrigin() {
  const h = await headers();
  const host = h.get("host");
  const proto =
    h.get("x-forwarded-proto") ??
    (host?.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

const eventSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim(),
  meeting_type: z.enum(MEETING_TYPES),
  date: z.string().trim().min(1, "Date is required"),
  time: z.string().trim().min(1, "Time is required"),
  duration_minutes: z.coerce.number().int().min(5).max(600),
  class_filter: z.string().trim(),
  enquiry_user_id: z.string().trim(),
  send_to: z.enum(SEND_TO_OPTIONS).default("all"),
});

const MAX_OCCURRENCES = 60;
const DEFAULT_HORIZON_DAYS = 28;

/**
 * Build the list of local Date objects to schedule. The picked date is always
 * included; if weekdays/weekends are selected, matching days up to `until`
 * (or a 4-week horizon) are added too.
 */
function occurrenceDates(
  first: Date,
  weekdays: boolean,
  weekends: boolean,
  until: string
): Date[] {
  if (!weekdays && !weekends) return [first];

  let end: Date;
  if (/^\d{4}-\d{2}-\d{2}$/.test(until)) {
    end = new Date(`${until}T23:59:59`);
  } else {
    end = new Date(first);
    end.setDate(end.getDate() + DEFAULT_HORIZON_DAYS);
  }

  const out: Date[] = [];
  const cur = new Date(first);
  while (cur <= end && out.length < MAX_OCCURRENCES) {
    const dow = cur.getDay();
    const isWeekend = dow === 0 || dow === 6;
    const sameAsFirst =
      cur.getFullYear() === first.getFullYear() &&
      cur.getMonth() === first.getMonth() &&
      cur.getDate() === first.getDate();
    if (sameAsFirst || (isWeekend ? weekends : weekdays)) {
      const d = new Date(first);
      d.setFullYear(cur.getFullYear(), cur.getMonth(), cur.getDate());
      out.push(d);
    }
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

function resolveClassFilter(raw: string): string | null {
  return raw && (STUDENT_CLASSES as readonly string[]).includes(raw) ? raw : null;
}

export async function createStreamCall(
  callId: string,
  userId: string,
  startsAt: Date,
  title: string,
  durationMinutes: number = 30
): Promise<boolean> {
  const key = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  const secret = process.env.STREAM_SECRET_KEY;
  if (!key || !secret) return false;

  try {
    const client = new StreamClient(key, secret, { timeout: 30000 });
    await client.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: userId,
        starts_at: startsAt,
        custom: { title, duration_minutes: durationMinutes },
      },
    });
    return true;
  } catch (err) {
    console.error("Failed to create Stream call for calendar event", err);
    return false;
  }
}

type UploadedAttachment = {
  url: string | null;
  name: string;
  buffer: Buffer;
};

async function uploadAttachment(
  file: File
): Promise<UploadedAttachment | { error: string }> {
  if (file.size > 10 * 1024 * 1024) {
    return { error: "Attachment is too large (max 10 MB)." };
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const adminClient = createAdminClient();
  const path = `${randomUUID()}-${file.name.replace(/[^\w.\-]+/g, "_")}`;
  const { error: uploadErr } = await adminClient.storage
    .from("event-attachments")
    .upload(path, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
  let url: string | null = null;
  if (!uploadErr) {
    url = adminClient.storage.from("event-attachments").getPublicUrl(path).data
      .publicUrl;
  }
  return { url, name: file.name, buffer };
}

/**
 * Replace the invite list for an event.
 *
 * An "inquiry" meeting is about one student's enquiry, so only that student is
 * invited and the class is ignored. Every other type invites the Offline
 * students it applies to — the whole roster when no class is set, otherwise
 * just that class.
 *
 * When send_to is 'selected', only the hand-picked students are invited.
 */
async function syncEventInvites(
  supabase: Supabase,
  eventId: string,
  classFilter: string | null,
  enquiryUserId: string | null,
  sendTo: "all" | "selected" = "all",
  selectedStudentIds: string[] = []
): Promise<string[]> {
  await supabase.from("calendar_event_invites").delete().eq("event_id", eventId);

  // Also clear previous selected-students join rows.
  await supabase.from("calendar_event_selected_students").delete().eq("event_id", eventId);

  let invitees: { name: string; email: string }[];

  if (enquiryUserId) {
    // Inquiry meeting — only the enquiry student.
    invitees = (await getEnquiryStudents())
      .filter((s) => s.userId === enquiryUserId && s.email)
      .map((s) => ({ name: s.name, email: s.email }));
  } else if (sendTo === "selected" && selectedStudentIds.length > 0) {
    // Hand-picked students.
    const students = await getStudentsByIds(selectedStudentIds);
    invitees = students.map((s) => ({ name: s.name, email: s.email }));
    // Persist the selection for edit form.
    const selectRows = selectedStudentIds.map((uid) => ({
      event_id: eventId,
      user_id: uid,
    }));
    await supabase.from("calendar_event_selected_students").insert(selectRows);
  } else if (sendTo === "selected") {
    invitees = [];
  } else {
    // All students (filtered by class).
    invitees = await getMeetingInvitees(classFilter);
  }

  const rows = invitees
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((s) => ({
      event_id: eventId,
      student_name: s.name,
      email: s.email,
      status: "pending" as const,
    }));

  if (rows.length) {
    await supabase.from("calendar_event_invites").insert(rows);
  }
  return rows.map((r) => r.email);
}

type NotifyKind = "invited" | "updated" | "rescheduled" | "cancelled";

type NotifyEvent = {
  title: string;
  description: string | null;
  meeting_type: (typeof MEETING_TYPES)[number];
  starts_at: string;
  duration_minutes: number;
  call_id: string | null;
  attachment_url: string | null;
  attachment_name: string | null;
  series_note?: string | null;
};

const NOTIFY_SUBJECT: Record<NotifyKind, string> = {
  invited: "Invitation",
  updated: "Updated",
  rescheduled: "Rescheduled",
  cancelled: "Cancelled",
};

const NOTIFY_INTRO: Record<NotifyKind, string> = {
  invited: "You're invited to the following meeting.",
  updated: "This meeting has been updated. The latest details are below.",
  rescheduled: "This meeting has been rescheduled.",
  cancelled: "This meeting has been cancelled.",
};

async function notifyInvitees(
  kind: NotifyKind,
  ev: NotifyEvent,
  emails: string[],
  origin: string,
  attachment: { filename: string; content: Buffer } | null,
  adminUserEmail?: string | null
): Promise<boolean> {
  const transport = getMailTransport();
  if (!transport) return false;

  // Always include the admin email so the admin receives the meeting link too.
  const adminEmail = MAIL_FROM;
  const allRecipients = new Set(emails);
  if (adminEmail) allRecipients.add(adminEmail);
  if (adminUserEmail) allRecipients.add(adminUserEmail);
  if (allRecipients.size === 0) return false;

  const when = new Date(ev.starts_at).toLocaleString("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
  });
  const joinUrl =
    kind !== "cancelled" && ev.call_id
      ? `${origin}/admin/meeting/${ev.call_id}`
      : null;

  const textLines = [
    NOTIFY_INTRO[kind],
    "",
    `Meeting: ${ev.title}`,
    `Type: ${MEETING_TYPE_LABELS[ev.meeting_type]}`,
    `When: ${when} (${ev.duration_minutes} min)${
      ev.series_note ? ` — ${ev.series_note}` : ""
    }`,
    ev.description ? `\n${ev.description}` : "",
    joinUrl ? `\nMeeting Link: ${joinUrl}` : "",
    kind !== "cancelled" && ev.attachment_url
      ? `Attachment: ${ev.attachment_url}`
      : "",
  ].filter(Boolean);

  const html = `<div style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6">
      <p style="margin:0 0 12px">${NOTIFY_INTRO[kind]}</p>
      <h2 style="margin:0 0 8px">${ev.title}</h2>
      <p style="margin:0 0 4px"><strong>Type:</strong> ${MEETING_TYPE_LABELS[ev.meeting_type]}</p>
      <p style="margin:0 0 4px"><strong>When:</strong> ${when} (${ev.duration_minutes} min)${
        ev.series_note ? ` &mdash; ${ev.series_note}` : ""
      }</p>
      ${ev.description ? `<p style="margin:12px 0">${ev.description.replace(/\n/g, "<br>")}</p>` : ""}
      ${
        joinUrl
          ? `<div style="margin:16px 0">
              <a href="${joinUrl}" style="background:#0f766e;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none;font-weight:600;display:inline-block">Join meeting</a>
              <p style="margin:12px 0 4px;color:#475569;font-size:13px"><strong>Meeting Link:</strong></p>
              <p style="margin:0;word-break:break-all"><a href="${joinUrl}" style="color:#0f766e;text-decoration:underline;font-size:13px">${joinUrl}</a></p>
            </div>`
          : ""
      }
      ${kind !== "cancelled" && ev.attachment_url ? `<p style="margin:8px 0"><a href="${ev.attachment_url}">${ev.attachment_name ?? "Attachment"}</a></p>` : ""}
    </div>`;

  try {
    const recipientList = [...allRecipients];
    console.log(`[Mailer] Sending "${kind}" email to ${recipientList.length} recipient(s):`, recipientList);
    const info = await transport.sendMail({
      from: MAIL_FROM,
      to: MAIL_FROM,
      bcc: recipientList,
      subject: `${NOTIFY_SUBJECT[kind]}: ${ev.title}`,
      text: textLines.join("\n"),
      html,
      attachments: attachment ? [attachment] : [],
    });
    console.log(`[Mailer] Email sent successfully! MessageId: ${info.messageId}`);
    return true;
  } catch (err) {
    console.error(`[Mailer] Failed to send "${kind}" email:`, err);
    return false;
  }
}

async function markInviteStatus(
  supabase: Supabase,
  eventId: string,
  status: "sent" | "failed"
) {
  await supabase
    .from("calendar_event_invites")
    .update({ status })
    .eq("event_id", eventId);
}

function emailedSuffix(emailed: boolean, count: number) {
  if (count === 0) return "No students matched to notify.";
  return emailed
    ? `Emailed ${count} student${count === 1 ? "" : "s"}.`
    : `${count} student${count === 1 ? "" : "s"} on the invite list (email not sent).`;
}

export async function createCalendarEvent(
  _state: CalendarActionState,
  formData: FormData
): Promise<CalendarActionState> {
  const auth = await requireAdmin();
  if (!auth.ok) return { error: auth.error };

  const parsed = eventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") ?? "",
    meeting_type: formData.get("meeting_type"),
    date: formData.get("date"),
    time: formData.get("time"),
    duration_minutes: formData.get("duration_minutes"),
    class_filter: formData.get("class_filter") ?? "",
    enquiry_user_id: formData.get("enquiry_user_id") ?? "",
    send_to: formData.get("send_to") ?? "all",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const firstStart = new Date(`${parsed.data.date}T${parsed.data.time}`);
  if (Number.isNaN(firstStart.getTime())) {
    return { error: "Enter a valid date and time." };
  }
  const classFilter = resolveClassFilter(parsed.data.class_filter);
  // Only an inquiry meeting targets a single student.
  const enquiryUserId =
    parsed.data.meeting_type === "inquiry" && parsed.data.enquiry_user_id
      ? parsed.data.enquiry_user_id
      : null;

  const sendTo = parsed.data.send_to;
  const selectedStudentIds = formData.getAll("selected_student_ids").map(String).filter(Boolean);

  const weekdays = formData.get("repeat_weekdays") === "on";
  const weekends = formData.get("repeat_weekends") === "on";
  const until = String(formData.get("repeat_until") ?? "");
  const dates = occurrenceDates(firstStart, weekdays, weekends, until);

  let attachmentUrl: string | null = null;
  let attachmentName: string | null = null;
  let attachmentBuffer: Buffer | null = null;
  const file = formData.get("attachment");
  if (file instanceof File && file.size > 0) {
    const up = await uploadAttachment(file);
    if ("error" in up) return { error: up.error };
    attachmentUrl = up.url;
    attachmentName = up.name;
    attachmentBuffer = up.buffer;
  }

  const seriesId = dates.length > 1 ? randomUUID() : null;

  // One independent event row (+ call + invite list) per day.
  const eventIds: string[] = [];
  let firstCallId: string | null = null;
  const allEmails = new Set<string>();

  for (const start of dates) {
    const callId = randomUUID();
    const callCreated = await createStreamCall(
      callId,
      auth.userId,
      start,
      parsed.data.title,
      parsed.data.duration_minutes
    );

    const { data: event, error: eventErr } = await auth.supabase
      .from("calendar_events")
      .insert({
        title: parsed.data.title,
        description: parsed.data.description || null,
        meeting_type: parsed.data.meeting_type,
        starts_at: start.toISOString(),
        duration_minutes: parsed.data.duration_minutes,
        class_filter: classFilter,
        enquiry_user_id: enquiryUserId,
        call_id: callCreated ? callId : null,
        attachment_url: attachmentUrl,
        attachment_name: attachmentName,
        series_id: seriesId,
        send_to: sendTo,
        created_by: auth.userId,
      })
      .select("id")
      .single();

    if (eventErr || !event) {
      return { error: eventErr?.message ?? "Could not save the event." };
    }
    eventIds.push(event.id);
    if (!firstCallId && callCreated) firstCallId = callId;

    const emails = await syncEventInvites(auth.supabase, event.id, classFilter, enquiryUserId, sendTo, selectedStudentIds);
    emails.forEach((e) => allEmails.add(e));
  }

  const emails = [...allEmails];
  const seriesNote =
    dates.length > 1
      ? `${dates.length} sessions (${[
          weekdays ? "weekdays" : "",
          weekends ? "weekends" : "",
        ]
          .filter(Boolean)
          .join(" & ")}) through ${dates[dates.length - 1].toLocaleDateString(
          "en-IN",
          { day: "numeric", month: "short" }
        )}`
      : null;

  const emailed = await notifyInvitees(
    "invited",
    {
      title: parsed.data.title,
      description: parsed.data.description || null,
      meeting_type: parsed.data.meeting_type,
      starts_at: dates[0].toISOString(),
      duration_minutes: parsed.data.duration_minutes,
      call_id: firstCallId,
      attachment_url: attachmentUrl,
      attachment_name: attachmentName,
      series_note: seriesNote,
    },
    emails,
    await siteOrigin(),
    attachmentBuffer && attachmentName
      ? { filename: attachmentName, content: attachmentBuffer }
      : null,
    auth.userEmail
  );
  if (emails.length) {
    for (const eid of eventIds) {
      await markInviteStatus(auth.supabase, eid, emailed ? "sent" : "failed");
    }
  }

  revalidatePath("/admin/[sid]/[uid]", "layout");
  return {
    success: true,
    message: `${dates.length > 1 ? `${dates.length} meetings scheduled` : "Meeting scheduled"}. ${emailedSuffix(
      emailed,
      emails.length
    )}`,
  };
}

export async function updateCalendarEvent(
  _state: CalendarActionState,
  formData: FormData
): Promise<CalendarActionState> {
  const auth = await requireAdmin();
  if (!auth.ok) return { error: auth.error };

  const id = formData.get("id");
  if (typeof id !== "string" || !id) return { error: "Missing event." };

  const parsed = eventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") ?? "",
    meeting_type: formData.get("meeting_type"),
    date: formData.get("date"),
    time: formData.get("time"),
    duration_minutes: formData.get("duration_minutes"),
    class_filter: formData.get("class_filter") ?? "",
    enquiry_user_id: formData.get("enquiry_user_id") ?? "",
    send_to: formData.get("send_to") ?? "all",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { data: existing } = await auth.supabase
    .from("calendar_events")
    .select("call_id, attachment_url, attachment_name, send_to")
    .eq("id", id).eq("created_by", auth.userId)
    .single();
  if (!existing) return { error: "That meeting no longer exists." };

  const startsAt = new Date(`${parsed.data.date}T${parsed.data.time}`);
  if (Number.isNaN(startsAt.getTime())) {
    return { error: "Enter a valid date and time." };
  }
  const classFilter = resolveClassFilter(parsed.data.class_filter);
  // Only an inquiry meeting targets a single student.
  const enquiryUserId =
    parsed.data.meeting_type === "inquiry" && parsed.data.enquiry_user_id
      ? parsed.data.enquiry_user_id
      : null;
  const sendTo = parsed.data.send_to;
  const selectedStudentIds = formData.getAll("selected_student_ids").map(String).filter(Boolean);

  let attachmentUrl: string | null = existing.attachment_url;
  let attachmentName: string | null = existing.attachment_name;
  let newAttachmentBuffer: Buffer | null = null;
  const file = formData.get("attachment");
  if (file instanceof File && file.size > 0) {
    const up = await uploadAttachment(file);
    if ("error" in up) return { error: up.error };
    attachmentUrl = up.url;
    attachmentName = up.name;
    newAttachmentBuffer = up.buffer;
  }

  const { error: updateErr } = await auth.supabase
    .from("calendar_events")
    .update({
      title: parsed.data.title,
      description: parsed.data.description || null,
      meeting_type: parsed.data.meeting_type,
      starts_at: startsAt.toISOString(),
      duration_minutes: parsed.data.duration_minutes,
      class_filter: classFilter,
      enquiry_user_id: enquiryUserId,
      attachment_url: attachmentUrl,
      attachment_name: attachmentName,
      send_to: sendTo,
    })
    .eq("id", id).eq("created_by", auth.userId);
  if (updateErr) return { error: updateErr.message };

  const emails = await syncEventInvites(auth.supabase, id, classFilter, enquiryUserId, sendTo, selectedStudentIds);
  const emailed = await notifyInvitees(
    "updated",
    {
      title: parsed.data.title,
      description: parsed.data.description || null,
      meeting_type: parsed.data.meeting_type,
      starts_at: startsAt.toISOString(),
      duration_minutes: parsed.data.duration_minutes,
      call_id: existing.call_id,
      attachment_url: attachmentUrl,
      attachment_name: attachmentName,
    },
    emails,
    await siteOrigin(),
    newAttachmentBuffer && attachmentName
      ? { filename: attachmentName, content: newAttachmentBuffer }
      : null,
    auth.userEmail
  );
  if (emails.length) {
    await markInviteStatus(auth.supabase, id, emailed ? "sent" : "failed");
  }

  revalidatePath("/admin/[sid]/[uid]", "layout");
  return {
    success: true,
    message: `Meeting updated. ${emailedSuffix(emailed, emails.length)}`,
  };
}

const rescheduleSchema = z.object({
  id: z.string().trim().min(1, "Missing event."),
  date: z.string().trim().min(1, "Date is required"),
  time: z.string().trim().min(1, "Time is required"),
});

export async function rescheduleCalendarEvent(
  _state: CalendarActionState,
  formData: FormData
): Promise<CalendarActionState> {
  const auth = await requireAdmin();
  if (!auth.ok) return { error: auth.error };

  const parsed = rescheduleSchema.safeParse({
    id: formData.get("id"),
    date: formData.get("date"),
    time: formData.get("time"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const startsAt = new Date(`${parsed.data.date}T${parsed.data.time}`);
  if (Number.isNaN(startsAt.getTime())) {
    return { error: "Enter a valid date and time." };
  }

  const { data: existing } = await auth.supabase
    .from("calendar_events")
    .select(
      "title, description, meeting_type, duration_minutes, call_id, attachment_url, attachment_name"
    )
    .eq("id", parsed.data.id).eq("created_by", auth.userId)
    .single();
  if (!existing) return { error: "That meeting no longer exists." };

  const { error } = await auth.supabase
    .from("calendar_events")
    .update({ starts_at: startsAt.toISOString() })
    .eq("id", parsed.data.id).eq("created_by", auth.userId);
  if (error) return { error: error.message };

  const { data: inviteRows } = await auth.supabase
    .from("calendar_event_invites")
    .select("email")
    .eq("event_id", parsed.data.id);
  const emails = (inviteRows ?? []).map((r) => r.email as string);

  const emailed = await notifyInvitees(
    "rescheduled",
    { ...existing, starts_at: startsAt.toISOString() },
    emails,
    await siteOrigin(),
    null,
    auth.userEmail
  );
  if (emails.length) {
    await markInviteStatus(
      auth.supabase,
      parsed.data.id,
      emailed ? "sent" : "failed"
    );
  }

  revalidatePath("/admin/[sid]/[uid]", "layout");
  return {
    success: true,
    message: `Meeting rescheduled. ${emailedSuffix(emailed, emails.length)}`,
  };
}

export async function cancelCalendarEvent(
  _state: CalendarActionState,
  formData: FormData
): Promise<CalendarActionState> {
  const auth = await requireAdmin();
  if (!auth.ok) return { error: auth.error };

  const id = formData.get("id");
  if (typeof id !== "string" || !id) return { error: "Missing event." };

  const { data: existing } = await auth.supabase
    .from("calendar_events")
    .select(
      "title, description, meeting_type, starts_at, duration_minutes, call_id, attachment_url, attachment_name"
    )
    .eq("id", id).eq("created_by", auth.userId)
    .single();
  if (!existing) return { error: "That meeting no longer exists." };

  const { data: inviteRows } = await auth.supabase
    .from("calendar_event_invites")
    .select("email")
    .eq("event_id", id);
  const emails = (inviteRows ?? []).map((r) => r.email as string);

  const { error } = await auth.supabase
    .from("calendar_events")
    .delete()
    .eq("id", id).eq("created_by", auth.userId);
  if (error) return { error: error.message };

  const emailed = await notifyInvitees(
    "cancelled",
    existing as NotifyEvent,
    emails,
    await siteOrigin(),
    null,
    auth.userEmail
  );

  revalidatePath("/admin/[sid]/[uid]", "layout");
  return {
    success: true,
    message: `Meeting cancelled. ${
      emails.length
        ? emailed
          ? `${emails.length} student${emails.length === 1 ? "" : "s"} notified.`
          : "Notification email not sent."
        : ""
    }`.trim(),
  };
}

export async function restartMeetingCall(
  callIdOrEventId: string
): Promise<{ success: true; callId: string } | { error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return { error: auth.error };

  const { data: event } = await auth.supabase
    .from("calendar_events")
    .select("id, title, starts_at, duration_minutes, call_id")
    .or(`call_id.eq.${callIdOrEventId},id.eq.${callIdOrEventId}`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!event) {
    return { error: "Event not found." };
  }

  const newCallId = randomUUID();
  const created = await createStreamCall(
    newCallId,
    auth.userId,
    new Date(event.starts_at),
    event.title,
    event.duration_minutes
  );

  if (!created) {
    return { error: "Could not initialize video call session." };
  }

  await auth.supabase
    .from("calendar_events")
    .update({ call_id: newCallId })
    .eq("id", event.id);

  revalidatePath("/admin", "layout");
  return { success: true, callId: newCallId };
}
