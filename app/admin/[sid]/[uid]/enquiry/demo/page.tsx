import { createClient } from "@/app/lib/supabase/server";
import { reconcileCompletedDemoMeetings, setDemoRequestStatus } from "@/app/actions/demo";
import { type DemoRequestStatus } from "@/app/lib/validation/demo";
import { Video } from "@/app/components/icons";
import {
  AdminPageHeader,
  AdminTableContainer,
  AdminBadge,
  AdminButton,
  tableClasses,
} from "../../_components/ui";

type DemoRequestRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  status: DemoRequestStatus;
  created_at: string;
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

const statusBadgeVariant: Record<DemoRequestStatus, "warning" | "success"> = {
  pending: "warning",
  completed: "success",
};

// Pending (needs action) first, then completed — newest first within each group.
const statusSortRank: Record<DemoRequestStatus, number> = {
  pending: 0,
  completed: 1,
};

export default async function DemoRequestsPage() {
  const supabase = await createClient();

  await reconcileCompletedDemoMeetings();

  const { data: rawRequests } = await supabase
    .from("demo_requests")
    .select("id, name, email, phone, description, status, created_at")
    .order("created_at", { ascending: false });

  const requests = [...((rawRequests ?? []) as DemoRequestRow[])].sort((a, b) => {
    const rankDiff = statusSortRank[a.status] - statusSortRank[b.status];
    if (rankDiff !== 0) return rankDiff;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Demo Requests"
        subtitle="Free demo class requests submitted from the website."
      />

      <AdminTableContainer
        header={
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-stone-900 dark:text-yellow-400">
              Submitted Requests ({requests.length})
            </h2>
          </div>
        }
      >
        <table className={tableClasses.table}>
          <thead className={tableClasses.thead}>
            <tr>
              <th className={tableClasses.th}>Contact</th>
              <th className={tableClasses.th}>Details</th>
              <th className={tableClasses.th}>Status</th>
              <th className={`${tableClasses.th} whitespace-nowrap`}>Date Submitted</th>
              <th className={`${tableClasses.th} text-right`}>Update</th>
            </tr>
          </thead>
          <tbody className={tableClasses.tbody}>
            {requests.length ? (
              requests.map((r) => (
                <tr key={r.id} className={tableClasses.tr}>
                  <td className={tableClasses.td}>
                    <p className="font-extrabold text-stone-900 dark:text-white">{r.name}</p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">{r.email}</p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">{r.phone}</p>
                  </td>
                  <td className={`${tableClasses.td} max-w-md`}>
                    <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                      {r.description}
                    </p>
                  </td>
                  <td className={tableClasses.td}>
                    <AdminBadge variant={statusBadgeVariant[r.status]}>
                      {r.status === "pending" ? "Pending" : "Completed"}
                    </AdminBadge>
                  </td>
                  <td className={`${tableClasses.td} whitespace-nowrap text-xs text-stone-500 dark:text-stone-400 font-semibold`}>
                    {formatDateTime(r.created_at)}
                  </td>
                  <td className={`${tableClasses.td} text-right`}>
                    <form action={setDemoRequestStatus} className="flex items-center justify-end gap-1.5">
                      <input type="hidden" name="id" value={r.id} />
                      <input
                        type="hidden"
                        name="status"
                        value={r.status === "pending" ? "completed" : "pending"}
                      />
                      <AdminButton type="submit" size="sm" variant="outline">
                        {r.status === "pending" ? "Mark Completed" : "Mark Pending"}
                      </AdminButton>
                    </form>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-14 text-center text-stone-500 dark:text-stone-400">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-400">
                    <Video className="h-6 w-6" />
                  </div>
                  <p className="mt-3 text-sm font-bold text-stone-800 dark:text-stone-200">
                    No demo requests found
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Demo requests submitted from the website will appear here.
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
