import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { StreamClient } from "@stream-io/node-sdk";
import { createClient } from "../../../lib/supabase/server";
import { createStreamCall } from "../../../actions/calendar";
import MeetingPageClient from "./MeetingPageClient";

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/admin/login");
  }

  // Fetch dynamic meeting event data from database (duration_minutes, starts_at, title)
  const { data: eventData } = await supabase
    .from("calendar_events")
    .select("id, title, starts_at, duration_minutes, call_id")
    .or(`call_id.eq.${id},id.eq.${id}`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // If previous call session was ended on Stream, automatically renew session so admin can re-enter!
  let renewCallId: string | null = null;
  const key = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  const secret = process.env.STREAM_SECRET_KEY;
  if (key && secret && eventData) {
    try {
      const client = new StreamClient(key, secret, { timeout: 10000 });
      const callQuery = await client.video.call("default", id).get();
      if (callQuery.call?.ended_at) {
        const freshCallId = randomUUID();
        const created = await createStreamCall(
          freshCallId,
          user.id,
          new Date(eventData.starts_at),
          eventData.title,
          eventData.duration_minutes
        );
        if (created) {
          await supabase
            .from("calendar_events")
            .update({ call_id: freshCallId })
            .eq("id", eventData.id);
          renewCallId = freshCallId;
        }
      }
    } catch (err) {
      console.warn("Stream call status check:", err);
    }
  }

  if (renewCallId) {
    redirect(`/admin/meeting/${renewCallId}`);
  }

  return (
    <MeetingPageClient
      callId={id}
      userId={user.id}
      userName={user.email ?? "Admin"}
      initialDurationMinutes={eventData?.duration_minutes}
      startsAt={eventData?.starts_at ?? null}
      eventTitle={eventData?.title ?? null}
    />
  );
}
