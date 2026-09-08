"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MEETING_TYPE_LABELS, type MeetingType } from "../../../lib/calendar";
import {
  cancelCalendarEvent,
  rescheduleCalendarEvent,
} from "../../../actions/calendar";
import { Pencil, X } from "../../../components/icons";

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

const HOUR_H = 48;
const GUTTER = 56;
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

const typeColor: Record<MeetingType, string> = {
  daily: "bg-teal-600",
  demo: "bg-amber-600",
  inquiry: "bg-sky-600",
};

const typeBadge: Record<MeetingType, string> = {
  daily: "bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  demo: "bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  inquiry: "bg-sky-50 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
};

const panelInput =
  "mt-1.5 w-full rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white";

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
  const todayYmd = ymd(new Date());

  const [selected, setSelected] = useState<{ day: number; hour: number } | null>(
    null
  );
  const [openId, setOpenId] = useState<string | null>(null);
  const openEvent = events.find((e) => e.id === openId) ?? null;

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 8 * HOUR_H });
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
    <div className="overflow-hidden rounded-2xl border border-stone-200/70 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-800">
      <div
        className="grid border-b border-stone-200/70 dark:border-slate-700"
        style={{ gridTemplateColumns: gridCols }}
      >
        <div />
        {days.map((d, i) => {
          const isToday = ymd(d) === todayYmd;
          return (
            <div
              key={i}
              className={`border-l border-stone-100 py-2 text-center dark:border-slate-800 ${
                isToday
                  ? "text-teal-700 dark:text-teal-400"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <div className="text-[11px] font-semibold uppercase tracking-wide">
                {d.toLocaleDateString("en-IN", { weekday: "short" })}
              </div>
              <div
                className={`mx-auto mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
                  isToday
                    ? "bg-teal-600 text-white"
                    : "text-slate-800 dark:text-slate-200"
                }`}
              >
                {d.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      <div ref={scrollRef} className="max-h-[620px] overflow-y-auto">
        <div className="grid" style={{ gridTemplateColumns: gridCols }}>
          <div className="relative" style={{ height: HOUR_H * 24 }}>
            {HOURS.map((h) => (
              <div
                key={h}
                className="absolute right-2 -translate-y-2 text-[11px] text-slate-400"
                style={{ top: h * HOUR_H }}
              >
                {hourLabel(h)}
              </div>
            ))}
          </div>

          {days.map((d, di) => (
            <div
              key={di}
              className="relative border-l border-stone-100 dark:border-slate-800"
              style={{ height: HOUR_H * 24 }}
            >
              {HOURS.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() =>
                    setSelected((cur) =>
                      cur && cur.day === di && cur.hour === h
                        ? null
                        : { day: di, hour: h }
                    )
                  }
                  className="absolute inset-x-0 border-t border-stone-100 transition-colors hover:bg-teal-50/60 dark:border-slate-800 dark:hover:bg-slate-700/40"
                  style={{ top: h * HOUR_H, height: HOUR_H }}
                  aria-label={`Add event ${d.toLocaleDateString("en-IN", {
                    weekday: "long",
                  })} ${hourLabel(h)}`}
                />
              ))}

              {selected && selected.day === di && (
                <div
                  className="absolute inset-x-0 z-20 flex items-center justify-center"
                  style={{ top: selected.hour * HOUR_H, height: HOUR_H }}
                >
                  <Link
                    href={`/admin/calendar/add-event?date=${ymd(d)}&hrs=${selected.hour}`}
                    className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow-md hover:bg-slate-700 dark:bg-white dark:text-slate-900"
                  >
                    + Add event
                  </Link>
                </div>
              )}

              {dayEvents(di).map((e) => {
                const top = (e.minutes / 60) * HOUR_H;
                const height = Math.max((e.duration_minutes / 60) * HOUR_H, 22);
                return (
                  <button
                    key={`${e.id}-${di}`}
                    type="button"
                    onClick={() => setOpenId(e.id)}
                    className={`absolute inset-x-1 z-10 overflow-hidden rounded-md px-2 py-1 text-left text-[11px] leading-tight text-white hover:brightness-110 ${typeColor[e.meeting_type]}`}
                    style={{ top, height }}
                  >
                    <div className="truncate font-semibold">{e.title}</div>
                    <div className="opacity-80">{minutesLabel(e.minutes)}</div>
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
  const [mode, setMode] = useState<"view" | "reschedule" | "cancel">("view");

  const [rs, rescheduleAction, rsPending] = useActionState(
    rescheduleCalendarEvent,
    undefined
  );
  const [cs, cancelAction, csPending] = useActionState(
    cancelCalendarEvent,
    undefined
  );

  useEffect(() => {
    if (rs && "success" in rs) onClose();
  }, [rs, onClose]);
  useEffect(() => {
    if (cs && "success" in cs) onClose();
  }, [cs, onClose]);

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
  const defaultDate = ymd(start);
  const defaultTime = `${String(start.getHours()).padStart(2, "0")}:${String(
    start.getMinutes()
  ).padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-stone-200/70 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-800">
        <header className="flex items-start justify-between gap-3 border-b border-stone-200/70 p-5 dark:border-slate-700">
          <div>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${typeBadge[event.meeting_type]}`}
            >
              {MEETING_TYPE_LABELS[event.meeting_type]}
            </span>
            <h3 className="mt-2 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              {event.title}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <Link
              href={`/admin/calendar/edit/${event.id}`}
              aria-label="Edit meeting"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-stone-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            >
              <Pencil className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-stone-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto p-5 text-sm">
          {mode === "view" && (
            <>
              <div className="text-slate-600 dark:text-slate-300">
                {dateStr}
                <br />
                {timeStr} · {event.duration_minutes} min
              </div>
              {event.class_filter && (
                <div className="text-slate-600 dark:text-slate-300">
                  Class {event.class_filter}
                </div>
              )}
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Description
                </p>
                <p className="mt-1 whitespace-pre-wrap text-slate-600 dark:text-slate-400">
                  {event.description || "No description."}
                </p>
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Attachment
                </p>
                {event.attachment_url ? (
                  <a
                    href={event.attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block font-medium text-teal-700 hover:underline dark:text-teal-400"
                  >
                    {event.attachment_name || "Download attachment"}
                  </a>
                ) : (
                  <p className="mt-1 text-slate-400">None</p>
                )}
              </div>
            </>
          )}

          {mode === "reschedule" && (
            <form action={rescheduleAction} className="space-y-3">
              <input type="hidden" name="id" value={event.id} />
              {rs && "error" in rs && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
                  {rs.error}
                </p>
              )}
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                New date
                <input
                  name="date"
                  type="date"
                  required
                  defaultValue={defaultDate}
                  className={panelInput}
                />
              </label>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                New time
                <input
                  name="time"
                  type="time"
                  required
                  defaultValue={defaultTime}
                  className={panelInput}
                />
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode("view")}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-500 dark:border-slate-600 dark:text-slate-200"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={rsPending}
                  className="rounded-full bg-gradient-to-r from-slate-700 to-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {rsPending ? "Saving…" : "Save new time"}
                </button>
              </div>
            </form>
          )}

          {mode === "cancel" && (
            <form action={cancelAction} className="space-y-3">
              <input type="hidden" name="id" value={event.id} />
              {cs && "error" in cs && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
                  {cs.error}
                </p>
              )}
              <p className="text-slate-600 dark:text-slate-300">
                Cancel <span className="font-semibold">{event.title}</span> for
                everyone? This removes it from the calendar.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode("view")}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-500 dark:border-slate-600 dark:text-slate-200"
                >
                  Keep meeting
                </button>
                <button
                  type="submit"
                  disabled={csPending}
                  className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {csPending ? "Cancelling…" : "Yes, cancel"}
                </button>
              </div>
            </form>
          )}
        </div>

        {mode === "view" && (
          <footer className="flex flex-wrap items-center gap-2 border-t border-stone-200/70 p-4 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setMode("cancel")}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-red-400 hover:text-red-600 dark:border-slate-600 dark:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setMode("reschedule")}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-500 hover:text-slate-900 dark:border-slate-600 dark:text-slate-200 dark:hover:text-white"
            >
              Reschedule
            </button>
            {event.call_id && (
              <Link
                href={`/admin/meeting/${event.call_id}`}
                className="grow rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-md shadow-teal-900/15 transition-transform hover:scale-[1.02]"
              >
                Join meeting
              </Link>
            )}
          </footer>
        )}
      </aside>
    </div>
  );
}
