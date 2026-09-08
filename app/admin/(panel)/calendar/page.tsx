import Link from "next/link";
import { createClient } from "../../../lib/supabase/server";
import { ArrowRight } from "../../../components/icons";
import WeekCalendar, { type WeekEvent } from "./WeekCalendar";

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function mondayOf(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const offset = (x.getDay() + 6) % 7; // Monday = 0
  x.setDate(x.getDate() - offset);
  return x;
}

function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const base = date ? new Date(`${date}T00:00:00`) : new Date();
  const weekStart = mondayOf(Number.isNaN(base.getTime()) ? new Date() : base);
  const weekEnd = addDays(weekStart, 7);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("calendar_events")
    .select(
      "id, title, description, starts_at, duration_minutes, meeting_type, class_filter, call_id, attachment_url, attachment_name"
    )
    .eq("created_by", user?.id ?? "")
    .gte("starts_at", weekStart.toISOString())
    .lt("starts_at", weekEnd.toISOString())
    .order("starts_at", { ascending: true });

  const events = (data ?? []) as WeekEvent[];

  const rangeLabel = `${weekStart.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  })} – ${addDays(weekStart, 6).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/calendar?date=${ymd(addDays(weekStart, -7))}`}
            aria-label="Previous week"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-slate-600 hover:border-slate-500 hover:text-slate-900 dark:border-slate-600 dark:text-slate-300 dark:hover:text-white"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
          </Link>
          <Link
            href={`/admin/calendar?date=${ymd(addDays(weekStart, 7))}`}
            aria-label="Next week"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-slate-600 hover:border-slate-500 hover:text-slate-900 dark:border-slate-600 dark:text-slate-300 dark:hover:text-white"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/admin/calendar"
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:border-slate-500 hover:text-slate-900 dark:border-slate-600 dark:text-slate-300 dark:hover:text-white"
          >
            Today
          </Link>
          <span className="ml-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
            {rangeLabel}
          </span>
        </div>

        <Link
          href="/admin/calendar/add-event"
          className="rounded-full bg-gradient-to-r from-slate-700 to-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition-transform hover:scale-[1.02]"
        >
          + Add Event
        </Link>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Click any time slot to schedule a meeting. Every student on the roster is
        emailed an invite.
      </p>

      <WeekCalendar weekStartISO={ymd(weekStart)} events={events} />
    </div>
  );
}
