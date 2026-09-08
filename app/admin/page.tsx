import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "../lib/supabase/server";
import SignOutButton from "../components/SignOutButton";
import CreateAdminForm from "./CreateAdminForm";
import StartZoomButton from "./StartZoomButton";
import { Award, BookOpen, Users } from "../components/icons";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/admin/login");
  }

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

  return (
    <div className="flex flex-1 flex-col bg-stone-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <header className="border-b border-stone-200/70 bg-white dark:border-slate-800 dark:bg-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-md shadow-slate-900/20">
              <Award className="h-5 w-5" />
            </span>
            <span className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
              Admin Dashboard
            </span>
          </Link>
          <SignOutButton />
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-800">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                <BookOpen className="h-5 w-5" />
              </span>
              <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                {existingRequests?.length ?? 0}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Existing Student Requests
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-800">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                <Users className="h-5 w-5" />
              </span>
              <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                {newRequests?.length ?? 0}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                New Student Enquiries
              </p>
            </div>
          </div>

          <div className="mt-6">
            <StartZoomButton userId={user.id} userName={user.email ?? "Admin"} />
          </div>

          <div className="mt-6">
            <CreateAdminForm />
          </div>

          <h2 className="mt-10 text-sm font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            Existing Student Requests
          </h2>
          <div className="mt-3 overflow-x-auto rounded-2xl border border-stone-200/70 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-800">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-stone-200/70 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Parent</th>
                  <th className="px-4 py-3">Standard</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Class Time</th>
                  <th className="px-4 py-3">Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-slate-700">
                {existingRequests?.length ? (
                  existingRequests.map((r) => (
                    <tr key={r.id}>
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                        {r.student_name}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {r.parent_name} &middot; {r.parent_contact}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {r.standard}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {r.subject} ({r.chapter_unit})
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {r.expected_class_date} {r.expected_class_time}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {r.feedback_rating ?? "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">
                      No requests yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <h2 className="mt-10 text-sm font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            New Student Enquiries
          </h2>
          <div className="mt-3 overflow-x-auto rounded-2xl border border-stone-200/70 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-800">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-stone-200/70 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Contacted Person</th>
                  <th className="px-4 py-3">Relationship</th>
                  <th className="px-4 py-3">Standard</th>
                  <th className="px-4 py-3">Follow-up Contact</th>
                  <th className="px-4 py-3">Meeting</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-slate-700">
                {newRequests?.length ? (
                  newRequests.map((r) => (
                    <tr key={r.id}>
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                        {r.student_name}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {r.contact_person_name}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {r.relationship_with_student}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {r.standard}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {r.followup_contact_name} &middot; {r.followup_contact_number}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {formatDateTime(r.meeting_at)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">
                      No enquiries yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
