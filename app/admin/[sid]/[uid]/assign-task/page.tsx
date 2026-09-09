import { createClient } from "@/app/lib/supabase/server";
import { ClipboardList } from "@/app/components/icons";

export default async function AssignTaskPage() {
  const supabase = await createClient();

  const { data: admins } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("role", "admin")
    .order("full_name", { ascending: true });

  return (
    <div className="space-y-6">
      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-300">
        Task storage isn&apos;t connected yet. This form shows the fields that
        will be captured once a <code>tasks</code> table is added.
      </p>

      <form className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
            <ClipboardList className="h-5 w-5" />
          </span>
          <h2 className="font-semibold text-slate-900 dark:text-white">
            New Task
          </h2>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700 sm:col-span-2 dark:text-slate-200">
            Title
            <input
              name="title"
              type="text"
              placeholder="e.g. Follow up with Class 8 parents"
              className="mt-1.5 w-full rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </label>

          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Assign to
            <select
              name="assignee"
              className="mt-1.5 w-full rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              <option value="">Select admin</option>
              {(admins ?? []).map((a) => (
                <option key={a.id} value={a.id}>
                  {a.full_name ?? "Admin"}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Due date
            <input
              name="due_date"
              type="date"
              className="mt-1.5 w-full rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </label>

          <label className="text-sm font-medium text-slate-700 sm:col-span-2 dark:text-slate-200">
            Notes
            <textarea
              name="notes"
              rows={3}
              placeholder="Any extra detail…"
              className="mt-1.5 w-full rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </label>
        </div>

        <button
          type="button"
          disabled
          className="mt-5 rounded-full bg-gradient-to-r from-slate-700 to-slate-900 px-4 py-2.5 text-sm font-semibold text-white opacity-60"
        >
          Assign Task
        </button>
      </form>

      <div className="rounded-2xl border border-stone-200/70 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-800">
        <div className="border-b border-stone-200/70 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
          Assigned Tasks
        </div>
        <p className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
          No tasks yet.
        </p>
      </div>
    </div>
  );
}
