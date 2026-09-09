import Link from "next/link";
import { createClient } from "@/app/lib/supabase/server";
import { BookOpen, Users, CalendarClock, Inbox } from "@/app/components/icons";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminDashboard({
  params,
}: PageProps<"/admin/[sid]/[uid]/dashboard">) {
  const { sid, uid } = await params;
  const panel = `/admin/${sid}/${uid}`;

  const supabase = await createClient();

  const [{ data: existingRequests }, { data: newRequests }] = await Promise.all([
    supabase
      .from("existing_student_requests")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("new_student_requests")
      .select("*")
      .order("created_at", { ascending: false }),
  ]);

  const now = new Date().getTime();
  const upcoming = (newRequests ?? []).filter(
    (r) => new Date(r.meeting_at).getTime() >= now
  );

  const stats = [
    {
      label: "Existing Student Requests",
      value: existingRequests?.length ?? 0,
      icon: BookOpen,
      href: `${panel}/students`,
    },
    {
      label: "New Student Enquiries",
      value: newRequests?.length ?? 0,
      icon: Inbox,
      href: `${panel}/enquiry`,
    },
    {
      label: "Upcoming Meetings",
      value: upcoming.length,
      icon: CalendarClock,
      href: `${panel}/upcoming-meetings`,
    },
    {
      label: "Total Students",
      value:
        new Set([
          ...(existingRequests ?? []).map((r) => r.student_name),
          ...(newRequests ?? []).map((r) => r.student_name),
        ]).size,
      icon: Users,
      href: `${panel}/students`,
    },
  ];

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
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {s.label}
            </p>
          </Link>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            Next Meetings
          </h2>
          <Link
            href={`${panel}/upcoming-meetings`}
            className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            View all
          </Link>
        </div>
        <div className="mt-3 overflow-hidden rounded-2xl border border-stone-200/70 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-800">
          {upcoming.length ? (
            <ul className="divide-y divide-stone-100 dark:divide-slate-700">
              {upcoming.slice(0, 5).map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {r.student_name}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400">
                      {r.parent_name} &middot; {r.parent_phone}
                    </p>
                  </div>
                  <span className="shrink-0 text-slate-600 dark:text-slate-400">
                    {formatDateTime(r.meeting_at)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
              No upcoming meetings scheduled.
            </p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
          Recent Enquiries
        </h2>
        <div className="mt-3 overflow-hidden rounded-2xl border border-stone-200/70 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-800">
          {newRequests?.length ? (
            <ul className="divide-y divide-stone-100 dark:divide-slate-700">
              {newRequests.slice(0, 5).map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {r.student_name}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400">
                      Std {r.standard} &middot; {r.parent_name}
                    </p>
                  </div>
                  <span className="shrink-0 text-slate-600 dark:text-slate-400">
                    {formatDateTime(r.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
              No enquiries yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
