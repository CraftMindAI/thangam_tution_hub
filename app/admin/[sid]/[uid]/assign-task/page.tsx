import { createClient } from "@/app/lib/supabase/server";
import { X } from "@/app/components/icons";
import { deleteTask, setTaskStatus } from "@/app/actions/tasks";
import {
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  type Task,
  type TaskStatus,
} from "@/app/lib/tasks";
import TaskForm from "./TaskForm";

const statusStyles: Record<TaskStatus, string> = {
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  in_progress: "bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  completed: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
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

export default async function AssignTaskPage() {
  const supabase = await createClient();

  const [{ data: admins }, { data: tasks }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name")
      .eq("role", "admin")
      .order("full_name", { ascending: true }),
    supabase
      .from("tasks")
      .select("id, title, assigned_to, due_date, due_time, notes, status, created_at")
      .order("created_at", { ascending: false }),
  ]);

  const adminOptions = (admins ?? []).map((a) => ({
    id: a.id,
    name: a.full_name ?? "Admin",
  }));
  const nameById = new Map(adminOptions.map((a) => [a.id, a.name]));
  const rows = (tasks ?? []) as Task[];

  return (
    <div className="space-y-6">
      <TaskForm admins={adminOptions} />

      <div className="overflow-x-auto rounded-2xl border border-stone-200/70 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-800">
        <div className="border-b border-stone-200/70 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
          Assigned Tasks
        </div>

        {rows.length ? (
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-stone-200/70 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Task</th>
                <th className="px-4 py-3">Assigned To</th>
                <th className="px-4 py-3">Due</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-slate-700">
              {rows.map((t) => (
                <tr key={t.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {t.title}
                    </p>
                    {t.notes && (
                      <p className="mt-0.5 max-w-md text-xs text-slate-500 dark:text-slate-400">
                        {t.notes}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    {nameById.get(t.assigned_to) ?? "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-400">
                    {t.due_date
                      ? `${formatDate(t.due_date)}${t.due_time ? ` · ${formatTime(t.due_time)}` : ""}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[t.status]}`}
                    >
                      {TASK_STATUS_LABELS[t.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <form action={setTaskStatus} className="flex items-center">
                        <input type="hidden" name="id" value={t.id} />
                        <select
                          name="status"
                          defaultValue={t.status}
                          className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
                        >
                          {TASK_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {TASK_STATUS_LABELS[s]}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="ml-1.5 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-500 hover:text-slate-900 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-400 dark:hover:text-white"
                        >
                          Update
                        </button>
                      </form>
                      <form action={deleteTask}>
                        <input type="hidden" name="id" value={t.id} />
                        <button
                          type="submit"
                          aria-label={`Delete ${t.title}`}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
            No tasks yet.
          </p>
        )}
      </div>
    </div>
  );
}
