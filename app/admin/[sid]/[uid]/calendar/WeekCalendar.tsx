"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MEETING_TYPE_LABELS, type MeetingType } from "@/app/lib/calendar";
import {
  cancelCalendarEvent,
  rescheduleCalendarEvent,
} from "@/app/actions/calendar";
import { Pencil, X, Video, CalendarClock } from "@/app/components/icons";
import { adminBase } from "../_lib/nav";
import { AdminBadge, AdminButton } from "../_components/ui";

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

const typeStyles: Record<
  MeetingType,
  { bg: string; badge: "yellow" | "dark" | "gray" }
> = {
  daily: {
    bg: "bg-yellow-400 text-stone-950 font-bold border border-yellow-300 shadow-sm shadow-yellow-500/20",
    badge: "yellow",
  },
  demo: {
    bg: "bg-stone-900 text-yellow-300 font-bold border border-stone-800 dark:bg-stone-800 dark:border-stone-700 shadow-sm",
    badge: "dark",
  },
  inquiry: {
    bg: "bg-yellow-100 text-stone-900 font-semibold border border-yellow-200 dark:bg-yellow-950/70 dark:text-yellow-200 dark:border-yellow-900",
    badge: "gray",
  },
};

const panelInput =
  "mt-1.5 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-xs font-semibold text-stone-900 outline-none transition-colors focus:border-yellow-400 focus:bg-white dark:border-stone-800 dark:bg-stone-900 dark:text-white dark:focus:border-yellow-400";

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
      <div
        ref={scrollRef}
        className="no-scrollbar max-h-[440px] overflow-y-auto"
      >
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
                  className="absolute inset-x-0 border-t border-stone-100/90 transition-colors hover:bg-yellow-400/10 dark:border-stone-800/50 dark:hover:bg-yellow-400/[0.06]"
                  style={{ top: h * HOUR_H, height: HOUR_H }}
                  aria-label={`Add event on ${d.toLocaleDateString("en-IN", {
                    weekday: "long",
                  })} at ${hourLabel(h)}`}
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

              {/* Add event popup pill button */}
              {selected && selected.day === di && (
                <div
                  className="absolute inset-x-0 z-20 flex items-center justify-center p-1"
                  style={{ top: selected.hour * HOUR_H, height: HOUR_H }}
                >
                  <Link
                    href={`${base}/calendar/add-event?date=${ymd(d)}&hrs=${selected.hour}`}
                    onClick={(ev) => {
                      const slotTime = new Date(d);
                      slotTime.setHours(selected.hour, 0, 0, 0);
                      if (slotTime.getTime() < new Date().getTime()) {
                        ev.preventDefault();
                        setNotice(
                          "Cannot add an event in the past. Please select an upcoming time slot."
                        );
                      }
                    }}
                    className="rounded-full bg-stone-950 px-3.5 py-1 text-xs font-bold text-yellow-400 shadow-lg shadow-black/30 hover:scale-105 active:scale-95 transition-all dark:bg-yellow-400 dark:text-stone-950"
                  >
                    + Schedule
                  </Link>
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
                    onClick={() => {
                      if (new Date(e.starts_at).getTime() < new Date().getTime()) {
                        setNotice("This session has already ended.");
                        return;
                      }
                      setOpenId(e.id);
                    }}
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

      {notice && (
        <NoticeModal message={notice} onClose={() => setNotice(null)} />
      )}
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
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm rounded-3xl border border-stone-200/80 bg-white p-6 text-center shadow-2xl dark:border-stone-800 dark:bg-[#14151b]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400/20 text-yellow-600 dark:text-yellow-400">
          <CalendarClock className="h-6 w-6" />
        </div>
        <p className="mt-4 text-sm font-bold text-stone-800 dark:text-stone-100">
          {message}
        </p>
        <div className="mt-5">
          <AdminButton onClick={onClose} size="sm">
            Understood
          </AdminButton>
        </div>
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
          <div className="flex items-center gap-1.5">
            <Link
              href={`${base}/calendar/edit/${event.id}`}
              aria-label="Edit meeting"
              className="rounded-xl p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200 transition-colors"
            >
              <Pencil className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-xl p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto p-6 text-sm">
          {mode === "view" && (
            <>
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
                    Invited:
                  </span>
                  <AdminBadge variant="gray">
                    Class {event.class_filter} Students
                  </AdminBadge>
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
            </>
          )}

          {mode === "reschedule" && (
            <form action={rescheduleAction} className="space-y-4">
              <input type="hidden" name="id" value={event.id} />
              {rs && "error" in rs && (
                <p className="rounded-2xl bg-yellow-400/20 p-3 text-xs font-bold text-yellow-800 dark:text-yellow-300 border border-yellow-400/40">
                  {rs.error}
                </p>
              )}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Select New Date
                  <input
                    name="date"
                    type="date"
                    required
                    defaultValue={defaultDate}
                    className={panelInput}
                  />
                </label>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Select New Time
                  <input
                    name="time"
                    type="time"
                    required
                    defaultValue={defaultTime}
                    className={panelInput}
                  />
                </label>
              </div>
              <div className="flex gap-2.5 pt-2">
                <AdminButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setMode("view")}
                >
                  Back
                </AdminButton>
                <AdminButton
                  type="submit"
                  size="sm"
                  loading={rsPending}
                >
                  Save New Time
                </AdminButton>
              </div>
            </form>
          )}

          {mode === "cancel" && (
            <form action={cancelAction} className="space-y-4">
              <input type="hidden" name="id" value={event.id} />
              {cs && "error" in cs && (
                <p className="rounded-2xl bg-yellow-400/20 p-3 text-xs font-bold text-yellow-800 dark:text-yellow-300 border border-yellow-400/40">
                  {cs.error}
                </p>
              )}
              <div className="rounded-2xl bg-red-500/10 p-4 border border-red-500/20 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                Are you sure you want to cancel{" "}
                <span className="font-extrabold text-stone-900 dark:text-white">
                  {event.title}
                </span>
                ? This will remove the meeting from all student calendars and email cancel notices.
              </div>
              <div className="flex gap-2.5 pt-2">
                <AdminButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setMode("view")}
                >
                  Keep Meeting
                </AdminButton>
                <AdminButton
                  type="submit"
                  variant="danger"
                  size="sm"
                  loading={csPending}
                >
                  Confirm Cancel
                </AdminButton>
              </div>
            </form>
          )}
        </div>

        {mode === "view" && (
          <footer className="flex flex-wrap items-center gap-2.5 border-t border-stone-100 p-5 dark:border-stone-800/80 bg-stone-50/50 dark:bg-stone-900/40">
            <AdminButton
              variant="outline"
              size="sm"
              onClick={() => setMode("cancel")}
            >
              Cancel
            </AdminButton>
            <AdminButton
              variant="outline"
              size="sm"
              onClick={() => setMode("reschedule")}
            >
              Reschedule
            </AdminButton>
            {event.call_id && (
              <Link
                href={`/admin/meeting/${event.call_id}`}
                className="grow"
              >
                <AdminButton
                  size="sm"
                  icon={Video}
                  className="w-full"
                >
                  Join Meeting
                </AdminButton>
              </Link>
            )}
          </footer>
        )}
      </aside>
    </div>
  );
}
