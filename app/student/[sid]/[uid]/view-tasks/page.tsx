import Link from "next/link";
import { createClient } from "@/app/lib/supabase/server";
import { redirect } from "next/navigation";
import { ClipboardList, Eye } from "@/app/components/icons";
import { setTaskStatus } from "@/app/actions/tasks";
import TaskSubmitForm from "./TaskSubmitForm";
import TaskFilterForm from "@/app/components/TaskFilterForm";
import {
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  gmailTaskSearchUrl,
  type Task,
  type TaskStatus,
} from "@/app/lib/tasks";
import {
  AdminPageHeader,
  AdminCard,
  AdminTableContainer,
  AdminBadge,
  AdminButton,
  AdminPagination,
  tableClasses,
} from "@/app/admin/_components/ui";

const PAGE_SIZE = 10;

const statusBadgeVariant: Record<TaskStatus, "warning" | "yellow" | "success"> = {
  pending: "warning",
  in_progress: "yellow",
  completed: "success",
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

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}


export default async function StudentViewTasksPage({
  searchParams,
}: PageProps<"/student/[sid]/[uid]/view-tasks">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }
  const userId = user.id;

  const sp = (await searchParams) as {
    status?: string;
    q?: string;
    due?: string;
    page?: string;
  };
  const statusFilter = TASK_STATUSES.includes(sp.status as TaskStatus)
    ? (sp.status as TaskStatus)
    : null;
  const titleFilter = typeof sp.q === "string" ? sp.q.trim() : "";
  const dueFilter =
    typeof sp.due === "string" && /^\d{4}-\d{2}-\d{2}$/.test(sp.due) ? sp.due : "";
  const hasFilters = Boolean(statusFilter || titleFilter || dueFilter);
  const requestedPage = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);

  function buildHref(overrides: {
    status?: TaskStatus | null;
    q?: string;
    due?: string;
    page?: number;
  }) {
    const params = new URLSearchParams();
    const status = "status" in overrides ? overrides.status : statusFilter;
    const q = overrides.q ?? titleFilter;
    const due = overrides.due ?? dueFilter;
    const page = overrides.page ?? 1;
    if (status) params.set("status", status);
    if (q) params.set("q", q);
    if (due) params.set("due", due);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `?${qs}` : "?";
  }

  // Every filter and the page slice are applied in the query itself — only
  // the current page's rows (plus a few cheap counts) ever leave the DB.
  function baseQuery() {
    let q = supabase.from("tasks").select("*", { count: "exact" }).eq("assigned_to", userId);
    if (titleFilter) q = q.ilike("title", `%${titleFilter}%`);
    if (dueFilter) q = q.eq("due_date", dueFilter);
    return q;
  }

  const from = (requestedPage - 1) * PAGE_SIZE;
  const [
    { data: tasks, count: filteredCount },
    { count: allCount },
    ...statusCounts
  ] = await Promise.all([
    (statusFilter ? baseQuery().eq("status", statusFilter) : baseQuery())
      .order("created_at", { ascending: false })
      .range(from, from + PAGE_SIZE - 1),
    baseQuery(),
    ...TASK_STATUSES.map((s) => baseQuery().eq("status", s)),
  ]);

  const totalPages = Math.max(1, Math.ceil((filteredCount ?? 0) / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const rows = (tasks ?? []) as Task[];
  const countByStatus = Object.fromEntries(
    TASK_STATUSES.map((s, i) => [s, statusCounts[i].count ?? 0])
  ) as Record<TaskStatus, number>;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="View Tasks"
        subtitle="Tasks assigned to you by the admin. Update the status as you make progress."
      />

      <AdminCard className="p-4 sm:p-5">
        <TaskFilterForm />

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
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-stone-900 dark:text-stone-200">
              Your Tasks ({filteredCount ?? 0})
            </h2>
          </div>
        }
      >
        {rows.length ? (
          <table className={tableClasses.table}>
            <thead className={tableClasses.thead}>
              <tr>
                <th className={tableClasses.th}>Task</th>
                <th className={tableClasses.th}>Due Date</th>
                <th className={tableClasses.th}>Current Status</th>
                <th className={`${tableClasses.th} text-right`}>Update</th>
                <th className={`${tableClasses.th} text-right`}>Submit Work (PDF)</th>
              </tr>
            </thead>
            <tbody className={tableClasses.tbody}>
              {rows.map((t) => (
                <tr key={t.id} className={tableClasses.tr}>
                  <td className={tableClasses.td}>
                    <p className="font-extrabold text-stone-900 dark:text-white">
                      {t.title}
                    </p>
                    <a
                      href={gmailTaskSearchUrl(t.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-bold text-yellow-600 hover:underline dark:text-yellow-400"
                    >
                      <Eye className="h-3 w-3" />
                      View in Gmail
                    </a>
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
                      className="flex items-center justify-end gap-2"
                    >
                      <input type="hidden" name="id" value={t.id} />
                      <select
                        name="status"
                        defaultValue={t.status}
                        className="rounded-xl border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-bold text-stone-800 outline-none transition-colors focus:border-yellow-400 focus:bg-white dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 dark:focus:border-yellow-400 dark:focus:bg-stone-900 [color-scheme:light] dark:[color-scheme:dark]"
                      >
                        {TASK_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {TASK_STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                      <AdminButton type="submit" size="sm" variant="secondary">
                        Update
                      </AdminButton>
                    </form>
                  </td>
                  <td className={`${tableClasses.td} text-right`}>
                    {t.submitted_at ? (
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        Submitted {formatDateTime(t.submitted_at)}
                      </span>
                    ) : t.status === "completed" ? (
                      // Completed some other way (manual status change, or
                      // before submission tracking existed) — nothing to submit.
                      <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                        Completed {formatDateTime(t.updated_at)}
                      </span>
                    ) : (
                      <TaskSubmitForm taskId={t.id} />
                    )}
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
              {hasFilters ? "No tasks match your filters" : "No tasks assigned yet"}
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              {hasFilters
                ? "Try clearing or adjusting the filters above."
                : "Tasks assigned to you by the admin will show up here."}
            </p>
          </div>
        )}
      </AdminTableContainer>

      <AdminPagination
        page={page}
        totalPages={totalPages}
        buildHref={(p) =>
          buildHref({ status: statusFilter, q: titleFilter, due: dueFilter, page: p })
        }
      />
    </div>
  );
}
