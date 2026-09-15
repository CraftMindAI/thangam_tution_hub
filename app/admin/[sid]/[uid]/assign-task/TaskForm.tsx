"use client";

import { useActionState, useState } from "react";
import { createTask } from "@/app/actions/tasks";
import { ClipboardList, Plus } from "@/app/components/icons";
import { AdminCard, AdminButton } from "../_components/ui";

const inputClass =
  "mt-1.5 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-xs font-semibold text-stone-900 outline-none placeholder:text-stone-400 focus:border-yellow-400 focus:bg-white dark:border-stone-800 dark:bg-stone-900 dark:text-white dark:focus:border-yellow-400 transition-colors";

export type AdminOption = { id: string; name: string };

export default function TaskForm({ admins }: { admins: AdminOption[] }) {
  const [state, formAction, pending] = useActionState(createTask, undefined);

  // Remount the form (clearing its fields) after a successful submit.
  const [formKey, setFormKey] = useState(0);
  const [handled, setHandled] = useState(state);
  if (state !== handled) {
    setHandled(state);
    if (state && "success" in state) setFormKey((k) => k + 1);
  }

  return (
    <AdminCard className="p-6 sm:p-8">
      <form key={formKey} action={formAction}>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-400 text-stone-950 shadow-md">
            <ClipboardList className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-stone-900 dark:text-white">
              Create New Task
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Assign administrative and student follow-up duties to staff.
            </p>
          </div>
        </div>

        {state && "error" in state && (
          <div className="mt-4 rounded-2xl bg-yellow-400/20 p-3.5 text-xs font-bold text-yellow-800 dark:text-yellow-300 border border-yellow-400/40">
            {state.error}
          </div>
        )}
        {state && "success" in state && (
          <div className="mt-4 rounded-2xl bg-emerald-500/15 p-3.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            {state.message}
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Task Title
              <input
                name="title"
                type="text"
                required
                placeholder="e.g. Follow up with Class 8 parents regarding quarterly test"
                className={inputClass}
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Assign To Admin Staff
              <select
                name="assigned_to"
                required
                defaultValue=""
                className={inputClass}
              >
                <option value="" disabled>
                  Select Administrator
                </option>
                {admins.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Due Date
                <input name="due_date" type="date" className={inputClass} />
              </label>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Due Time
                <input name="due_time" type="time" className={inputClass} />
              </label>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Additional Notes & Instructions
              <textarea
                name="notes"
                rows={3}
                placeholder="Enter details or references for this task…"
                className={inputClass}
              />
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <AdminButton
            type="submit"
            loading={pending}
            icon={Plus}
          >
            Assign Task
          </AdminButton>
        </div>
      </form>
    </AdminCard>
  );
}
