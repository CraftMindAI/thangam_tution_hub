import { createClient } from "@/app/lib/supabase/server";
import { redirect } from "next/navigation";
import { ClipboardList } from "@/app/components/icons";
import { setTaskStatus } from "@/app/actions/tasks";
import {
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  type Task,
  type TaskStatus,
} from "@/app/lib/tasks";
import {
  AdminPageHeader,
  AdminTableContainer,
  AdminBadge,
  AdminButton,
  tableClasses,
} from "@/app/admin/_components/ui";

const statusBadgeVariant: Record<TaskStatus, "warning" | "yellow" | "gray"> = {
  pending: "warning",
  in_progress: "yellow",
  completed: "gray",
};

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${period}`;
}

function formatDate(d: string) {
  return new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function StudentViewTasksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, title, assigned_to, due_date, due_time, notes, status, created_at")
    .eq("assigned_to", user.id)
    .order("created_at", { ascending: false });

  const rows = (tasks ?? []) as Task[];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="View Tasks"
        subtitle="Tasks assigned to you by the admin. Update the status as you make progress."
      />

      <AdminTableContainer
        header={
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-stone-900 dark:text-stone-200">
              Your Tasks ({rows.length})
            </h2>
          </div>
        }
      >
        {rows.length ? (
          <table className={tableClasses.table}>
            <thead className={tableClasses.thead}>
              <tr>
                <th className={tableClasses.th}>Task Title & Notes</th>
                <th className={tableClasses.th}>Due Date</th>
                <th className={tableClasses.th}>Current Status</th>
                <th className={`${tableClasses.th} text-right`}>Update</th>
              </tr>
            </thead>
            <tbody className={tableClasses.tbody}>
              {rows.map((t) => (
                <tr key={t.id} className={tableClasses.tr}>
                  <td className={tableClasses.td}>
                    <p className="font-extrabold text-stone-900 dark:text-white">
                      {t.title}
                    </p>
                    {t.notes && (
                      <p className="mt-0.5 max-w-md text-xs text-stone-500 dark:text-stone-400">
                        {t.notes}
                      </p>
                    )}
                  </td>
                  <td className={`${tableClasses.td} whitespace-nowrap`}>
                    <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
                      {t.due_date
                        ? `${formatDate(t.due_date)}${t.due_time ? ` · ${formatTime(t.due_time)}` : ""}`
                        : "No deadline"}
                    </span>
                  </td>
                  <td className={tableClasses.td}>
                    <AdminBadge variant={statusBadgeVariant[t.status]}>
                      {TASK_STATUS_LABELS[t.status]}
                    </AdminBadge>
                  </td>
                  <td className={`${tableClasses.td} text-right`}>
                    <form
                      action={setTaskStatus}
                      className="flex items-center justify-end gap-1.5"
                    >
                      <input type="hidden" name="id" value={t.id} />
                      <select
                        name="status"
                        defaultValue={t.status}
                        className="rounded-xl border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-bold text-stone-800 outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 focus:border-stone-400"
                      >
                        {TASK_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {TASK_STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                      <AdminButton type="submit" size="sm" variant="outline">
                        Update
                      </AdminButton>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-400">
              <ClipboardList className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-bold text-stone-800 dark:text-stone-200">
              No tasks assigned yet
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Tasks assigned to you by the admin will show up here.
            </p>
          </div>
        )}
      </AdminTableContainer>
    </div>
  );
}
