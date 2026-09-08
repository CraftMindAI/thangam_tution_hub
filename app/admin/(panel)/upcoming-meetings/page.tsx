import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import StartZoomButton from "../../StartZoomButton";
import { CalendarClock } from "../../../components/icons";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function UpcomingMeetingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: requests } = await supabase
    .from("new_student_requests")
    .select("*")
    .gte("meeting_at", new Date().toISOString())
    .order("meeting_at", { ascending: true });

  const upcoming = requests ?? [];

  return (
    <div className="space-y-8">
      <StartZoomButton userId={user.id} userName={user.email ?? "Admin"} />

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
          Scheduled Meetings
        </h2>
        <div className="mt-3 space-y-3">
          {upcoming.length ? (
            upcoming.map((r) => (
              <div
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200/70 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                    <CalendarClock className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {r.student_name}{" "}
                      <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                        &middot; Std {r.standard}
                      </span>
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {r.contact_person_name} ({r.relationship_with_student})
                      {" · "}
                      {r.followup_contact_number}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {formatDateTime(r.meeting_at)}
                </span>
              </div>
            ))
          ) : (
            <p className="rounded-2xl border border-stone-200/70 bg-white px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400">
              No upcoming meetings. Start an instant call above when you need one.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
