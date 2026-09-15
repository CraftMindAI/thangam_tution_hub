"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff } from "../components/icons";
import { resetPassword } from "../actions/auth";

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, pending] = useActionState(resetPassword, undefined);

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
        htmlFor="password"
        className="text-sm font-bold text-stone-700 dark:text-stone-200"
      >
        New Password
      </label>
      <div className="relative mt-1.5">
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          required
          minLength={8}
          placeholder="••••••••"
          className="w-full rounded-xl border-2 border-stone-300 bg-stone-50 px-3.5 py-2.5 pr-11 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-500/20 dark:border-stone-700 dark:bg-stone-900 dark:text-white"
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
        >
          {showPassword ? (
            <EyeOff className="h-4.5 w-4.5" />
          ) : (
            <Eye className="h-4.5 w-4.5" />
          )}
        </button>
      </div>

      <label
        htmlFor="confirmPassword"
        className="mt-4 block text-sm font-bold text-stone-700 dark:text-stone-200"
      >
        Confirm Password
      </label>
      <input
        id="confirmPassword"
        name="confirmPassword"
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        required
        minLength={8}
        placeholder="••••••••"
        className="mt-1.5 w-full rounded-xl border-2 border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-500/20 dark:border-stone-700 dark:bg-stone-900 dark:text-white"
      />

      <button
        type="submit"
        disabled={pending}
        className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-full border-2 border-stone-900 bg-stone-900 px-4 py-2.5 text-sm font-bold text-white shadow-[4px_4px_0_0_#facc15] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0_0_#facc15] disabled:pointer-events-none disabled:opacity-60"
      >
        {pending ? "Saving…" : "Update Password"}
      </button>
    </form>
  );
}
