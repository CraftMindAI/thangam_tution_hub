import { createAdminClient } from "@/app/lib/supabase/admin";
import { Inbox } from "@/app/components/icons";

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
  // Service role: enquiries are joined to auth emails, which RLS can't reach.
  const admin = createAdminClient();

  const { data: enquiries } = await admin
    .from("student_enquiries")
    .select("id, user_id, title, subject, description, created_at")
    .order("created_at", { ascending: false });

  const userIds = [...new Set((enquiries ?? []).map((e) => e.user_id))];

  const [{ data: userList }, { data: profiles }] = await Promise.all([
    admin.auth.admin.listUsers({ perPage: 1000 }),
    userIds.length
      ? admin.from("profiles").select("id, full_name").in("id", userIds)
      : Promise.resolve({ data: [] }),
  ]);

  const emailById = new Map(
    (userList?.users ?? [])
      .filter((u) => u.email)
      .map((u) => [u.id, u.email as string])
  );
  const nameById = new Map(
    (profiles ?? []).map((p) => [p.id, p.full_name as string | null])
  );

  return (
    <div className="space-y-4">
      <p className="text-sm text-stone-600 dark:text-stone-400">
        Enquiries submitted by students from their portal, newest first.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-stone-200/70 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-800">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-stone-200/70 text-xs uppercase tracking-wider text-stone-500 dark:border-stone-700 dark:text-stone-400">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-700">
            {enquiries?.length ? (
              enquiries.map((e) => (
                <tr key={e.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-stone-800 dark:text-stone-200">
                      {nameById.get(e.user_id) ||
                        emailById.get(e.user_id) ||
                        "Student"}
                    </p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {emailById.get(e.user_id) ?? "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-medium text-stone-800 dark:text-stone-200">
                    {e.title}
                  </td>
                  <td className="px-4 py-3 text-stone-600 dark:text-stone-400">
                    {e.subject}
                  </td>
                  <td className="max-w-md px-4 py-3 text-stone-600 dark:text-stone-400">
                    {e.description}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-stone-600 dark:text-stone-400">
                    {formatDateTime(e.created_at)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-stone-500 dark:text-stone-400"
                >
                  <Inbox className="mx-auto h-6 w-6 opacity-50" />
                  <p className="mt-2">No enquiries yet.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
