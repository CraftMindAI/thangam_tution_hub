"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "../actions/auth";

export default function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    undefined
  );

  if (state?.success) {
    return (
      <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-lg dark:bg-stone-800">
        <p className="rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="mt-8 rounded-[2rem] bg-white p-6 shadow-lg dark:bg-stone-800"
    >
      {state?.error && (
        <p className="mb-4 rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
          {state.error}
        </p>
      )}

      <label
        htmlFor="email"
        className="text-sm font-medium text-stone-700 dark:text-stone-200"
      >
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="you@example.com"
        className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 dark:border-stone-700 dark:bg-stone-900 dark:text-white"
      />

      <button
        type="submit"
        disabled={pending}
        className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 px-4 py-2.5 text-sm font-semibold text-stone-900 shadow-md transition-transform hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send Reset Link"}
      </button>
    </form>
  );
}
