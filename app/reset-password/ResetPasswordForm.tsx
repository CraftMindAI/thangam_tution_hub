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
      className="mt-8 rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800"
    >
      {state?.error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {state.error}
        </p>
      )}

      <label
        htmlFor="password"
        className="text-sm font-medium text-slate-700 dark:text-slate-200"
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
          className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2.5 pr-11 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
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
        className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-200"
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
        className="mt-1.5 w-full rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      />

      <button
        type="submit"
        disabled={pending}
        className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-slate-700 to-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
      >
        {pending ? "Saving…" : "Update Password"}
      </button>
    </form>
  );
}
