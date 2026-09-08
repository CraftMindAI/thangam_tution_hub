import { createClient } from "../../lib/supabase/server";
import MonthCalendar, { type CalendarEvent } from "./MonthCalendar";

function formatTime12h(hour: number, minute: number) {
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}

export default async function StudentCalendar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: existing }, { data: newReq }] = await Promise.all([
    supabase
      .from("existing_student_requests")
      .select("expected_class_date, expected_class_time")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("new_student_requests")
      .select("meeting_at")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const events: CalendarEvent[] = [];

  if (newReq?.meeting_at) {
    const d = new Date(newReq.meeting_at);
    events.push({
      date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`,
      time: formatTime12h(d.getHours(), d.getMinutes()),
      label: "Zoom Meeting",
    });
  }

  if (existing?.expected_class_date && existing?.expected_class_time) {
    const [h, m] = existing.expected_class_time.split(":").map(Number);
    events.push({
      date: existing.expected_class_date,
      time: formatTime12h(h, m),
      label: "Class",
    });
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        Calendar
      </h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Your upcoming classes and meeting invites will appear here.
      </p>

      <div className="mt-6">
        <MonthCalendar events={events} />
      </div>
    </div>
  );
}
