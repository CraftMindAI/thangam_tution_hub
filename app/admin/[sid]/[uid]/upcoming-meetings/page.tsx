import Link from "next/link";
import { createClient } from "@/app/lib/supabase/server";
import {
  MEETING_TYPES,
  MEETING_TYPE_LABELS,
  type MeetingType,
} from "@/app/lib/calendar";
import { STUDENT_CLASSES } from "@/app/lib/students";
import { CalendarClock, Video, Filter } from "@/app/components/icons";
import { getEnquiryStudents, getMeetingInvitees } from "@/app/lib/roster";
import AddEventModal from "../calendar/AddEventModal";
import {
  AdminPageHeader,
  AdminCard,
  AdminBadge,
  AdminButton,
} from "../_components/ui";

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

const typeBadgeVariant: Record<MeetingType, "yellow" | "dark" | "gray"> = {
  daily: "yellow",
  demo: "dark",
  inquiry: "gray",
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

  const inputClasses =
    "mt-1.5 block w-full rounded-2xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-xs font-semibold text-stone-900 outline-none transition-colors focus:border-yellow-400 focus:bg-white dark:border-stone-800 dark:bg-stone-900 dark:text-white dark:focus:border-yellow-400 dark:focus:bg-stone-900 [color-scheme:light] dark:[color-scheme:dark]";

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <AdminPageHeader
        title="Upcoming Meetings"
        subtitle={
          dateFilter
            ? "Meetings scheduled for the selected date."
            : "All upcoming live classes and sessions from today onward."
        }
        actions={
          <AddEventModal
            defaultDate={dateFilter || todayKey}
            enquiryStudents={enquiryStudents}
            allStudents={allStudents}
          />
        }
      />

      {/* Filter Form Card */}
      <AdminCard className="p-5 sm:p-6">
        <form
          method="get"
          className="flex flex-wrap items-end gap-4"
        >
          <div className="flex-1 min-w-[160px]">
            <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Filter Date
              <input
                type="date"
                name="date"
                defaultValue={dateFilter}
                className={inputClasses}
              />
            </label>
          </div>

          <div className="flex-1 min-w-[160px]">
            <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Meeting Type
              <select
                name="type"
                defaultValue={typeFilter}
                className={inputClasses}
              >
                <option value="">All Types</option>
                {MEETING_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {MEETING_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex-1 min-w-[160px]">
            <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Student Class
              <select
                name="class"
                defaultValue={classFilter}
                className={inputClasses}
              >
                <option value="">All Classes</option>
                {STUDENT_CLASSES.map((c) => (
                  <option key={c} value={c}>
                    Class {c}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex items-center gap-2 pt-2 sm:pt-0">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-yellow-400 px-5 py-2.5 text-xs font-bold text-stone-950 shadow-sm shadow-yellow-500/20 hover:bg-yellow-300 transition-colors"
            >
              <Filter className="h-3.5 w-3.5" />
              Apply Filters
            </button>

            {hasFilters && (
              <Link
                href={`${panel}/upcoming-meetings`}
                className="inline-flex items-center justify-center rounded-full border border-stone-300 px-4 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800 transition-colors"
              >
                Clear
              </Link>
            )}
          </div>
        </form>
      </AdminCard>

      {/* Grouped Day Sessions */}
      {groups.size === 0 ? (
        <AdminCard className="p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-400">
            <CalendarClock className="h-7 w-7" />
          </div>
          <p className="mt-4 text-base font-bold text-stone-800 dark:text-stone-200">
            {hasFilters
              ? "No scheduled meetings match your filters"
              : "No upcoming meetings found"}
          </p>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
            {hasFilters
              ? "Try resetting the filters or choosing another date."
              : "Use the schedule button to set up your next live class session."}
          </p>
        </AdminCard>
      ) : (
        [...groups.entries()].map(([key, list]) => (
          <section key={key} className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-yellow-400" />
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-stone-900 dark:text-yellow-400">
                {dayHeading(new Date(`${key}T00:00:00`), todayKey, tomorrowKey)}
              </h2>
              <span className="text-xs font-semibold text-stone-400">
                ({list.length} {list.length === 1 ? "session" : "sessions"})
              </span>
            </div>

            <div className="grid gap-3">
              {list.map((e) => {
                const startMs = new Date(e.starts_at).getTime();
                const endMs = startMs + e.duration_minutes * 60 * 1000;
                const nowMs = Date.now();
                const isLive = nowMs >= startMs && nowMs <= endMs;

                return (
                  <AdminCard
                    key={e.id}
                    className="p-5 flex flex-wrap items-center justify-between gap-4 transition-all hover:border-yellow-400/50"
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400/15 text-yellow-600 dark:bg-yellow-400/20 dark:text-yellow-400 font-black">
                        <CalendarClock className="h-6 w-6" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-base font-bold text-stone-900 dark:text-white">
                            {e.title}
                          </p>
                          {isLive && (
                            <AdminBadge variant="live" pulse>
                              Live Now
                            </AdminBadge>
                          )}
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-2.5 text-xs text-stone-500 dark:text-stone-400">
                          <span className="font-semibold text-stone-700 dark:text-stone-300">
                            {timeLabel(e.starts_at)}
                          </span>
                          <span>&middot;</span>
                          <span>{e.duration_minutes} mins</span>

                          <AdminBadge variant={typeBadgeVariant[e.meeting_type]}>
                            {MEETING_TYPE_LABELS[e.meeting_type]}
                          </AdminBadge>

                          {e.class_filter && (
                            <AdminBadge variant="gray">
                              Class {e.class_filter}
                            </AdminBadge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 ml-auto sm:ml-0">
                      {e.call_id ? (
                        <Link
                          href={`/admin/meeting/${e.call_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <AdminButton
                            size="sm"
                            icon={Video}
                            className={isLive ? "animate-pulse" : ""}
                          >
                            {isLive ? "Join Class Now" : "Join Video Call"}
                          </AdminButton>
                        </Link>
                      ) : (
                        <span className="text-xs font-medium text-stone-400">
                          No Call Link
                        </span>
                      )}
                    </div>
                  </AdminCard>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
