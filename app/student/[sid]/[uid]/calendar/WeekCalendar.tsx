"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MEETING_TYPE_LABELS, type MeetingType } from "@/app/lib/calendar";
import { Video, X } from "@/app/components/icons";
import { AdminBadge, AdminButton } from "@/app/admin/_components/ui";

export type WeekEvent = {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;
  duration_minutes: number;
  meeting_type: MeetingType;
  class_filter: string | null;
  call_id: string | null;
  attachment_url: string | null;
  attachment_name: string | null;
};

const HOUR_H = 52;
const GUTTER = 60;
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function hourLabel(h: number) {
  const period = h < 12 ? "AM" : "PM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr} ${period}`;
}

function minutesLabel(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h < 12 ? "AM" : "PM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${String(m).padStart(2, "0")} ${period}`;
}

const typeStyles: Record<MeetingType, { bg: string }> = {
  daily: {
    bg: "bg-yellow-400 text-stone-950 font-bold border border-yellow-300 shadow-sm shadow-yellow-500/20",
  },
  demo: {
    bg: "bg-stone-900 text-yellow-300 font-bold border border-stone-800 dark:bg-stone-800 dark:border-stone-700 shadow-sm",
  },
  inquiry: {
    bg: "bg-yellow-100 text-stone-900 font-semibold border border-yellow-200 dark:bg-yellow-950/70 dark:text-yellow-200 dark:border-yellow-900",
  },
};

