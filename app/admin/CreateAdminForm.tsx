"use client";

import { useActionState, useState } from "react";
import { createAdminUser } from "../actions/admin";
import { X } from "../components/icons";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-500/20 dark:border-stone-700 dark:bg-stone-900 dark:text-white";

export default function CreateAdminForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createAdminUser, undefined);

  // Close the modal once an invite succeeds (state-during-render, not an effect).
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state && "success" in state) setOpen(false);
  }

  return (
    <div className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-800">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-stone-900 dark:text-white">
            Admin Accounts
          </h2>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
            Invite another staff member by email — they&apos;ll set their own
            password.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="shrink-0 rounded-full bg-gradient-to-r from-stone-700 to-stone-900 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-stone-900/20 transition-transform hover:scale-[1.02]"
        >
          + Add Admin
        </button>
      </div>

      {state && "error" in state && (
        <p className="mt-3 rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
          {state.error}
        </p>
      )}
      {state && "success" in state && (
        <p className="mt-3 rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
          Invite sent to {state.email}. They&apos;ll get an email with a link to
          set their password.
        </p>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
            onClick={() => !pending && setOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-stone-200/70 bg-white p-6 shadow-xl dark:border-stone-800 dark:bg-stone-800">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-semibold text-stone-900 dark:text-white">
                Add Admin
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form action={formAction} className="mt-4">
              {state && "error" in state && (
                <p className="mb-3 rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                  {state.error}
                </p>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
                  First name
                  <input
                    type="text"
                    name="first_name"
                    required
                    placeholder="First name"
                    className={inputClass}
                  />
                </label>
                <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
                  Last name
                  <input
                    type="text"
                    name="last_name"
                    required
                    placeholder="Last name"
                    className={inputClass}
                  />
                </label>
                <label className="text-sm font-medium text-stone-700 sm:col-span-2 dark:text-stone-200">
                  Email
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="new-admin@example.com"
                    className={inputClass}
                  />
                </label>
                <label className="text-sm font-medium text-stone-700 sm:col-span-2 dark:text-stone-200">
                  Phone number
                  <input
                    type="tel"
                    name="phone"
                    required
                    pattern="[6-9][0-9]{9}"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={pending}
                  className="rounded-full border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-500 hover:text-stone-900 disabled:opacity-60 dark:border-stone-600 dark:text-stone-200 dark:hover:border-stone-400 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="rounded-full bg-gradient-to-r from-stone-700 to-stone-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-stone-900/20 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                >
                  {pending ? "Sending…" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
