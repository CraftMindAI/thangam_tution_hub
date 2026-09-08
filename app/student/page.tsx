import Link from "next/link";
import { createClient } from "../lib/supabase/server";
import { BookOpen, Calendar, MessageSquare } from "../components/icons";

const roleLabels: Record<string, string> = {
  existing_student: "Existing Student",
  new_student: "New Student",
  admin: "Admin",
};

export default async function StudentDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single();

  const role = profile?.role as string | undefined;

  const [{ data: existing }, { data: newReq }] = await Promise.all([
    supabase
      .from("existing_student_requests")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("new_student_requests")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const enquiry = newReq ?? existing;
  const displayName = enquiry?.student_name ?? user!.email;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
        {role ? roleLabels[role] ?? role : "Student"}
      </span>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        Welcome, {displayName}!
      </h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Here&apos;s a quick overview of your account.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/student/calendar"
          className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm transition-colors hover:border-teal-500 dark:border-slate-800 dark:bg-slate-800 dark:hover:border-teal-500"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
            <Calendar className="h-5 w-5" />
          </span>
          <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">Calendar</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            View your scheduled class or meeting.
          </p>
        </Link>

        <div className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
            <MessageSquare className="h-5 w-5" />
          </span>
          <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">Enquiry</h2>

          {enquiry ? (
            <>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                We&apos;ve received your enquiry for{" "}
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {enquiry.student_name}
                </span>{" "}
                ({enquiry.standard}).
              </p>
              <Link
                href="/student/enquiry"
                className="mt-3 inline-flex items-center text-sm font-semibold text-teal-700 hover:underline dark:text-teal-400"
              >
                View full details
              </Link>
            </>
          ) : (
            <>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                You haven&apos;t submitted an enquiry yet.
              </p>
              <Link
                href="/demo"
                className="mt-3 inline-flex items-center text-sm font-semibold text-teal-700 hover:underline dark:text-teal-400"
              >
                Book a demo class
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
          <BookOpen className="h-5 w-5" />
        </span>
        <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">Account</h2>
        <dl className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex justify-between gap-4">
            <dt>Email</dt>
            <dd className="font-medium text-slate-800 dark:text-slate-200">{user!.email}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Role</dt>
            <dd className="font-medium text-slate-800 dark:text-slate-200">
              {role ? roleLabels[role] ?? role : "Unassigned"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