export default function WeekCalendar({
  weekStartISO,
  events,
}: {
  weekStartISO: string;
  events: WeekEvent[];
}) {
  const weekStart = new Date(`${weekStartISO}T00:00:00`);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });
  const now = new Date();
  const todayYmd = ymd(now);
  const todayIdx = days.findIndex((d) => ymd(d) === todayYmd);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const [openId, setOpenId] = useState<string | null>(null);
  const openEvent = events.find((e) => e.id === openId) ?? null;

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const top = Math.max((nowMinutes / 60) * HOUR_H - HOUR_H * 2, 0);
    scrollRef.current?.scrollTo({ top });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function dayEvents(dayIdx: number) {
    const key = ymd(days[dayIdx]);
    return events
      .filter((e) => ymd(new Date(e.starts_at)) === key)
      .map((e) => {
        const s = new Date(e.starts_at);
        return { ...e, minutes: s.getHours() * 60 + s.getMinutes() };
      });
  }

  const gridCols = `${GUTTER}px repeat(7, minmax(0, 1fr))`;

  return (
    <div className="overflow-hidden rounded-[24px] sm:rounded-[28px] border border-stone-200/90 bg-white shadow-sm dark:border-stone-800/80 dark:bg-[#14151b]">
      {/* Calendar Day Headers */}
      <div
        className="grid border-b border-stone-200/80 bg-stone-50/70 dark:border-stone-800/80 dark:bg-stone-900/60"
        style={{ gridTemplateColumns: gridCols }}
      >
        <div className="border-r border-stone-200/60 dark:border-stone-800/60" />
        {days.map((d, i) => {
          const isToday = ymd(d) === todayYmd;
          return (
            <div
              key={i}
              className={`py-3 text-center border-r border-stone-200/50 last:border-r-0 dark:border-stone-800/50 ${
                isToday ? "bg-yellow-400/[0.08]" : ""
              }`}
            >
              <div
                className={`text-[11px] font-extrabold uppercase tracking-wider ${
                  isToday
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-stone-400 dark:text-stone-500"
                }`}
              >
                {d.toLocaleDateString("en-IN", { weekday: "short" })}
              </div>
              <div
                className={`mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-extrabold transition-transform ${
                  isToday
                    ? "bg-yellow-400 text-stone-950 shadow-md shadow-yellow-500/25 scale-105"
                    : "text-stone-700 dark:text-stone-200"
                }`}
              >
                {d.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hourly Scroll Area */}
      <div ref={scrollRef} className="no-scrollbar max-h-[440px] overflow-y-auto">
        <div className="grid" style={{ gridTemplateColumns: gridCols }}>
          {/* Time Gutter */}
          <div
            className="relative border-r border-stone-200/60 dark:border-stone-800/60 bg-stone-50/40 dark:bg-stone-900/20"
            style={{ height: HOUR_H * 24 }}
          >
            {HOURS.map((h) => (
              <div
                key={h}
                className="absolute right-2.5 -translate-y-2 text-[10px] font-bold tracking-tight text-stone-400 dark:text-stone-500"
                style={{ top: h * HOUR_H }}
              >
                {hourLabel(h)}
              </div>
            ))}
          </div>

          {/* 7 Days Columns */}
          {days.map((d, di) => (
            <div
              key={di}
              className={`relative border-r border-stone-100 last:border-r-0 dark:border-stone-800/50 ${
                di === todayIdx ? "bg-yellow-400/[0.02]" : ""
              }`}
              style={{ height: HOUR_H * 24 }}
            >
              {HOURS.map((h) => (
                <div
                  key={h}
                  className="absolute inset-x-0 border-t border-stone-100/90 dark:border-stone-800/50"
                  style={{ top: h * HOUR_H, height: HOUR_H }}
                />
              ))}

              {/* Current time red line */}
              {di === todayIdx && (
                <div
                  className="pointer-events-none absolute inset-x-0 z-30 flex items-center"
                  style={{ top: (nowMinutes / 60) * HOUR_H }}
                >
                  <span className="h-2.5 w-2.5 -translate-x-1 rounded-full bg-red-500 shadow-sm" />
                  <span className="h-0.5 w-full bg-red-500/80" />
                </div>
              )}

              {/* Scheduled Events Blocks */}
              {dayEvents(di).map((e) => {
                const top = (e.minutes / 60) * HOUR_H;
                const height = Math.max((e.duration_minutes / 60) * HOUR_H, 26);
                const style = typeStyles[e.meeting_type];

                return (
                  <button
                    key={`${e.id}-${di}`}
                    type="button"
                    onClick={() => setOpenId(e.id)}
                    className={`absolute inset-x-1 z-10 overflow-hidden rounded-xl px-2.5 py-1 text-left text-[11px] leading-tight transition-transform hover:scale-[1.02] active:scale-[0.98] ${style.bg}`}
                    style={{ top, height }}
                  >
                    <div className="truncate font-black">{e.title}</div>
                    <div className="opacity-85 text-[10px] font-semibold">
                      {minutesLabel(e.minutes)} ({e.duration_minutes}m)
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {openEvent && (
        <EventPanel event={openEvent} onClose={() => setOpenId(null)} />
      )}
    </div>
  );
}

function EventPanel({
  event,
  onClose,
}: {
  event: WeekEvent;
  onClose: () => void;
}) {
  const start = new Date(event.starts_at);
  const dateStr = start.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const timeStr = start.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-stone-200/80 bg-white shadow-2xl dark:border-stone-800 dark:bg-[#121318]">
        <header className="flex items-start justify-between gap-3 border-b border-stone-100 p-6 dark:border-stone-800/80">
          <div>
            <AdminBadge variant="yellow">
              {MEETING_TYPE_LABELS[event.meeting_type]}
            </AdminBadge>
            <h3 className="mt-2 text-xl font-extrabold tracking-tight text-stone-900 dark:text-white">
              {event.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-xl p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto p-6 text-sm">
          <div className="rounded-2xl bg-stone-50 p-4 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800/60">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Scheduled Time
            </p>
            <p className="mt-1 text-base font-extrabold text-stone-900 dark:text-white">
              {dateStr}
            </p>
            <p className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 mt-0.5">
              {timeStr} &middot; {event.duration_minutes} minutes
            </p>
          </div>

          {event.class_filter && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
                Class:
              </span>
              <AdminBadge variant="gray">Class {event.class_filter}</AdminBadge>
            </div>
          )}

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Session Agenda
            </p>
            <p className="mt-1.5 whitespace-pre-wrap rounded-2xl bg-stone-50/70 p-3.5 text-xs text-stone-700 dark:bg-stone-900/40 dark:text-stone-300 border border-stone-200/60 dark:border-stone-800/60 leading-relaxed">
              {event.description || "No agenda description provided."}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Attached Notes / Homework
            </p>
            {event.attachment_url ? (
              <a
                href={event.attachment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-flex items-center gap-2 rounded-xl bg-yellow-400/15 px-3.5 py-2 text-xs font-bold text-yellow-700 dark:text-yellow-300 hover:underline"
              >
                📎 {event.attachment_name || "Download Resource Material"}
              </a>
            ) : (
              <p className="mt-1 text-xs text-stone-400">No attachments</p>
            )}
          </div>
        </div>

        {event.call_id && (
          <footer className="border-t border-stone-100 p-5 dark:border-stone-800/80 bg-stone-50/50 dark:bg-stone-900/40">
            <Link
              href={`${
                event.meeting_type === "demo" ? "/demo/meeting" : "/student/meeting"
              }/${event.call_id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <AdminButton size="sm" icon={Video} className="w-full">
                Join Meeting
              </AdminButton>
            </Link>
          </footer>
        )}
      </aside>
    </div>
  );
}
