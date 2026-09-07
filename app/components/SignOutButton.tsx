"use client";

import { signOut } from "../actions/auth";

export default function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-teal-600 hover:text-teal-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-teal-500 dark:hover:text-teal-300"
      >
        Sign Out
      </button>
    </form>
  );
}
