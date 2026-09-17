import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { buildStudentPath } from "@/app/lib/secure-path";
import MeetingPageClient from "@/app/admin/meeting/[id]/MeetingPageClient";
import InlineMeetingSignIn from "./InlineMeetingSignIn";

export default async function StudentMeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not signed in yet — show an inline form right here instead of bouncing
  // to a separate /signin page. On success the client refreshes this same
  // route, which re-runs this server component and (if authorized) drops
  // straight into the call below.
  if (!user) {
    return <InlineMeetingSignIn />;
  }

  // RLS scopes this to whatever the signed-in user may see (their class, a
  // direct invite, their own enquiry meeting, or — for an admin — anything).
  // A null row means "not authorized to view this meeting" here, and demo
  // meetings are excluded — those are only joinable via /demo/meeting.
  const { data: eventData } = await supabase
    .from("calendar_events")
    .select("id, title, starts_at, duration_minutes, call_id, meeting_type")
    .or(`call_id.eq.${id},id.eq.${id}`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!eventData || eventData.meeting_type === "demo") {
    redirect(buildStudentPath(user.id, "/calendar"));
  }

  return (
    <MeetingPageClient
      callId={id}
      userId={user.id}
      userName={user.email ?? "Guest"}
      initialDurationMinutes={eventData.duration_minutes}
      startsAt={eventData.starts_at}
      eventTitle={eventData.title}
      leaveHref={buildStudentPath(user.id, "/calendar")}
    />
  );
}
