import Link from "next/link";
import { createClient } from "../../lib/supabase/server";

const roleLabels: Record<string, string> = {
  existing_student: "Existing Student",
  new_student: "New Student",
  admin: "Admin",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function DashboardView({ userId }: { userId: string }) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  const role = profile?.role as string | undefined;

  const [{ data: existing }, { data: newReq }, { data: enquiries }] = await Promise.all([
    supabase
      .from("existing_student_requests")
      .select("student_name")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("new_student_requests")
      .select("student_name")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("student_enquiries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  const displayName = existing?.student_name ?? newReq?.student_name ?? "Student";

  return (
    <div className="space-y-8">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
          {role ? roleLabels[role] ?? role : "Student"}
        </span>
        <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome, {displayName}!
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Here&apos;s a quick overview of your account.
        </p>
      </div>

      <div className="inline-flex w-auto flex-col rounded-2xl border border-stone-200/70 bg-white px-6 py-5 shadow-sm dark:border-slate-800 dark:bg-slate-800">
        <p className="text-3xl font-bold leading-tight text-slate-900 dark:text-white">
          {enquiries?.length ?? 0}
        </p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Total Enquiries</p>
      </div>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            Your Enquiries
          </h2>
          <Link
            href="/student/enquiry"
            className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            Submit new
          </Link>
        </div>

        <div className="mt-3 overflow-x-auto rounded-2xl border border-stone-200/70 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-800">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-stone-200/70 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-slate-700">
              {enquiries?.length ? (
                enquiries.map((e) => (
                  <tr key={e.id}>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                      {e.title}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                      {e.subject}
                    </td>
                    <td className="max-w-xs px-4 py-3 text-slate-600 dark:text-slate-400">
                      {e.description}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-400">
                      {formatDateTime(e.created_at)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-slate-500 dark:text-slate-400"
                  >
                    You haven&apos;t submitted any enquiries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
