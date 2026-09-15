"use client";

import { useActionState, useState } from "react";
import { createAdminUser } from "@/app/actions/admin";
import { X, Plus, Users } from "@/app/components/icons";

const inputClass =
  "mt-1.5 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-xs font-semibold text-stone-900 outline-none placeholder:text-stone-400 focus:border-yellow-400 focus:bg-white dark:border-stone-800 dark:bg-stone-900 dark:text-white dark:focus:border-yellow-400 transition-colors";

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
    <div className="rounded-[28px] border border-stone-200/90 bg-white p-6 sm:p-8 shadow-sm dark:border-stone-800/80 dark:bg-[#14151b]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-400 text-stone-950 shadow-md">
            <Users className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-stone-900 dark:text-white">
              Administrator Accounts
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Invite additional administrators and staff members to manage the portal.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400 px-5 py-2.5 text-xs font-bold text-stone-950 shadow-sm shadow-yellow-500/25 hover:bg-yellow-300 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Admin Staff
        </button>
      </div>

      {state && "error" in state && (
        <div className="mt-4 rounded-2xl bg-yellow-400/20 p-3.5 text-xs font-bold text-yellow-800 dark:text-yellow-300 border border-yellow-400/40">
          {state.error}
        </div>
      )}
      {state && "success" in state && (
        <div className="mt-4 rounded-2xl bg-emerald-500/15 p-3.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
          Invitation sent to {state.email}. They will receive a link to set their password.
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !pending && setOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-[28px] border border-stone-200/90 bg-white p-6 sm:p-8 shadow-2xl dark:border-stone-800 dark:bg-[#14151b]">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h3 className="text-lg font-extrabold text-stone-900 dark:text-white">
                  Invite Administrator
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  An activation email will be sent to the address provided.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-xl p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form action={formAction}>
              {state && "error" in state && (
                <div className="mb-4 rounded-2xl bg-yellow-400/20 p-3 text-xs font-bold text-yellow-800 dark:text-yellow-300 border border-yellow-400/40">
                  {state.error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    First Name
                    <input
                      type="text"
                      name="first_name"
                      required
                      placeholder="First name"
                      className={inputClass}
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Last Name
                    <input
                      type="text"
                      name="last_name"
                      required
                      placeholder="Last name"
                      className={inputClass}
                    />
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Work Email
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="staff@thangamtution.com"
                      className={inputClass}
                    />
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Phone Number
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
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={pending}
                  className="rounded-full border border-stone-300 px-5 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="rounded-full bg-yellow-400 px-6 py-2.5 text-xs font-bold text-stone-950 shadow-sm shadow-yellow-500/25 hover:bg-yellow-300 disabled:opacity-50 transition-all"
                >
                  {pending ? "Sending Invite…" : "Send Invite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
