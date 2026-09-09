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
} from "@/app/components/icons";

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

const statusStyles: Record<TaskStatus, string> = {
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  in_progress: "bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  completed: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
};

type MeetingRow = {
  id: string;
  title: string;
  starts_at: string;
  duration_minutes: number;
  meeting_type: MeetingType;
  call_id: string | null;
};

/** Card shell shared by the two panels under the meetings list. */
function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col rounded-2xl border border-stone-200/70 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-800">
      <div className="flex items-center justify-between gap-3 border-b border-stone-200/70 px-4 py-3 dark:border-slate-700">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
          {title}
        </h2>
        {action}
      </div>
      <div className="flex-1">{children}</div>
    </section>
  );
}

export default async function AdminDashboard({
  params,
}: PageProps<"/admin/[sid]/[uid]/dashboard">) {
  const { sid, uid } = await params;
  const panel = `/admin/${sid}/${uid}`;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [roster, { data: meetingRows }, { data: enquiries }, { data: taskRows }] =
    await Promise.all([
      getRoster(),
      supabase
        .from("calendar_events")
        .select("id, title, starts_at, duration_minutes, meeting_type, call_id")
        .eq("created_by", user?.id ?? "")
        .gte("starts_at", new Date().toISOString())
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

  const stats = [
    {
      label: "Total Students",
      value: roster.length,
      icon: Users,
      href: `${panel}/students`,
    },
    {
      label: "Offline Students",
      value: roster.filter((s) => s.type === "existing_student").length,
      icon: BookOpen,
      href: `${panel}/students`,
    },
    {
      label: "Online Students",
      value: roster.filter((s) => s.type === "new_student").length,
      icon: Inbox,
      href: `${panel}/students`,
    },
    {
      label: "Schools",
      value: new Set(roster.map((s) => s.school).filter(Boolean)).size,
      icon: BookOpen,
      href: `${panel}/students`,
    },
  ];

  const linkClass =
    "text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white";

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-sm transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800 dark:hover:border-slate-700"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
              <s.icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
              {s.value}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">{s.label}</p>
          </Link>
        ))}
      </div>

      <Panel
        title="Next Meetings"
        action={
          <Link href={`${panel}/upcoming-meetings`} className={linkClass}>
            View all
          </Link>
        }
      >
        {meetings.length ? (
          <ul className="divide-y divide-stone-100 dark:divide-slate-700">
            {meetings.map((m) => (
              <li
                key={m.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {m.title}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">
                    {MEETING_TYPE_LABELS[m.meeting_type]} &middot;{" "}
                    {m.duration_minutes} min
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-slate-600 dark:text-slate-400">
                    {formatDateTime(m.starts_at)}
                  </span>
                  {m.call_id && (
                    <Link
                      href={`/admin/meeting/${m.call_id}`}
                      className="rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
                    >
                      Join
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-8 text-center">
            <CalendarClock className="mx-auto h-6 w-6 text-slate-400 opacity-60" />
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              No upcoming meetings scheduled.
            </p>
            <Link
              href={`${panel}/calendar/add-event`}
              className="mt-4 inline-block rounded-full bg-gradient-to-r from-slate-700 to-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition-transform hover:scale-[1.02]"
            >
              + Schedule Meeting
            </Link>
          </div>
        )}
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel
          title="Recent Enquiries"
          action={
            <Link href={`${panel}/enquiry`} className={linkClass}>
              View
            </Link>
          }
        >
          {enquiries?.length ? (
            <ul className="divide-y divide-stone-100 dark:divide-slate-700">
              {enquiries.map((r) => (
                <li key={r.id} className="px-4 py-3 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        {r.title}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400">
                        {r.subject}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                      {formatDateTime(r.created_at)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-8 text-center">
              <Inbox className="mx-auto h-6 w-6 text-slate-400 opacity-60" />
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                No enquiries yet.
              </p>
            </div>
          )}
        </Panel>

        <Panel
          title="Recent Tasks"
          action={
            tasks.length ? (
              <Link href={`${panel}/assign-task`} className={linkClass}>
                View
              </Link>
            ) : null
          }
        >
          {tasks.length ? (
            <ul className="divide-y divide-stone-100 dark:divide-slate-700">
              {tasks.map((t) => (
                <li key={t.id} className="px-4 py-3 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        {t.title}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400">
                        {t.due_date ? `Due ${formatDate(t.due_date)}` : "No due date"}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[t.status]}`}
                    >
                      {TASK_STATUS_LABELS[t.status]}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-8 text-center">
              <ClipboardList className="mx-auto h-6 w-6 text-slate-400 opacity-60" />
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                No tasks yet.
              </p>
              <Link
                href={`${panel}/assign-task`}
                className="mt-4 inline-block rounded-full bg-gradient-to-r from-slate-700 to-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition-transform hover:scale-[1.02]"
              >
                + Add Task
              </Link>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
