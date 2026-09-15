"use client";

import { signOut } from "../actions/auth";

export default function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:border-yellow-600 hover:text-yellow-700 dark:border-stone-700 dark:text-stone-200 dark:hover:border-yellow-500 dark:hover:text-yellow-300"
      >
        Sign Out
      </button>
    </form>
  );
}
