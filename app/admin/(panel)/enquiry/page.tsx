import { createClient } from "../../../lib/supabase/server";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function EnquiryPage() {
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

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
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
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-slate-500 dark:text-slate-400"
                  >
                    No requests yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
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
                      {r.followup_contact_name} &middot;{" "}
                      {r.followup_contact_number}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                      {formatDateTime(r.meeting_at)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-slate-500 dark:text-slate-400"
                  >
                    No enquiries yet.
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
