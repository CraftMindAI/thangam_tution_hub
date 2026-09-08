import { createClient } from "../../../lib/supabase/server";

type Student = {
  name: string;
  standard: string;
  type: "Existing" | "New";
  subject?: string;
  contactName: string;
  contactNumber: string;
};

export default async function StudentManagementPage() {
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

  const byName = new Map<string, Student>();

  for (const r of existingRequests ?? []) {
    if (byName.has(r.student_name)) continue;
    byName.set(r.student_name, {
      name: r.student_name,
      standard: r.standard,
      type: "Existing",
      subject: r.subject,
      contactName: r.parent_name,
      contactNumber: r.parent_contact,
    });
  }
  for (const r of newRequests ?? []) {
    if (byName.has(r.student_name)) continue;
    byName.set(r.student_name, {
      name: r.student_name,
      standard: r.standard,
      type: "New",
      contactName: r.followup_contact_name,
      contactNumber: r.followup_contact_number,
    });
  }

  const students = [...byName.values()];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-stone-200/70 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {students.length}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Total Students
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200/70 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {students.filter((s) => s.type === "Existing").length}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Existing</p>
        </div>
        <div className="rounded-2xl border border-stone-200/70 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {students.filter((s) => s.type === "New").length}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">New</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-stone-200/70 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-800">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="border-b border-stone-200/70 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Standard</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-slate-700">
            {students.length ? (
              students.map((s) => (
                <tr key={s.name}>
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                    {s.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    {s.standard}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    {s.subject ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    {s.contactName} &middot; {s.contactNumber}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        s.type === "Existing"
                          ? "bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                      }`}
                    >
                      {s.type}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-slate-500 dark:text-slate-400"
                >
                  No students on record yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
