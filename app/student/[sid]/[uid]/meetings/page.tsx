import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import {
  MEETING_TYPE_LABELS,
  type MeetingType,
} from "@/app/lib/calendar";
import { CalendarClock, Video } from "@/app/components/icons";
import {
  AdminPageHeader,
  AdminCard,
  AdminBadge,
  AdminButton,
} from "@/app/admin/_components/ui";

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

export default async function StudentMeetingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayKey = ymd(startOfToday);
  const tomorrow = new Date(startOfToday);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowKey = ymd(tomorrow);

  const { data } = await supabase
    .from("calendar_events")
    .select("id, title, starts_at, duration_minutes, meeting_type, class_filter, call_id")
    .gte("starts_at", startOfToday.toISOString())
    .order("starts_at", { ascending: true });

  const events = (data ?? []) as EventRow[];

  const groups = new Map<string, EventRow[]>();
  for (const e of events) {
    const key = ymd(new Date(e.starts_at));
    const list = groups.get(key);
    if (list) list.push(e);
    else groups.set(key, [e]);
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Meetings"
        subtitle="Your upcoming live classes and scheduled sessions from today onward."
      />

      {groups.size === 0 ? (
        <AdminCard className="p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-400">
            <CalendarClock className="h-7 w-7" />
          </div>
          <p className="mt-4 text-base font-bold text-stone-800 dark:text-stone-200">
            No upcoming meetings found
          </p>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
            Meetings your admin schedules for you will show up here.
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
                          href={`${
                            e.meeting_type === "demo" ? "/demo/meeting" : "/student/meeting"
                          }/${e.call_id}`}
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
