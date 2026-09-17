"use client";

import { useState } from "react";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1); // 1..12
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5); // 0,5,..,55

function to24h(hour12: number, minute: number, period: "AM" | "PM"): string {
  let h = hour12 % 12;
  if (period === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function from24h(hhmm?: string): { hour: number | ""; minute: number | ""; period: "AM" | "PM" | "" } {
  if (!hhmm) return { hour: "", minute: "", period: "" };
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return { hour: "", minute: "", period: "" };
  const period: "AM" | "PM" = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return { hour: hour12, minute: m, period };
}

const selectClass =
  "rounded-2xl border border-stone-200 bg-stone-50 px-2.5 py-2.5 text-xs font-semibold text-stone-900 outline-none focus:border-yellow-400 focus:bg-white dark:border-stone-800 dark:bg-stone-900 dark:text-white dark:focus:border-yellow-400 dark:focus:bg-stone-900 [color-scheme:light] dark:[color-scheme:dark] transition-colors";

export default function TimePicker12h({
  name,
  required = false,
  defaultValue,
}: {
  name: string;
  required?: boolean;
  defaultValue?: string;
}) {
  const initial = from24h(defaultValue);
  const [hour, setHour] = useState<number | "">(initial.hour);
  const [minute, setMinute] = useState<number | "">(initial.minute);
  const [period, setPeriod] = useState<"AM" | "PM" | "">(initial.period);

  const value = hour !== "" && minute !== "" && period ? to24h(hour, minute, period) : "";

  return (
    <div>
      <input type="hidden" name={name} value={value} />
      <div className="flex gap-1.5">
        <select
          aria-label="Hour"
          value={hour}
          onChange={(e) => setHour(e.target.value ? Number(e.target.value) : "")}
          className={selectClass}
        >
          <option value="">--</option>
          {HOURS.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
        <select
          aria-label="Minute"
          value={minute}
          onChange={(e) => setMinute(e.target.value ? Number(e.target.value) : "")}
          className={selectClass}
        >
          <option value="">--</option>
          {MINUTES.map((m) => (
            <option key={m} value={m}>
              {String(m).padStart(2, "0")}
            </option>
          ))}
        </select>
        <select
          aria-label="AM or PM"
          value={period}
          onChange={(e) => setPeriod(e.target.value as "AM" | "PM" | "")}
          className={selectClass}
        >
          <option value="">--</option>
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
      {required && !value && (
        <p className="mt-1 text-[10px] font-semibold text-stone-400">Required</p>
      )}
    </div>
  );
}
