import Link from "next/link";
import { createClient } from "@/app/lib/supabase/server";
import { X, ClipboardList } from "@/app/components/icons";
import TaskFilterForm from "@/app/components/TaskFilterForm";
import { deleteTask, setTaskStatus } from "@/app/actions/tasks";
import { getRoster } from "@/app/lib/roster";
import {
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  type Task,
  type TaskStatus,
} from "@/app/lib/tasks";
import TaskFormModal from "./TaskFormModal";
import {
  AdminPageHeader,
  AdminCard,
  AdminTableContainer,
  AdminBadge,
  AdminButton,
  AdminPagination,
  tableClasses,
} from "../_components/ui";

const PAGE_SIZE = 10;

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

function isOverdue(t: Task) {
  if (!t.due_date || t.status === "completed") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${t.due_date}T00:00:00`) < today;
}

export default async function AssignTaskPage({
  searchParams,
}: PageProps<"/admin/[sid]/[uid]/assign-task">) {
  const supabase = await createClient();

  const sp = (await searchParams) as {
    status?: string;
    q?: string;
    email?: string;
    due?: string;
    page?: string;
  };
  const statusFilter = TASK_STATUSES.includes(sp.status as TaskStatus)
    ? (sp.status as TaskStatus)
    : null;
  const titleFilter = typeof sp.q === "string" ? sp.q.trim() : "";
  const emailFilter = typeof sp.email === "string" ? sp.email.trim() : "";
  const dueFilter =
    typeof sp.due === "string" && /^\d{4}-\d{2}-\d{2}$/.test(sp.due) ? sp.due : "";
  const hasFilters = Boolean(statusFilter || titleFilter || emailFilter || dueFilter);
  const requestedPage = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);

  function buildHref(overrides: {
    status?: TaskStatus | null;
    q?: string;
    email?: string;
    due?: string;
    page?: number;
  }) {
    const params = new URLSearchParams();
    const status = "status" in overrides ? overrides.status : statusFilter;
    const q = overrides.q ?? titleFilter;
    const email = overrides.email ?? emailFilter;
    const due = overrides.due ?? dueFilter;
    const page = overrides.page ?? 1;
    if (status) params.set("status", status);
    if (q) params.set("q", q);
    if (email) params.set("email", email);
    if (due) params.set("due", due);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `?${qs}` : "?";
  }

  // Every filter and the page slice are applied in the query itself — only
  // the current page's rows (plus a few cheap counts) ever leave the DB.
  function baseTaskQuery() {
    let q = supabase
      .from("tasks")
      .select(
        "id, title, assigned_to, due_date, due_time, notes, status, notified_email, email_status, created_at",
        { count: "exact" }
      );
    if (titleFilter) q = q.ilike("title", `%${titleFilter}%`);
    if (emailFilter) q = q.ilike("notified_email", `%${emailFilter}%`);
    if (dueFilter) q = q.eq("due_date", dueFilter);
    return q;
  }

  const from = (requestedPage - 1) * PAGE_SIZE;
  const [
    { data: admins },
    { data: tasks, count: filteredCount },
    { count: allCount },
    statusCountResults,
    roster,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name")
      .eq("role", "admin")
      .order("full_name", { ascending: true }),
    (statusFilter ? baseTaskQuery().eq("status", statusFilter) : baseTaskQuery())
      .order("created_at", { ascending: false })
      .range(from, from + PAGE_SIZE - 1),
    baseTaskQuery(),
    Promise.all(TASK_STATUSES.map((s) => baseTaskQuery().eq("status", s))),
    getRoster(),
  ]);

  const adminOptions = (admins ?? []).map((a) => ({
    id: a.id,
    name: a.full_name ?? "Admin",
  }));
  const studentOptions = roster.map((s) => ({
    userId: s.userId,
    name: s.name || s.email || "Student",
    class: s.class,
    email: s.email,
    type: s.type,
  }));
  const nameById = new Map([
    ...adminOptions.map((a) => [a.id, a.name] as const),
    ...studentOptions.map((s) => [s.userId, s.name] as const),
  ]);

  const totalPages = Math.max(1, Math.ceil((filteredCount ?? 0) / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const rows = (tasks ?? []) as Task[];
  const countByStatus = Object.fromEntries(
    TASK_STATUSES.map((s, i) => [s, statusCountResults[i].count ?? 0])
  ) as Record<TaskStatus, number>;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Task Management"
        subtitle="Assign homework or tasks to a class (or hand-picked students) and track progress."
        actions={<TaskFormModal students={studentOptions} />}
      />

      <AdminCard className="p-4 sm:p-5">
        <TaskFilterForm showEmail />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Link
            href={buildHref({ status: null })}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
              !statusFilter
                ? "bg-yellow-400 text-stone-950"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
            }`}
          >
            All ({allCount ?? 0})
          </Link>
          {TASK_STATUSES.map((s) => (
            <Link
              key={s}
              href={buildHref({ status: s })}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                statusFilter === s
                  ? "bg-yellow-400 text-stone-950"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
              }`}
            >
              {TASK_STATUS_LABELS[s]} ({countByStatus[s]})
            </Link>
          ))}
        </div>
      </AdminCard>

      <AdminTableContainer
        header={
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-stone-900 dark:text-yellow-400">
              Assigned Tasks ({filteredCount ?? 0})
            </h2>
          </div>
        }
      >
        {rows.length ? (
          <table className={tableClasses.table}>
            <thead className={tableClasses.thead}>
              <tr>
                <th className={tableClasses.th}>Subject</th>
                <th className={tableClasses.th}>Assigned Student</th>
                <th className={tableClasses.th}>Email Sent To</th>
                <th className={tableClasses.th}>Due Date</th>
                <th className={tableClasses.th}>Current Status</th>
                <th className={`${tableClasses.th} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className={tableClasses.tbody}>
              {rows.map((t) => (
                <tr key={t.id} className={tableClasses.tr}>
                  <td className={tableClasses.td}>
                    <p className="font-extrabold text-stone-900 dark:text-white">
                      {t.title}
                    </p>
                  </td>
                  <td className={tableClasses.td}>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      {nameById.get(t.assigned_to) ?? "—"}
                    </span>
                  </td>
                  <td className={tableClasses.td}>
                    <p
                      className={`text-xs font-semibold break-all ${
                        t.email_status === "failed"
                          ? "text-red-600 dark:text-red-400"
                          : "text-stone-800 dark:text-stone-200"
                      }`}
                    >
                      {t.notified_email ?? "—"}
                      {t.email_status === "failed" && " — not sent"}
                    </p>
                  </td>
                  <td className={`${tableClasses.td} whitespace-nowrap`}>
                    <span
                      className={`text-xs font-semibold ${
                        isOverdue(t)
                          ? "text-red-600 dark:text-red-400"
                          : "text-stone-600 dark:text-stone-300"
                      }`}
                    >
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
                    <div className="flex items-center justify-end gap-2">
                      <form action={setTaskStatus} className="flex items-center gap-1.5">
                        <input type="hidden" name="id" value={t.id} />
                        <select
                          name="status"
                          defaultValue={t.status}
                          className="rounded-xl border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-bold text-stone-800 outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 focus:border-yellow-400"
                        >
                          {TASK_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {TASK_STATUS_LABELS[s]}
                            </option>
                          ))}
                        </select>
                        <AdminButton
                          type="submit"
                          size="sm"
                          variant="outline"
                        >
                          Update
                        </AdminButton>
                      </form>

                      <form action={deleteTask}>
                        <input type="hidden" name="id" value={t.id} />
                        <button
                          type="submit"
                          aria-label={`Delete ${t.title}`}
                          className="rounded-xl p-2 text-stone-400 hover:bg-red-500/10 hover:text-red-600 transition-colors"
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
          <div className="py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-400">
              <ClipboardList className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-bold text-stone-800 dark:text-stone-200">
              {hasFilters ? "No tasks match your filters" : "No tasks currently recorded"}
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              {hasFilters
                ? "Try clearing or adjusting the filters above."
                : 'Click "Add Task" above to assign a task to a class or particular students.'}
            </p>
          </div>
        )}
      </AdminTableContainer>

      <AdminPagination
        page={page}
        totalPages={totalPages}
        buildHref={(p) =>
          buildHref({
            status: statusFilter,
            q: titleFilter,
            email: emailFilter,
            due: dueFilter,
            page: p,
          })
        }
      />
    </div>
  );
}
