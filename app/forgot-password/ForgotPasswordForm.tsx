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
      <div className="mt-8 rounded-3xl border-2 border-stone-900 bg-white p-6 shadow-[5px_5px_0_0_#1c1917] dark:border-stone-600 dark:bg-stone-800">
        <p className="rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="mt-8 rounded-3xl border-2 border-stone-900 bg-white p-6 shadow-[5px_5px_0_0_#1c1917] dark:border-stone-600 dark:bg-stone-800"
    >
      {state?.error && (
        <p className="mb-4 rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
          {state.error}
        </p>
      )}

      <label
        htmlFor="email"
        className="text-sm font-bold text-stone-700 dark:text-stone-200"
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
        className="mt-1.5 w-full rounded-xl border-2 border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 dark:border-stone-700 dark:bg-stone-900 dark:text-white"
      />

      <button
        type="submit"
        disabled={pending}
        className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-full border-2 border-stone-900 bg-yellow-400 px-4 py-2.5 text-sm font-bold text-stone-900 shadow-[4px_4px_0_0_#1c1917] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:bg-yellow-300 hover:shadow-[6px_6px_0_0_#1c1917] disabled:pointer-events-none disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send Reset Link"}
      </button>
    </form>
  );
}
