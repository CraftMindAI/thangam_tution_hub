"use client";

import { useActionState, useState } from "react";
import { updateAdminProfile } from "../../../../actions/admin";

export default function ProfileForm({
  email,
  fullName,
  phone,
  role,
}: {
  email: string;
  fullName: string;
  phone: string;
  role: string;
}) {
  const [state, formAction, pending] = useActionState(
    updateAdminProfile,
    undefined
  );

  const [editing, setEditing] = useState(false);
  const [nameValue, setNameValue] = useState(fullName);
  const [phoneValue, setPhoneValue] = useState(phone);

  // Leave edit mode once a save succeeds (state-during-render, not an effect).
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state && "success" in state) setEditing(false);
  }

  function cancel() {
    setNameValue(fullName);
    setPhoneValue(phone);
    setEditing(false);
  }

  const fieldClass = (locked: boolean) =>
    `mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-colors ${
      locked
        ? "border-stone-300 bg-stone-100 text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400"
        : "border-stone-300 bg-stone-50 text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
    }`;

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Profile Details
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {editing
              ? "Update your name and contact number."
              : "Your account information."}
          </p>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="shrink-0 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-500 hover:text-slate-900 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-400 dark:hover:text-white"
          >
            Update Profile
          </button>
        )}
      </div>

      {state && "error" in state && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {state.error}
        </p>
      )}
      {state && "success" in state && !editing && (
        <p className="mt-4 rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
          Profile updated.
        </p>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Full name
          <input
            name="full_name"
            type="text"
            required
            minLength={2}
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            disabled={!editing}
            className={fieldClass(!editing)}
          />
        </label>

        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Phone
          <input
            name="phone"
            type="tel"
            required
            pattern="[6-9][0-9]{9}"
            maxLength={10}
            value={phoneValue}
            onChange={(e) => setPhoneValue(e.target.value)}
            disabled={!editing}
            placeholder="10-digit mobile number"
            className={fieldClass(!editing)}
          />
        </label>

        <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Email
          <input
            type="email"
            value={email}
            disabled
            className={fieldClass(true)}
          />
        </label>

        <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Role
          <input
            type="text"
            value={role}
            disabled
            className={fieldClass(true)}
          />
        </label>
      </div>

      {editing && (
        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-gradient-to-r from-slate-700 to-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {pending ? "Saving…" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={cancel}
            disabled={pending}
            className="rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-500 hover:text-slate-900 disabled:opacity-60 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-400 dark:hover:text-white"
          >
            Cancel
          </button>
        </div>
      )}
    </form>
  );
}
