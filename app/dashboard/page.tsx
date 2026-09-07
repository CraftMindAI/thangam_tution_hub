import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "../lib/supabase/server";
import SignOutButton from "../components/SignOutButton";
import {
  Award,
  BookOpen,
  Clock,
  GraduationCap,
  Phone,
  Users,
} from "../components/icons";

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

const feedbackLabels: Record<string, string> = {
  not_satisfied: "Not Satisfied",
  somewhat_good: "Some What Good",
  excellent: "Excellent",
};

const roleLabels: Record<string, string> = {
  existing_student: "Existing Student",
  new_student: "New Student",
  admin: "Admin",
};

export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role as "existing_student" | "new_student" | "admin" | undefined;

  const [{ data: existing }, { data: newReq }] = await Promise.all([
    role === "existing_student"
      ? supabase
          .from("existing_student_requests")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    role === "new_student"
      ? supabase
          .from("new_student_requests")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const displayName = existing?.student_name ?? newReq?.student_name ?? user.email;

  return (
    <div className="flex flex-1 flex-col bg-stone-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <header className="border-b border-stone-200/70 bg-white dark:border-slate-800 dark:bg-slate-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-900/10">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
              Thangam Varahi Tuition Hub
            </span>
          </Link>
          <SignOutButton />
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden bg-white dark:bg-slate-800">
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-teal-300/25 blur-3xl dark:bg-teal-500/10" />
          <div className="relative mx-auto max-w-5xl px-6 py-14">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
              {role ? roleLabels[role] ?? role : "Unknown Role"}
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Welcome, {displayName}!
            </h1>
            <p className="mt-3 max-w-xl text-slate-600 dark:text-slate-300">
              {role === "existing_student"
                ? "Here's a quick look at your class details and feedback with us."
                : role === "new_student"
                  ? "Thanks for reaching out — here's a summary of your enquiry."
                  : "You're signed in with administrator access."}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-12">
          {role === "existing_student" && existing ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                  <BookOpen className="h-5 w-5" />
                </span>
                <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">
                  Class Details
                </h2>
                <dl className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between gap-4">
                    <dt>Role</dt>
                    <dd className="font-medium text-slate-800 dark:text-slate-200">
                      {roleLabels[role] ?? role}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Standard</dt>
                    <dd className="font-medium text-slate-800 dark:text-slate-200">
                      {existing.standard}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Subject</dt>
                    <dd className="font-medium text-slate-800 dark:text-slate-200">
                      {existing.subject}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Chapter / Unit</dt>
                    <dd className="font-medium text-slate-800 dark:text-slate-200">
                      {existing.chapter_unit}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                  <Clock className="h-5 w-5" />
                </span>
                <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">
                  Expected Class Timing
                </h2>
                <p className="mt-3 text-lg font-semibold text-slate-800 dark:text-slate-200">
                  {formatDate(existing.expected_class_date)} &middot;{" "}
                  {formatTime(existing.expected_class_time)}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800 sm:col-span-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                  <Award className="h-5 w-5" />
                </span>
                <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">
                  Parent / Guardian
                </h2>
                <dl className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between gap-4">
                    <dt>Name</dt>
                    <dd className="font-medium text-slate-800 dark:text-slate-200">
                      {existing.parent_name}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Contact Number</dt>
                    <dd className="font-medium text-slate-800 dark:text-slate-200">
                      {existing.parent_contact}
                    </dd>
                  </div>
                  {existing.feedback_rating && (
                    <div className="flex justify-between gap-4">
                      <dt>Your Feedback</dt>
                      <dd className="font-medium text-slate-800 dark:text-slate-200">
                        {feedbackLabels[existing.feedback_rating] ?? existing.feedback_rating}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          ) : role === "new_student" && newReq ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                  <Users className="h-5 w-5" />
                </span>
                <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">
                  Enquiry Details
                </h2>
                <dl className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between gap-4">
                    <dt>Role</dt>
                    <dd className="font-medium text-slate-800 dark:text-slate-200">
                      {roleLabels[role] ?? role}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Contacted Person</dt>
                    <dd className="font-medium text-slate-800 dark:text-slate-200">
                      {newReq.contact_person_name}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Relationship</dt>
                    <dd className="font-medium text-slate-800 dark:text-slate-200">
                      {newReq.relationship_with_student}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Standard</dt>
                    <dd className="font-medium text-slate-800 dark:text-slate-200">
                      {newReq.standard}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                  <Clock className="h-5 w-5" />
                </span>
                <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">
                  Scheduled Meeting
                </h2>
                <p className="mt-3 text-lg font-semibold text-slate-800 dark:text-slate-200">
                  {new Date(newReq.meeting_at).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}{" "}
                  &middot;{" "}
                  {new Date(newReq.meeting_at).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800 sm:col-span-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                  <Phone className="h-5 w-5" />
                </span>
                <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">
                  Follow-up Contact
                </h2>
                <dl className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between gap-4">
                    <dt>Name</dt>
                    <dd className="font-medium text-slate-800 dark:text-slate-200">
                      {newReq.followup_contact_name}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Number</dt>
                    <dd className="font-medium text-slate-800 dark:text-slate-200">
                      {newReq.followup_contact_number}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800">
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Account
              </h2>
              <dl className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex justify-between gap-4">
                  <dt>Email</dt>
                  <dd className="font-medium text-slate-800 dark:text-slate-200">
                    {user.email}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Role</dt>
                  <dd className="font-medium text-slate-800 dark:text-slate-200">
                    {role ? roleLabels[role] ?? role : "Unassigned"}
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                No further details found yet.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
