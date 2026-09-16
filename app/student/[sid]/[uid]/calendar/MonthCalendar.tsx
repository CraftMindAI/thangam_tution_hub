"use client";

import { useState } from "react";
import { ArrowRight, Clock } from "../../components/icons";

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
    <div className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-800">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-stone-900 dark:text-white">{monthLabel}</h2>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            aria-label="Previous month"
            className="flex h-8 w-8 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-700"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            aria-label="Next month"
            className="flex h-8 w-8 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-700"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wide text-stone-400 dark:text-stone-500">
        {weekdays.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          if (cell.day === null) return <div key={i} />;
          const dayEvents = eventsByDate.get(cell.key!) ?? [];
          const isToday = cell.key === todayKey;
          return (
            <div
              key={cell.key}
              className={`flex min-h-16 flex-col items-center rounded-lg p-1.5 text-sm ${
                isToday
                  ? "bg-yellow-50 dark:bg-yellow-900/30"
                  : "hover:bg-stone-50 dark:hover:bg-stone-700/40"
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  isToday
                    ? "bg-stone-800 font-semibold text-white dark:bg-stone-100 dark:text-stone-900"
                    : "text-stone-700 dark:text-stone-300"
                }`}
              >
                {cell.day}
              </span>
              {dayEvents.map((event, idx) => (
                <span
                  key={idx}
                  title={`${event.label}${event.time ? ` · ${event.time}` : ""}`}
                  className="mt-1 flex w-full items-center justify-center gap-0.5 truncate rounded bg-gradient-to-r from-stone-700 to-stone-900 px-1 py-0.5 text-[10px] font-medium text-white"
                >
                  {event.time ?? event.label}
                </span>
              ))}
            </div>
          );
        })}
      </div>

      {events.length > 0 && (
        <div className="mt-4 space-y-1.5 border-t border-stone-200/70 pt-3 dark:border-stone-700">
          {events.map((event, i) => (
            <p
              key={i}
              className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400"
            >
              <Clock className="h-3.5 w-3.5 shrink-0 text-yellow-600 dark:text-yellow-400" />
              <span>
                {event.label}
                {event.time ? ` — ${event.time}` : ""}
              </span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
