import { randomUUID } from "node:crypto";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/app/lib/supabase/admin";
import MeetingPageClient from "@/app/admin/meeting/[id]/MeetingPageClient";

export default async function DemoMeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Public page — no Supabase session exists for a demo guest, so this looks
  // the event up with the service role and only proceeds if it's genuinely a
  // demo meeting (never lets this URL peek at daily/inquiry sessions).
  const admin = createAdminClient();
  const { data: eventData } = await admin
    .from("calendar_events")
    .select("id, title, starts_at, duration_minutes, call_id, meeting_type")
    .or(`call_id.eq.${id},id.eq.${id}`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!eventData || eventData.meeting_type !== "demo") {
    notFound();
  }

  const guestId = `guest_${randomUUID()}`;

  return (
    <MeetingPageClient
      callId={id}
      userId={guestId}
      userName="Guest"
      isGuest
      initialDurationMinutes={eventData.duration_minutes}
      startsAt={eventData.starts_at}
      eventTitle={eventData.title}
      leaveHref="/"
    />
  );
}
