"use client";

import { useActionState, useState } from "react";
import { createAdminUser } from "../actions/admin";

export default function CreateAdminForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createAdminUser, undefined);

  return (
    <div className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Admin Accounts
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Invite another staff member by email — they&apos;ll set their own
            password.
          </p>
        </div>
        {!open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="shrink-0 rounded-full bg-gradient-to-r from-slate-700 to-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition-transform hover:scale-[1.02]"
          >
            + Add Admin
          </button>
        )}
      </div>

      {open && (
        <form action={formAction} className="mt-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              type="text"
              name="full_name"
              required
              placeholder="Full name"
              className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
            <input
              type="tel"
              name="phone"
              required
              pattern="[6-9][0-9]{9}"
              maxLength={10}
              placeholder="10-digit mobile number"
              className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="new-admin@example.com"
              className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="mt-3 rounded-full bg-gradient-to-r from-slate-700 to-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {pending ? "Sending…" : "Send Invite"}
          </button>
        </form>
      )}

      {state && "error" in state && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {state.error}
        </p>
      )}
      {state && "success" in state && (
        <p className="mt-3 rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
          Invite sent to {state.email}. They&apos;ll get an email with a link
          to set their password.
        </p>
      )}
    </div>
  );
}
