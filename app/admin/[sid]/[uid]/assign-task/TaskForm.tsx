"use client";

import { useActionState, useState } from "react";
import { createTask } from "@/app/actions/tasks";
import { ClipboardList } from "@/app/components/icons";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-500/20 dark:border-stone-700 dark:bg-stone-900 dark:text-white";

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
    <form
      key={formKey}
      action={formAction}
      className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-800"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-50 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">
          <ClipboardList className="h-5 w-5" />
        </span>
        <h2 className="font-semibold text-stone-900 dark:text-white">New Task</h2>
      </div>

      {state && "error" in state && (
        <p className="mt-4 rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
          {state.error}
        </p>
      )}
      {state && "success" in state && (
        <p className="mt-4 rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
          {state.message}
        </p>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-stone-700 sm:col-span-2 dark:text-stone-200">
          Title
          <input
            name="title"
            type="text"
            required
            placeholder="e.g. Follow up with Class 8 parents"
            className={inputClass}
          />
        </label>

        <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
          Assign to
          <select name="assigned_to" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Select admin
            </option>
            {admins.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
            Due date{" "}
            <span className="font-normal text-stone-400">(optional)</span>
            <input name="due_date" type="date" className={inputClass} />
          </label>
          <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
            Due time{" "}
            <span className="font-normal text-stone-400">(optional)</span>
            <input name="due_time" type="time" className={inputClass} />
          </label>
        </div>

        <label className="text-sm font-medium text-stone-700 sm:col-span-2 dark:text-stone-200">
          Notes <span className="font-normal text-stone-400">(optional)</span>
          <textarea
            name="notes"
            rows={3}
            placeholder="Any extra detail…"
            className={inputClass}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-5 rounded-full bg-gradient-to-r from-stone-700 to-stone-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-stone-900/20 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
      >
        {pending ? "Assigning…" : "Assign Task"}
      </button>
    </form>
  );
}
