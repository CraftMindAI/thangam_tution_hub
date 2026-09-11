import Link from "next/link";
import { createClient } from "@/app/lib/supabase/server";
import {
  MEETING_TYPES,
  MEETING_TYPE_LABELS,
  type MeetingType,
} from "@/app/lib/calendar";
import { STUDENT_CLASSES } from "@/app/lib/students";
import { CalendarClock, Video } from "@/app/components/icons";
import { getEnquiryStudents, getMeetingInvitees } from "@/app/lib/roster";
import AddEventModal from "../calendar/AddEventModal";

type EventRow = {
  id: string;
  title: string;
  starts_at: string;
  duration_minutes: number;
  meeting_type: MeetingType;
  class_filter: string | null;
  call_id: string | null;
};

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function dayHeading(d: Date, todayKey: string, tomorrowKey: string) {
  const key = ymd(d);
  const label = d.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
  if (key === todayKey) return `Today · ${label}`;
  if (key === tomorrowKey) return `Tomorrow · ${label}`;
  return label;
}

function timeLabel(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const typeBadge: Record<MeetingType, string> = {
  daily: "bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  demo: "bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  inquiry: "bg-sky-50 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
};

export default async function UpcomingMeetingsPage({
  params,
  searchParams,
}: PageProps<"/admin/[sid]/[uid]/upcoming-meetings">) {
  const { sid, uid } = await params;
  const panel = `/admin/${sid}/${uid}`;

  const supabase = await createClient();
  const sp = (await searchParams) as {
    date?: string;
    type?: string;
    class?: string;
  };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayKey = ymd(startOfToday);
  const tomorrow = new Date(startOfToday);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowKey = ymd(tomorrow);

  const dateFilter =
    sp.date && /^\d{4}-\d{2}-\d{2}$/.test(sp.date) ? sp.date : "";
  const typeFilter = MEETING_TYPES.includes(sp.type as MeetingType)
    ? (sp.type as MeetingType)
    : "";
  const classFilter = (STUDENT_CLASSES as readonly string[]).includes(
    sp.class ?? ""
  )
    ? sp.class!
    : "";

  let query = supabase
    .from("calendar_events")
    .select(
      "id, title, starts_at, duration_minutes, meeting_type, class_filter, call_id"
    )
    .eq("created_by", user?.id ?? "")
    .order("starts_at", { ascending: true });

  if (dateFilter) {
    const dayStart = new Date(`${dateFilter}T00:00:00`);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    query = query
      .gte("starts_at", dayStart.toISOString())
      .lt("starts_at", dayEnd.toISOString());
  } else {
    query = query.gte("starts_at", startOfToday.toISOString());
  }
  if (typeFilter) query = query.eq("meeting_type", typeFilter);
  if (classFilter) query = query.eq("class_filter", classFilter);

  const { data } = await query;
  const events = (data ?? []) as EventRow[];
  const [enquiryStudents, allOffline] = await Promise.all([
    getEnquiryStudents(),
    getMeetingInvitees(null),
  ]);
  const allStudents = allOffline.map((s) => ({
    userId: s.userId,
    name: s.name,
    class: s.class,
    type: s.type,
  }));
  const hasFilters = Boolean(dateFilter || typeFilter || classFilter);

  const groups = new Map<string, EventRow[]>();
  for (const e of events) {
    const key = ymd(new Date(e.starts_at));
    const list = groups.get(key);
    if (list) list.push(e);
    else groups.set(key, [e]);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {dateFilter
            ? "Meetings you scheduled on the selected date."
            : "Meetings you scheduled, from today onward."}
        </p>
        <AddEventModal
          defaultDate={dateFilter || todayKey}
          enquiryStudents={enquiryStudents}
          allStudents={allStudents}
        />
      </div>

      <form
        method="get"
        className="flex flex-wrap items-end gap-3 rounded-2xl border border-stone-200/70 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800"
      >
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Date
          <input
            type="date"
            name="date"
            defaultValue={dateFilter}
            className="mt-1 block rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Meeting type
          <select
            name="type"
            defaultValue={typeFilter}
            className="mt-1 block rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="">All types</option>
            {MEETING_TYPES.map((t) => (
              <option key={t} value={t}>
                {MEETING_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Class
          <select
            name="class"
            defaultValue={classFilter}
            className="mt-1 block rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            <option value="">All classes</option>
            {STUDENT_CLASSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded-full bg-gradient-to-r from-slate-700 to-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20"
        >
          Apply
        </button>
        {hasFilters && (
          <Link
            href={`${panel}/upcoming-meetings`}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-500 dark:border-slate-600 dark:text-slate-200"
          >
            Clear
          </Link>
        )}
      </form>

      {groups.size === 0 ? (
        <p className="rounded-2xl border border-stone-200/70 bg-white px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400">
          {hasFilters
            ? "No meetings match these filters."
            : "No upcoming meetings. Use “Add Event” to schedule one."}
        </p>
      ) : (
        [...groups.entries()].map(([key, list]) => (
          <section key={key}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              {dayHeading(new Date(`${key}T00:00:00`), todayKey, tomorrowKey)}
            </h2>
            <div className="mt-3 space-y-3">
              {list.map((e) => (
                <div
                  key={e.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200/70 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                      <CalendarClock className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        {e.title}
                      </p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <span>
                          {timeLabel(e.starts_at)} · {e.duration_minutes} min
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${typeBadge[e.meeting_type]}`}
                        >
                          {MEETING_TYPE_LABELS[e.meeting_type]}
                        </span>
                        {e.class_filter && (
                          <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                            Class {e.class_filter}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {(() => {
                    const startMs = new Date(e.starts_at).getTime();
                    const endMs = startMs + e.duration_minutes * 60 * 1000;
                    const nowMs = Date.now();
                    const isLive = nowMs >= startMs && nowMs <= endMs;

                    return (
                      <div className="flex items-center gap-2">
                        {isLive && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            Live Now
                          </span>
                        )}

                        {e.call_id ? (
                          <Link
                            href={`/admin/meeting/${e.call_id}`}
                            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-teal-900/15 transition-transform hover:scale-[1.02]"
                          >
                            <Video className="h-4 w-4" />
                            {isLive ? "Join Class" : "Join"}
                          </Link>
                        ) : (
                          <span className="text-xs text-slate-400">No call link</span>
                        )}
                      </div>
                    );
                  })()}
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
