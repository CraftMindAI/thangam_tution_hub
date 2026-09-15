import Link from "next/link";
import { createClient } from "@/app/lib/supabase/server";
import { getRoster } from "@/app/lib/roster";
import { MEETING_TYPE_LABELS, type MeetingType } from "@/app/lib/calendar";
import { TASK_STATUS_LABELS, type Task, type TaskStatus } from "@/app/lib/tasks";
import {
  BookOpen,
  ClipboardList,
  Users,
  CalendarClock,
  Inbox,
  Plus,
  Video,
  ChevronRight,
  GraduationCap,
} from "@/app/components/icons";
import {
  AdminPageHeader,
  AdminStatCard,
  AdminPanel,
  AdminBadge,
  AdminButton,
} from "../_components/ui";

const LIMIT = 3;

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(d: string) {
  return new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

const statusBadgeVariant: Record<TaskStatus, "warning" | "yellow" | "gray"> = {
  pending: "warning",
  in_progress: "yellow",
  completed: "gray",
};

const meetingBadgeVariant: Record<MeetingType, "yellow" | "dark" | "gray"> = {
  daily: "yellow",
  demo: "dark",
  inquiry: "gray",
};

type MeetingRow = {
  id: string;
  title: string;
  starts_at: string;
  duration_minutes: number;
  meeting_type: MeetingType;
  call_id: string | null;
};

export default async function AdminDashboard({
  params,
}: PageProps<"/admin/[sid]/[uid]/dashboard">) {
  const { sid, uid } = await params;
  const panel = `/admin/${sid}/${uid}`;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const requestTime = new Date();
  const requestIso = requestTime.toISOString();
  const nowMs = requestTime.getTime();

  const [roster, { data: meetingRows }, { data: enquiries }, { data: taskRows }] =
    await Promise.all([
      getRoster(),
      supabase
        .from("calendar_events")
        .select("id, title, starts_at, duration_minutes, meeting_type, call_id")
        .eq("created_by", user?.id ?? "")
        .gte("starts_at", requestIso)
        .order("starts_at", { ascending: true })
        .limit(LIMIT),
      supabase
        .from("student_enquiries")
        .select("id, title, subject, created_at")
        .order("created_at", { ascending: false })
        .limit(LIMIT),
      supabase
        .from("tasks")
        .select("id, title, assigned_to, due_date, due_time, notes, status, created_at")
        .order("created_at", { ascending: false })
        .limit(LIMIT),
    ]);

  const meetings = (meetingRows ?? []) as MeetingRow[];
  const tasks = (taskRows ?? []) as Task[];

  const offlineCount = roster.filter((s) => s.type === "existing_student").length;
  const onlineCount = roster.filter((s) => s.type === "new_student").length;
  const schoolCount = new Set(roster.map((s) => s.school).filter(Boolean)).size;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <AdminPageHeader
        title="Dashboard Overview"
        subtitle="Manage student sessions, track tasks, and monitor tutoring activity."
        actions={
          <div className="flex items-center gap-3">
            <Link href={`${panel}/calendar/add-event`}>
              <AdminButton icon={Plus} size="sm">
                Schedule Meeting
              </AdminButton>
            </Link>
            <Link href={`${panel}/assign-task`}>
              <AdminButton variant="outline" size="sm" icon={ClipboardList}>
                Assign Task
              </AdminButton>
            </Link>
          </div>
        }
      />

      {/* Stats Grid inspired by reference image UI */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Signature Yellow Hero Stat Card */}
        <AdminStatCard
          label="Total Students"
          value={roster.length}
          subtitle="Enrolled across all grades"
          icon={Users}
          href={`${panel}/students`}
          variant="yellow"
          trend="+Active"
          miniChart={[40, 65, 50, 85, 95, 75, 100]}
        />

        <AdminStatCard
          label="Offline Students"
          value={offlineCount}
          subtitle="In-person classroom batches"
          icon={BookOpen}
          href={`${panel}/students`}
          miniChart={[30, 45, 60, 55, 70, 65, 80]}
        />

        <AdminStatCard
          label="Online Students"
          value={onlineCount}
          subtitle="Live interactive remote stream"
          icon={Inbox}
          href={`${panel}/students`}
          miniChart={[20, 50, 40, 70, 85, 60, 90]}
        />

        <AdminStatCard
          label="Partner Schools"
          value={schoolCount}
          subtitle="Institutions represented"
          icon={GraduationCap}
          href={`${panel}/students`}
          miniChart={[50, 40, 60, 75, 55, 80, 70]}
        />
      </div>

      {/* Next Meetings Section */}
      <AdminPanel
        title="Next Meetings"
        icon={CalendarClock}
        action={
          <Link
            href={`${panel}/upcoming-meetings`}
            className="inline-flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-stone-950 dark:text-stone-300 dark:hover:text-yellow-400 transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        }
      >
        {meetings.length ? (
          <div className="grid gap-3">
            {meetings.map((m) => {
              const startMs = new Date(m.starts_at).getTime();
              const endMs = startMs + m.duration_minutes * 60 * 1000;
              const isLive = nowMs >= startMs && nowMs <= endMs;

              return (
                <div
                  key={m.id}
                  className="group flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-200/70 bg-stone-50/60 p-4 transition-all duration-200 hover:border-yellow-400/50 hover:bg-white dark:border-stone-800/80 dark:bg-stone-900/40 dark:hover:border-yellow-500/40 dark:hover:bg-stone-900/80"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-400/15 text-yellow-600 dark:bg-yellow-400/20 dark:text-yellow-400 font-bold">
                      <CalendarClock className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm truncate text-stone-900 dark:text-white">
                          {m.title}
                        </p>
                        {isLive && (
                          <AdminBadge variant="live" pulse>
                            Live
                          </AdminBadge>
                        )}
                      </div>
                      <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                        <span>{formatDateTime(m.starts_at)}</span>
                        <span>&middot;</span>
                        <span>{m.duration_minutes} mins</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 ml-auto sm:ml-0">
                    <AdminBadge variant={meetingBadgeVariant[m.meeting_type]}>
                      {MEETING_TYPE_LABELS[m.meeting_type]}
                    </AdminBadge>

                    {m.call_id && (
                      <Link href={`/admin/meeting/${m.call_id}`}>
                        <AdminButton
                          size="sm"
                          icon={Video}
                          className={isLive ? "animate-pulse" : ""}
                        >
                          {isLive ? "Join Call" : "Join"}
                        </AdminButton>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-400">
              <CalendarClock className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-semibold text-stone-800 dark:text-stone-200">
              No upcoming meetings scheduled
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Create a new session on your calendar to invite students.
            </p>
            <Link href={`${panel}/calendar/add-event`} className="mt-4 inline-block">
              <AdminButton size="sm" icon={Plus}>
                Schedule Meeting
              </AdminButton>
            </Link>
          </div>
        )}
      </AdminPanel>

      {/* Two column grid for Enquiries and Tasks */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Enquiries */}
        <AdminPanel
          title="Recent Enquiries"
          icon={Inbox}
          action={
            <Link
              href={`${panel}/enquiry`}
              className="inline-flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-stone-950 dark:text-stone-300 dark:hover:text-yellow-400 transition-colors"
            >
              <span>View All</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          {enquiries?.length ? (
            <div className="space-y-3">
              {enquiries.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-stone-200/60 bg-stone-50/50 p-4 transition-colors hover:border-yellow-400/40 hover:bg-white dark:border-stone-800/70 dark:bg-stone-900/30 dark:hover:bg-stone-900/60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate text-stone-800 dark:text-stone-200">
                        {r.title}
                      </p>
                      <p className="mt-0.5 text-xs text-yellow-600 dark:text-yellow-400 font-semibold">
                        {r.subject}
                      </p>
                    </div>
                    <span className="shrink-0 text-[11px] font-medium text-stone-400">
                      {formatDateTime(r.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-400">
                <Inbox className="h-5 w-5" />
              </div>
              <p className="mt-2 text-xs font-semibold text-stone-500 dark:text-stone-400">
                No recent enquiries received.
              </p>
            </div>
          )}
        </AdminPanel>

        {/* Recent Tasks */}
        <AdminPanel
          title="Recent Tasks"
          icon={ClipboardList}
          action={
            <Link
              href={`${panel}/assign-task`}
              className="inline-flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-stone-950 dark:text-stone-300 dark:hover:text-yellow-400 transition-colors"
            >
              <span>Manage</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          {tasks.length ? (
            <div className="space-y-3">
              {tasks.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200/60 bg-stone-50/50 p-4 transition-colors hover:border-yellow-400/40 hover:bg-white dark:border-stone-800/70 dark:bg-stone-900/30 dark:hover:bg-stone-900/60"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm truncate text-stone-800 dark:text-stone-200">
                      {t.title}
                    </p>
                    <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                      {t.due_date ? `Due ${formatDate(t.due_date)}` : "No deadline"}
                    </p>
                  </div>
                  <AdminBadge variant={statusBadgeVariant[t.status]}>
                    {TASK_STATUS_LABELS[t.status]}
                  </AdminBadge>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-400">
                <ClipboardList className="h-5 w-5" />
              </div>
              <p className="mt-2 text-xs font-semibold text-stone-500 dark:text-stone-400">
                No active tasks logged.
              </p>
              <Link href={`${panel}/assign-task`} className="mt-3 inline-block">
                <AdminButton size="sm" variant="outline" icon={Plus}>
                  Add Task
                </AdminButton>
              </Link>
            </div>
          )}
        </AdminPanel>
      </div>
    </div>
  );
}
