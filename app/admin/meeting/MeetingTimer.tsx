"use client";

import { useEffect, useState, useMemo } from "react";
import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { Clock } from "../../components/icons";

interface MeetingTimerProps {
  durationMinutes: number;
  startsAt?: string | null;
  eventTitle?: string | null;
  callId?: string;
  compact?: boolean;
}

export default function MeetingTimer({
  durationMinutes,
  startsAt,
  eventTitle,
  callId,
  compact = false,
}: MeetingTimerProps) {
  const { useCallStartedAt } = useCallStateHooks();
  const callStartedAt = useCallStartedAt();

  const [extraSeconds, setExtraSeconds] = useState(0);
  const [showElapsed, setShowElapsed] = useState(false);
  const [now, setNow] = useState<number>(() => Date.now());
  const [sessionStartTime] = useState<number>(() => {
    if (typeof window !== "undefined" && callId) {
      const stored = sessionStorage.getItem(`call_start_${callId}`);
      if (stored) return Number(stored);
      const start = Date.now();
      sessionStorage.setItem(`call_start_${callId}`, String(start));
      return start;
    }
    return Date.now();
  });

  // Update session start time if SDK provides SFU call start
  const effectiveStartTime = useMemo(() => {
    if (callStartedAt) {
      return new Date(callStartedAt).getTime();
    }
    return sessionStartTime;
  }, [callStartedAt, sessionStartTime]);

  useEffect(() => {
    if (callStartedAt && callId && typeof window !== "undefined") {
      const sdkTime = new Date(callStartedAt).getTime();
      sessionStorage.setItem(`call_start_${callId}`, String(sdkTime));
    }
  }, [callStartedAt, callId]);

  // Tick every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Total duration in seconds based on the dynamic durationMinutes
  const totalDurationSeconds = useMemo(() => {
    const effectiveMinutes = Number(durationMinutes) > 0 ? Number(durationMinutes) : 30;
    return effectiveMinutes * 60 + extraSeconds;
  }, [durationMinutes, extraSeconds]);

  // Calculate remaining and elapsed seconds
  const { remainingSeconds, elapsedSeconds } = useMemo(() => {
    const elapsed = Math.max(0, Math.floor((now - effectiveStartTime) / 1000));

    if (startsAt) {
      const scheduledStart = new Date(startsAt).getTime();
      const scheduledEnd = scheduledStart + totalDurationSeconds * 1000;
      // If currently within the scheduled window:
      if (now >= scheduledStart && now <= scheduledEnd) {
        const remaining = Math.max(0, Math.floor((scheduledEnd - now) / 1000));
        return { remainingSeconds: remaining, elapsedSeconds: elapsed };
      }
    }

    // Dynamic session-based countdown from the event duration
    const remaining = totalDurationSeconds - elapsed;
    return { remainingSeconds: remaining, elapsedSeconds: elapsed };
  }, [now, effectiveStartTime, startsAt, totalDurationSeconds]);

  function formatTime(totalSec: number) {
    const isNegative = totalSec < 0;
    const abs = Math.abs(totalSec);
    const totalMinutes = Math.floor(abs / 60);
    const seconds = abs % 60;

    const pad = (n: number) => String(n).padStart(2, "0");

    // If 100 minutes or more, format as H:MM:SS, otherwise MM:SS (e.g. 60:00 -> 59:59, 90:00 -> 89:59)
    if (totalMinutes >= 100) {
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      return `${isNegative ? "+" : ""}${hours}:${pad(mins)}:${pad(seconds)}`;
    }
    return `${isNegative ? "+" : ""}${pad(totalMinutes)}:${pad(seconds)}`;
  }

  const isOvertime = remainingSeconds < 0;
  const isUrgent = remainingSeconds <= 60 && !isOvertime;
  const isWarning = remainingSeconds <= 300 && remainingSeconds > 60;

  const handleAddMinutes = (mins: number) => {
    setExtraSeconds((prev) => prev + mins * 60);
  };

  if (compact) {
    return (
      <div
        className={`flex items-center gap-1.5 rounded-2xl px-3 py-2 text-xs font-mono font-medium cursor-pointer transition-colors ${
          isOvertime
            ? "bg-rose-950/80 text-rose-300 border border-rose-600/40 animate-pulse"
            : isUrgent
            ? "bg-rose-950/70 text-rose-300 border border-rose-600/40 animate-pulse"
            : isWarning
            ? "bg-amber-950/70 text-amber-300 border border-amber-600/40"
            : "bg-[#19232d] text-emerald-400 hover:bg-[#253240]"
        }`}
        title={`Meeting Duration: ${durationMinutes}m. Click to toggle elapsed/remaining.`}
        onClick={() => setShowElapsed((prev) => !prev)}
      >
        <Clock className="h-3.5 w-3.5 shrink-0" />
        <span>
          {showElapsed
            ? formatTime(elapsedSeconds)
            : formatTime(remainingSeconds)}
        </span>
        {isOvertime && (
          <span className="ml-1 rounded bg-rose-800 px-1 py-0.2 text-[10px] text-white">
            Overtime
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/90 px-4 py-1.5 text-white shadow-2xl backdrop-blur-md">
      {/* Title & Scheduled duration indicator */}
      {eventTitle && (
        <div className="hidden items-center gap-2 border-r border-slate-700/60 pr-3 sm:flex">
          <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="max-w-[150px] truncate text-xs font-semibold text-slate-200">
            {eventTitle}
          </span>
          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-300">
            {durationMinutes}m
          </span>
        </div>
      )}

      {/* Main Countdown Display */}
      <button
        type="button"
        onClick={() => setShowElapsed((prev) => !prev)}
        className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold transition-all ${
          isOvertime
            ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse"
            : isUrgent
            ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse"
            : isWarning
            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
            : "bg-teal-500/15 text-teal-300 border border-teal-500/30 hover:bg-teal-500/25"
        }`}
        title="Click to toggle between countdown and elapsed time"
      >
        <Clock className="h-4 w-4 shrink-0" />
        <span className="font-mono tracking-wider">
          {showElapsed
            ? formatTime(elapsedSeconds)
            : formatTime(remainingSeconds)}
        </span>
        <span className="text-[11px] font-normal opacity-80">
          {showElapsed ? "elapsed" : isOvertime ? "over" : "left"}
        </span>
      </button>

      {/* Quick extension buttons */}
      <div className="flex items-center gap-1 pl-1">
        <button
          type="button"
          onClick={() => handleAddMinutes(5)}
          className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          title="Add 5 minutes to meeting duration"
        >
          +5m
        </button>
        <button
          type="button"
          onClick={() => handleAddMinutes(10)}
          className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          title="Add 10 minutes to meeting duration"
        >
          +10m
        </button>
      </div>
    </div>
  );
}
