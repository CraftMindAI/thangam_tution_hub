"use client";

import { useEffect, useState } from "react";
import {
  DeviceSettings,
  VideoPreview,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

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
      <div className="flex h-screen w-full items-center justify-center bg-stone-950 px-6 text-center text-white">
        Your meeting has not started yet. It is scheduled for{" "}
        {callStartsAt.toLocaleString()}
      </div>
    );
  }

  if (callHasEnded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-stone-950 px-6 text-center text-white">
        This call has ended.
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-stone-950 text-white">
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
        className="rounded-full bg-yellow-400 px-6 py-2.5 text-sm font-semibold text-stone-900 shadow-md shadow-yellow-500/20 transition-transform hover:bg-yellow-300 hover:scale-[1.02]"
      >
        Join Meeting
      </button>
    </div>
  );
}
