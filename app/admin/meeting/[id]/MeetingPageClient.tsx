"use client";

import { useState } from "react";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import StreamVideoProvider from "../StreamVideoProvider";
import { useGetCallById } from "../useGetCallById";
import MeetingSetup from "../MeetingSetup";
import MeetingRoom from "../MeetingRoom";

function MeetingContent({ callId }: { callId: string }) {
  const { call, isCallLoading } = useGetCallById(callId);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if (isCallLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-white">
        Loading meeting…
      </div>
    );
  }

  if (!call) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-white">
        Meeting not found.
      </div>
    );
  }

  return (
    <StreamCall call={call}>
      <StreamTheme>
        {!isSetupComplete ? (
          <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
        ) : (
          <MeetingRoom />
        )}
      </StreamTheme>
    </StreamCall>
  );
}

export default function MeetingPageClient({
  callId,
  userId,
  userName,
}: {
  callId: string;
  userId: string;
  userName: string;
}) {
  return (
    <StreamVideoProvider userId={userId} userName={userName}>
      <MeetingContent callId={callId} />
    </StreamVideoProvider>
  );
}
