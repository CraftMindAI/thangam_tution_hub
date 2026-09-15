"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MEETING_TYPE_LABELS, type MeetingType } from "@/app/lib/calendar";
import {
  cancelCalendarEvent,
  rescheduleCalendarEvent,
} from "@/app/actions/calendar";
import { Pencil, X } from "@/app/components/icons";
import { adminBase } from "../_lib/nav";

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
  daily: "bg-yellow-500 text-stone-900",
  demo: "bg-yellow-500 text-stone-900",
  inquiry: "bg-yellow-200 text-stone-900",
};

const typeBadge: Record<MeetingType, string> = {
  daily: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  demo: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  inquiry: "bg-yellow-50 text-yellow-900 dark:bg-yellow-950/40 dark:text-yellow-300",
};

const panelInput =
  "mt-1.5 w-full rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/20 dark:border-stone-700 dark:bg-stone-900 dark:text-white";

export default function WeekCalendar({
  weekStartISO,
  events,
}: {
  weekStartISO: string;
  events: WeekEvent[];
}) {
  const base = adminBase(usePathname());
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

  const [selected, setSelected] = useState<{ day: number; hour: number } | null>(
    todayIdx >= 0 ? { day: todayIdx, hour: now.getHours() } : null
  );
  const [openId, setOpenId] = useState<string | null>(null);
  const openEvent = events.find((e) => e.id === openId) ?? null;
  const [notice, setNotice] = useState<string | null>(null);

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
    <div className="overflow-hidden rounded-2xl border border-stone-200/70 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-800">
      <div
        className="grid border-b border-stone-200/70 dark:border-stone-700"
        style={{ gridTemplateColumns: gridCols }}
      >
        <div />
        {days.map((d, i) => {
          const isToday = ymd(d) === todayYmd;
          return (
            <div
              key={i}
              className={`border-l border-stone-100 py-2 text-center dark:border-stone-800 ${
                isToday
                  ? "text-yellow-700 dark:text-yellow-400"
                  : "text-stone-500 dark:text-stone-400"
              }`}
            >
              <div className="text-[11px] font-semibold uppercase tracking-wide">
                {d.toLocaleDateString("en-IN", { weekday: "short" })}
              </div>
              <div
                className={`mx-auto mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
                  isToday
                    ? "bg-yellow-600 text-white"
                    : "text-stone-800 dark:text-stone-200"
                }`}
              >
                {d.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      <div ref={scrollRef} className="no-scrollbar max-h-[380px] overflow-y-auto">
        <div className="grid" style={{ gridTemplateColumns: gridCols }}>
          <div className="relative" style={{ height: HOUR_H * 24 }}>
            {HOURS.map((h) => (
              <div
                key={h}
                className="absolute right-2 -translate-y-2 text-[11px] text-stone-400"
                style={{ top: h * HOUR_H }}
              >
                {hourLabel(h)}
              </div>
            ))}
          </div>

          {days.map((d, di) => (
            <div
              key={di}
              className="relative border-l border-stone-100 dark:border-stone-800"
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
                  className="absolute inset-x-0 border-t border-stone-100 transition-colors hover:bg-yellow-50/60 dark:border-stone-800 dark:hover:bg-stone-700/40"
                  style={{ top: h * HOUR_H, height: HOUR_H }}
                  aria-label={`Add event ${d.toLocaleDateString("en-IN", {
                    weekday: "long",
                  })} ${hourLabel(h)}`}
                />
              ))}

              {di === todayIdx && (
                <div
                  className="pointer-events-none absolute inset-x-0 z-30 flex items-center"
                  style={{ top: (nowMinutes / 60) * HOUR_H }}
                >
                  <span className="h-2 w-2 -translate-x-1 rounded-full bg-red-500" />
                  <span className="h-px w-full bg-red-500" />
                </div>
              )}

              {selected && selected.day === di && (
                <div
                  className="absolute inset-x-0 z-20 flex items-center justify-center"
                  style={{ top: selected.hour * HOUR_H, height: HOUR_H }}
                >
                  <Link
                    href={`${base}/calendar/add-event?date=${ymd(d)}&hrs=${selected.hour}`}
                    onClick={(ev) => {
                      const slotTime = new Date(d);
                      slotTime.setHours(selected.hour, 0, 0, 0);
                      if (slotTime.getTime() < new Date().getTime()) {
                        ev.preventDefault();
                        setNotice("Cannot add event in the past. Please select a future time slot.");
                      }
                    }}
                    className="rounded-full bg-stone-900 px-3 py-1 text-xs font-semibold text-white shadow-md hover:bg-stone-700 dark:bg-white dark:text-stone-900"
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
                    onClick={() => {
                      if (new Date(e.starts_at).getTime() < new Date().getTime()) {
                        setNotice("Event link has been expired");
                        return;
                      }
                      setOpenId(e.id);
                    }}
                    className={`absolute inset-x-1 z-10 overflow-hidden rounded-md px-2 py-1 text-left text-[11px] leading-tight hover:brightness-95 ${typeColor[e.meeting_type]}`}
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

      {notice && <NoticeModal message={notice} onClose={() => setNotice(null)} />}
    </div>
  );
}

function NoticeModal({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/40" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl border border-stone-200/70 bg-white p-5 text-center shadow-xl dark:border-stone-800 dark:bg-stone-800">
        <p className="text-sm font-medium text-stone-700 dark:text-stone-200">
          {message}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 rounded-full bg-gradient-to-r from-stone-700 to-stone-900 px-4 py-2 text-sm font-semibold text-white"
        >
          OK
        </button>
      </div>
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
  const base = adminBase(usePathname());
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
      <div className="absolute inset-0 bg-stone-900/40" onClick={onClose} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-stone-200/70 bg-white shadow-xl dark:border-stone-800 dark:bg-stone-800">
        <header className="flex items-start justify-between gap-3 border-b border-stone-200/70 p-5 dark:border-stone-700">
          <div>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${typeBadge[event.meeting_type]}`}
            >
              {MEETING_TYPE_LABELS[event.meeting_type]}
            </span>
            <h3 className="mt-2 text-lg font-bold tracking-tight text-stone-900 dark:text-white">
              {event.title}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <Link
              href={`${base}/calendar/edit/${event.id}`}
              aria-label="Edit meeting"
              className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-700 dark:hover:text-stone-200"
            >
              <Pencil className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-700 dark:hover:text-stone-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto p-5 text-sm">
          {mode === "view" && (
            <>
              <div className="text-stone-600 dark:text-stone-300">
                {dateStr}
                <br />
                {timeStr} · {event.duration_minutes} min
              </div>
              {event.class_filter && (
                <div className="text-stone-600 dark:text-stone-300">
                  Class {event.class_filter}
                </div>
              )}
              <div>
                <p className="font-semibold text-stone-800 dark:text-stone-200">
                  Description
                </p>
                <p className="mt-1 whitespace-pre-wrap text-stone-600 dark:text-stone-400">
                  {event.description || "No description."}
                </p>
              </div>
              <div>
                <p className="font-semibold text-stone-800 dark:text-stone-200">
                  Attachment
                </p>
                {event.attachment_url ? (
                  <a
                    href={event.attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block font-medium text-yellow-700 hover:underline dark:text-yellow-400"
                  >
                    {event.attachment_name || "Download attachment"}
                  </a>
                ) : (
                  <p className="mt-1 text-stone-400">None</p>
                )}
              </div>
            </>
          )}

          {mode === "reschedule" && (
            <form action={rescheduleAction} className="space-y-3">
              <input type="hidden" name="id" value={event.id} />
              {rs && "error" in rs && (
                <p className="rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                  {rs.error}
                </p>
              )}
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-200">
                New date
                <input
                  name="date"
                  type="date"
                  required
                  defaultValue={defaultDate}
                  className={panelInput}
                />
              </label>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-200">
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
                  className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 hover:border-stone-500 dark:border-stone-600 dark:text-stone-200"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={rsPending}
                  className="rounded-full bg-gradient-to-r from-stone-700 to-stone-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
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
                <p className="rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                  {cs.error}
                </p>
              )}
              <p className="text-stone-600 dark:text-stone-300">
                Cancel <span className="font-semibold">{event.title}</span> for
                everyone? This removes it from the calendar.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode("view")}
                  className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 hover:border-stone-500 dark:border-stone-600 dark:text-stone-200"
                >
                  Keep meeting
                </button>
                <button
                  type="submit"
                  disabled={csPending}
                  className="rounded-full bg-yellow-400 px-4 py-2 text-sm font-semibold text-stone-900 hover:bg-yellow-300 disabled:opacity-60"
                >
                  {csPending ? "Cancelling…" : "Yes, cancel"}
                </button>
              </div>
            </form>
          )}
        </div>

        {mode === "view" && (
          <footer className="flex flex-wrap items-center gap-2 border-t border-stone-200/70 p-4 dark:border-stone-700">
            <button
              type="button"
              onClick={() => setMode("cancel")}
              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:border-yellow-400 hover:text-yellow-700 dark:border-stone-600 dark:text-stone-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setMode("reschedule")}
              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-500 hover:text-stone-900 dark:border-stone-600 dark:text-stone-200 dark:hover:text-white"
            >
              Reschedule
            </button>
            {event.call_id && (
              <Link
                href={`/admin/meeting/${event.call_id}`}
                className="grow rounded-full bg-yellow-400 px-4 py-2 text-center text-sm font-semibold text-stone-900 shadow-md shadow-yellow-500/15 transition-transform hover:bg-yellow-300 hover:scale-[1.02]"
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
