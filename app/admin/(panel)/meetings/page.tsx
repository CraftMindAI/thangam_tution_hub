import Link from "next/link";
import { createClient } from "../../../lib/supabase/server";
import { CalendarClock } from "../../../components/icons";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function MeetingsPage() {
  const supabase = await createClient();

  const { data: requests } = await supabase
    .from("new_student_requests")
    .select("*")
    .order("meeting_at", { ascending: false });

  const now = new Date().getTime();
  const meetings = requests ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          All meetings scheduled with prospective students and parents.
        </p>
        <Link
          href="/admin/upcoming-meetings"
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-teal-900/15 transition-transform hover:scale-[1.02]"
        >
          <CalendarClock className="h-4 w-4" />
          Go to Upcoming
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-stone-200/70 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-800">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="border-b border-stone-200/70 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Scheduled</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-slate-700">
            {meetings.length ? (
              meetings.map((r) => {
                const past = new Date(r.meeting_at).getTime() < now;
                return (
                  <tr key={r.id}>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                      {r.student_name}
                      <span className="block text-xs font-normal text-slate-500 dark:text-slate-400">
                        Std {r.standard}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                      {r.followup_contact_name} &middot;{" "}
                      {r.followup_contact_number}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                      {formatDateTime(r.meeting_at)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          past
                            ? "bg-stone-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                            : "bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300"
                        }`}
                      >
                        {past ? "Completed" : "Upcoming"}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-slate-500 dark:text-slate-400"
                >
                  No meetings scheduled yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
