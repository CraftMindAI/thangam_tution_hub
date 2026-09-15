import { createAdminClient } from "@/app/lib/supabase/admin";
import { Inbox } from "@/app/components/icons";
import {
  AdminPageHeader,
  AdminTableContainer,
  AdminBadge,
  tableClasses,
} from "../_components/ui";

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
    <div className="space-y-8">
      <AdminPageHeader
        title="Student Enquiries"
        subtitle="Review questions, requests, and support tickets submitted by students."
      />

      <AdminTableContainer
        header={
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-stone-900 dark:text-yellow-400">
              Submitted Tickets ({enquiries?.length ?? 0})
            </h2>
          </div>
        }
      >
        <table className={tableClasses.table}>
          <thead className={tableClasses.thead}>
            <tr>
              <th className={tableClasses.th}>Student Information</th>
              <th className={tableClasses.th}>Inquiry Topic</th>
              <th className={tableClasses.th}>Subject</th>
              <th className={tableClasses.th}>Message Details</th>
              <th className={`${tableClasses.th} whitespace-nowrap`}>Date Submitted</th>
            </tr>
          </thead>
          <tbody className={tableClasses.tbody}>
            {enquiries?.length ? (
              enquiries.map((e) => {
                const studentName =
                  nameById.get(e.user_id) ||
                  emailById.get(e.user_id) ||
                  "Student";
                const initial = studentName.charAt(0).toUpperCase();

                return (
                  <tr key={e.id} className={tableClasses.tr}>
                    <td className={tableClasses.td}>
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-stone-950 font-black text-xs shadow-sm">
                          {initial}
                        </span>
                        <div>
                          <p className="font-extrabold text-stone-900 dark:text-white">
                            {studentName}
                          </p>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400">
                            {emailById.get(e.user_id) ?? "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className={tableClasses.td}>
                      <span className="font-bold text-stone-800 dark:text-stone-200">
                        {e.title}
                      </span>
                    </td>
                    <td className={tableClasses.td}>
                      <AdminBadge variant="yellow">{e.subject}</AdminBadge>
                    </td>
                    <td className={`${tableClasses.td} max-w-md`}>
                      <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                        {e.description}
                      </p>
                    </td>
                    <td className={`${tableClasses.td} whitespace-nowrap text-xs text-stone-500 dark:text-stone-400 font-semibold`}>
                      {formatDateTime(e.created_at)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-14 text-center text-stone-500 dark:text-stone-400"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-400">
                    <Inbox className="h-6 w-6" />
                  </div>
                  <p className="mt-3 text-sm font-bold text-stone-800 dark:text-stone-200">
                    No student enquiries found
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Student enquiries submitted from the portal will appear here.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </AdminTableContainer>
    </div>
  );
}
