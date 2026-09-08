"use client";

import { useActionState } from "react";
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

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800"
    >
      <h2 className="font-semibold text-slate-900 dark:text-white">
        Profile Details
      </h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Update your name and contact number.
      </p>

      {state && "error" in state && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {state.error}
        </p>
      )}
      {state && "success" in state && (
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
            defaultValue={fullName}
            className="mt-1.5 w-full rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
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
            defaultValue={phone}
            placeholder="10-digit mobile number"
            className="mt-1.5 w-full rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </label>

        <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Email
          <input
            type="email"
            value={email}
            disabled
            className="mt-1.5 w-full rounded-lg border border-stone-300 bg-stone-100 px-3.5 py-2.5 text-sm text-slate-500 outline-none dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400"
          />
        </label>

        <label className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Role
          <input
            type="text"
            value={role}
            disabled
            className="mt-1.5 w-full rounded-lg border border-stone-300 bg-stone-100 px-3.5 py-2.5 text-sm text-slate-500 outline-none dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-6 rounded-full bg-gradient-to-r from-slate-700 to-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
      >
        {pending ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
