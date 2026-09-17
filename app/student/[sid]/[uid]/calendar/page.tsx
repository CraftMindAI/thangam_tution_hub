import Link from "next/link";
import { createClient } from "@/app/lib/supabase/server";
import { ArrowRight, Calendar as CalendarIcon } from "@/app/components/icons";
import WeekCalendar, { type WeekEvent } from "./WeekCalendar";
import { AdminPageHeader } from "@/app/admin/_components/ui";

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

export default async function StudentCalendar({
  params,
  searchParams,
}: PageProps<"/student/[sid]/[uid]/calendar">) {
  const { sid, uid } = await params;
  const base = `/student/${sid}/${uid}`;

  const { date } = await searchParams;
  const from = typeof date === "string" ? new Date(`${date}T00:00:00`) : new Date();
  const weekStart = mondayOf(Number.isNaN(from.getTime()) ? new Date() : from);
  const weekEnd = addDays(weekStart, 7);

  const supabase = await createClient();

  // RLS scopes this to events relevant to the signed-in student (their
  // class, an invite addressed to them, or their own enquiry meeting).
  const { data } = await supabase
    .from("calendar_events")
    .select(
      "id, title, description, starts_at, duration_minutes, meeting_type, class_filter, call_id, attachment_url, attachment_name"
    )
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
    <div className="space-y-6">
      <AdminPageHeader
        title="Calendar"
        subtitle="Your upcoming classes, live sessions, and scheduled meetings."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-white p-1 shadow-sm dark:border-stone-800 dark:bg-[#14151b]">
              <Link
                href={`${base}/calendar?date=${ymd(addDays(weekStart, -7))}`}
                aria-label="Previous week"
                className="flex h-8 w-8 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white transition-colors"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
              </Link>
              <Link
                href={`${base}/calendar`}
                className="rounded-full px-3 py-1 text-xs font-bold text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800 transition-colors"
              >
                Today
              </Link>
              <Link
                href={`${base}/calendar?date=${ymd(addDays(weekStart, 7))}`}
                aria-label="Next week"
                className="flex h-8 w-8 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white transition-colors"
              >
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <span className="hidden sm:inline-block rounded-full bg-stone-100 px-3.5 py-1.5 text-xs font-bold text-stone-700 dark:bg-stone-800/80 dark:text-stone-300">
              {rangeLabel}
            </span>
          </div>
        }
      />

      <div className="rounded-2xl bg-yellow-400/10 border border-yellow-400/20 px-4 py-2.5 text-xs font-medium text-yellow-800 dark:text-yellow-300 flex items-center gap-2">
        <CalendarIcon className="h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
        <span>Click any session to see its full agenda and attached notes.</span>
      </div>

      <WeekCalendar weekStartISO={ymd(weekStart)} events={events} />
    </div>
  );
}
