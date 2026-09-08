"use client";

import { useState } from "react";
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { Users } from "../../components/icons";
import EndCallButton from "./EndCallButton";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

const layouts: { value: CallLayoutType; label: string }[] = [
  { value: "speaker-left", label: "Speaker" },
  { value: "grid", label: "Grid" },
  { value: "speaker-right", label: "Speaker (Right)" },
];

export default function MeetingRoom() {
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-white">
        Joining…
      </div>
    );
  }

  let callLayout;
  switch (layout) {
    case "grid":
      callLayout = <PaginatedGridLayout />;
      break;
    case "speaker-right":
      callLayout = <SpeakerLayout participantsBarPosition="left" />;
      break;
    default:
      callLayout = <SpeakerLayout participantsBarPosition="right" />;
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-slate-950 pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          {callLayout}
        </div>
        {showParticipants && (
          <div className="ml-2 h-[calc(100vh-86px)]">
            <CallParticipantsList onClose={() => setShowParticipants(false)} />
          </div>
        )}
      </div>

      <div className="fixed bottom-0 flex w-full flex-wrap items-center justify-center gap-3 bg-slate-950/80 p-3 backdrop-blur">
        <CallControls onLeave={() => router.push("/admin")} />

        <select
          value={layout}
          onChange={(e) => setLayout(e.target.value as CallLayoutType)}
          className="rounded-2xl bg-[#19232d] px-3 py-2 text-sm text-white hover:bg-[#4c535b]"
        >
          {layouts.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>

        <CallStatsButton />

        <button
          onClick={() => setShowParticipants((prev) => !prev)}
          className="flex items-center justify-center rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]"
        >
          <Users className="h-5 w-5 text-white" />
        </button>

        <EndCallButton />
      </div>
    </section>
  );
}
