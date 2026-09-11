"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DeviceSettings,
  VideoPreview,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { restartMeetingCall } from "../../actions/calendar";

export default function MeetingSetup({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) {
  const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();
  const callStartsAt = useCallStartsAt();
  const callEndedAt = useCallEndedAt();
  const callTimeNotArrived = callStartsAt && new Date(callStartsAt) > new Date();
  const callHasEnded = !!callEndedAt;

  const call = useCall();

  const [isMicCamToggled, setIsMicCamToggled] = useState(false);

  useEffect(() => {
    if (!call) return;
    if (isMicCamToggled) {
      call.camera.disable();
      call.microphone.disable();
    } else {
      call.camera.enable();
      call.microphone.enable();
    }
  }, [isMicCamToggled, call]);

  if (!call) {
    throw new Error("useStreamCall must be used within a StreamCall component.");
  }

  if (callTimeNotArrived) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 px-6 text-center text-white">
        Your meeting has not started yet. It is scheduled for{" "}
        {callStartsAt.toLocaleString()}
      </div>
    );
  }

  const [isRestarting, setIsRestarting] = useState(false);
  const router = useRouter();

  const handleRestart = async () => {
    setIsRestarting(true);
    try {
      const res = await restartMeetingCall(call.id);
      if ("callId" in res) {
        window.location.href = `/admin/meeting/${res.callId}`;
      } else {
        alert(res.error || "Could not restart meeting");
        setIsRestarting(false);
      }
    } catch {
      setIsRestarting(false);
    }
  };

  if (callHasEnded) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-slate-950 px-6 text-center text-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/90 text-amber-400 border border-slate-700 shadow-xl">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold">This call session was ended</h2>
        <p className="max-w-md text-sm text-slate-400">
          The previous video call session was closed or ended. Since this scheduled meeting is still active, you can reopen or restart it anytime.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            disabled={isRestarting}
            onClick={handleRestart}
            className="rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-900/30 transition-transform hover:scale-105 disabled:opacity-50"
          >
            {isRestarting ? "Restarting Session…" : "Reopen / Restart Meeting"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="rounded-full border border-slate-700 bg-slate-800/80 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            Upcoming Meetings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-slate-950 text-white">
      <h1 className="text-center text-2xl font-bold">Meeting Setup</h1>
      <VideoPreview />
      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex items-center justify-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={isMicCamToggled}
            onChange={(e) => setIsMicCamToggled(e.target.checked)}
          />
          Join with mic and camera off
        </label>
        <DeviceSettings />
      </div>
      <button
        onClick={() => {
          call.join();
          setIsSetupComplete(true);
        }}
        className="rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-900/20 transition-transform hover:scale-[1.02]"
      >
        Join Meeting
      </button>
    </div>
  );
}
