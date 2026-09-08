"use client";

import { useRouter } from "next/navigation";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";

export default function EndCallButton() {
  const call = useCall();
  const router = useRouter();

  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  if (!call) {
    throw new Error("useStreamCall must be used within a StreamCall component.");
  }

  const isMeetingOwner =
    localParticipant &&
    call.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  if (!isMeetingOwner) return null;

  async function endCall() {
    await call!.endCall();
    router.push("/admin");
  }

  return (
    <button
      onClick={endCall}
      className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
    >
      End call for everyone
    </button>
  );
}
