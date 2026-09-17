"use client";

import { useState } from "react";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import StreamVideoProvider from "../StreamVideoProvider";
import { useGetCallById } from "../useGetCallById";
import MeetingSetup from "../MeetingSetup";
import MeetingRoom from "../MeetingRoom";

function MeetingContent({
  callId,
  initialDurationMinutes,
  startsAt,
  eventTitle,
  restartHref,
  leaveHref,
}: {
  callId: string;
  initialDurationMinutes?: number;
  startsAt?: string | null;
  eventTitle?: string | null;
  restartHref?: string;
  leaveHref?: string;
}) {
  const { call, isCallLoading } = useGetCallById(callId);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if (isCallLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-stone-950 text-white">
        Loading meeting…
      </div>
    );
  }

  if (!call) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-stone-950 text-white">
        Meeting not found.
      </div>
    );
  }

  // Dynamically resolve duration from props or call custom data (never purely static 30)
  const callCustomDuration = call.state?.custom?.duration_minutes as number | undefined;
  const callCustomTitle = call.state?.custom?.title as string | undefined;

  const durationMinutes =
    (initialDurationMinutes && initialDurationMinutes > 0)
      ? initialDurationMinutes
      : (callCustomDuration && callCustomDuration > 0)
      ? callCustomDuration
      : 30;

  const title = eventTitle || callCustomTitle || null;

  return (
    <StreamCall call={call}>
      <StreamTheme>
        {!isSetupComplete ? (
          <MeetingSetup
            setIsSetupComplete={setIsSetupComplete}
            restartHref={restartHref}
            leaveHref={leaveHref}
          />
        ) : (
          <MeetingRoom
            durationMinutes={durationMinutes}
            startsAt={startsAt}
            eventTitle={title}
            callId={callId}
            leaveHref={leaveHref}
          />
        )}
      </StreamTheme>
    </StreamCall>
  );
}

export default function MeetingPageClient({
  callId,
  userId,
  userName,
  isGuest,
  initialDurationMinutes,
  startsAt,
  eventTitle,
  restartHref,
  leaveHref,
}: {
  callId: string;
  userId: string;
  userName: string;
  isGuest?: boolean;
  initialDurationMinutes?: number;
  startsAt?: string | null;
  eventTitle?: string | null;
  restartHref?: string;
  leaveHref?: string;
}) {
  return (
    <StreamVideoProvider userId={userId} userName={userName} isGuest={isGuest}>
      <MeetingContent
        callId={callId}
        initialDurationMinutes={initialDurationMinutes}
        startsAt={startsAt}
        eventTitle={eventTitle}
        restartHref={restartHref}
        leaveHref={leaveHref}
      />
    </StreamVideoProvider>
  );
}
