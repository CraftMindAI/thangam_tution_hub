"use client";

import { useState } from "react";
import { ArrowRight, Clock } from "@/app/components/icons";
import { AdminCard } from "@/app/admin/_components/ui";

export type CalendarEvent = {
  date: string; // YYYY-MM-DD (local)
  time?: string; // e.g. "4:00 PM"
  label: string;
};

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function MonthCalendar({ events }: { events: CalendarEvent[] }) {
  const firstEventDate = events[0] ? new Date(`${events[0].date}T00:00:00`) : new Date();
  const [cursor, setCursor] = useState(
    new Date(firstEventDate.getFullYear(), firstEventDate.getMonth(), 1)
  );

  const today = new Date();
  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthLabel = cursor.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const eventsByDate = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const list = eventsByDate.get(event.date) ?? [];
    list.push(event);
    eventsByDate.set(event.date, list);
  }

  const cells: { day: number | null; key: string | null }[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push({ day: null, key: null });
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, key: toDateKey(year, month, day) });
  }

  return (
    <AdminCard className="p-6">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200/70 dark:border-stone-800">
        <h2 className="text-base font-bold text-stone-900 dark:text-white">{monthLabel}</h2>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            aria-label="Previous month"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-stone-600 hover:bg-yellow-400 hover:border-yellow-400 hover:text-stone-950 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-yellow-400 dark:hover:border-yellow-400 dark:hover:text-stone-950 transition-colors"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            aria-label="Next month"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-stone-600 hover:bg-yellow-400 hover:border-yellow-400 hover:text-stone-950 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-yellow-400 dark:hover:border-yellow-400 dark:hover:text-stone-950 transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
        {weekdays.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {cells.map((cell, i) => {
          if (cell.day === null) return <div key={i} className="min-h-20" />;
          const dayEvents = eventsByDate.get(cell.key!) ?? [];
          const isToday = cell.key === todayKey;
          return (
            <div
              key={cell.key}
              className={`flex min-h-20 flex-col items-center rounded-2xl p-2 text-sm transition-all ${
                isToday
                  ? "border border-yellow-400 bg-yellow-400/10 dark:bg-yellow-400/10 shadow-xs"
                  : "border border-stone-100 bg-stone-50/50 hover:bg-stone-100/60 dark:border-stone-800/60 dark:bg-stone-900/40 dark:hover:bg-stone-800/60"
              }`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs transition-colors ${
                  isToday
                    ? "bg-yellow-400 font-extrabold text-stone-950 shadow-sm shadow-yellow-500/30"
                    : "font-semibold text-stone-700 dark:text-stone-300"
                }`}
              >
                {cell.day}
              </span>
              <div className="mt-1 flex w-full flex-col gap-1">
                {dayEvents.map((event, idx) => (
                  <span
                    key={idx}
                    title={`${event.label}${event.time ? ` · ${event.time}` : ""}`}
                    className="flex w-full items-center justify-center truncate rounded-md bg-yellow-400 px-1.5 py-0.5 text-[10px] font-bold text-stone-950 shadow-xs"
                  >
                    {event.time ?? event.label}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {events.length > 0 && (
        <div className="mt-6 space-y-2 border-t border-stone-200/70 pt-4 dark:border-stone-800">
          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2">
            Schedule Highlights
          </p>
          {events.map((event, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 text-xs font-semibold text-stone-700 dark:text-stone-300"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-yellow-400/20 text-yellow-600 dark:text-yellow-400">
                <Clock className="h-3 w-3" />
              </span>
              <span className="font-bold text-stone-900 dark:text-white">
                {event.label}
              </span>
              {event.time && (
                <span className="text-stone-400 dark:text-stone-500 font-normal">
                  — {event.date} at {event.time}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminCard>
  );
}
