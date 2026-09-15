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
import MeetingTimer from "./MeetingTimer";
import MeetingBoard from "./MeetingBoard";
import { Pencil } from "../../components/icons";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

const layouts: { value: CallLayoutType; label: string }[] = [
  { value: "speaker-left", label: "Speaker" },
  { value: "grid", label: "Grid" },
  { value: "speaker-right", label: "Speaker (Right)" },
];

interface MeetingRoomProps {
  durationMinutes?: number;
  startsAt?: string | null;
  eventTitle?: string | null;
  callId?: string;
}

export default function MeetingRoom({
  durationMinutes = 30,
  startsAt,
  eventTitle,
  callId,
}: MeetingRoomProps) {
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);
  const [showBoard, setShowBoard] = useState(false);
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-stone-950 text-white">
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
      {/* Floating Top Center Countdown Timer */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <MeetingTimer
          durationMinutes={durationMinutes}
          startsAt={startsAt}
          eventTitle={eventTitle}
          callId={callId}
        />
      </div>

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

      {/* Blackboard & Whiteboard Canvas Overlay */}
      <MeetingBoard
        isOpen={showBoard}
        onClose={() => setShowBoard(false)}
        eventTitle={eventTitle}
      />

      <div className="fixed bottom-0 flex w-full flex-wrap items-center justify-center gap-3 bg-slate-950/80 p-3 backdrop-blur z-40">
        <CallControls onLeave={() => router.push("/admin")} />

        {/* Blackboard & Whiteboard button */}
        <button
          onClick={() => setShowBoard((prev) => !prev)}
          className={`flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-sm font-medium transition-colors ${
            showBoard
              ? "bg-teal-600 text-white shadow-lg shadow-teal-900/30"
              : "bg-[#19232d] text-white hover:bg-[#4c535b]"
          }`}
          title="Open Blackboard & Whiteboard"
        >
          <Pencil className="h-4 w-4" />
          <span className="hidden sm:inline">Board</span>
        </button>

        {/* Compact duration timer indicator */}
        <MeetingTimer
          durationMinutes={durationMinutes}
          startsAt={startsAt}
          callId={callId}
          compact
        />

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
          title="Participants"
        >
          <Users className="h-5 w-5 text-white" />
        </button>

        <EndCallButton />
      </div>
    </section>
  );
}
