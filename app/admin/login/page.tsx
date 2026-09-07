"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import { Eye, EyeOff, Award } from "../../components/icons";
import { adminSignIn } from "../../actions/admin";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, pending] = useActionState(adminSignIn, undefined);

  return (
    <div className="flex flex-1 flex-col bg-stone-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <SiteHeader />

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-md shadow-slate-900/20">
              <Award className="h-6 w-6" />
            </span>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Admin Login
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Restricted access for Thangam Varahi Tuition Hub staff.
            </p>
          </div>

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
              htmlFor="email"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="admin@example.com"
              className="mt-1.5 w-full rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />

            <label
              htmlFor="password"
              className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Password
            </label>
            <div className="relative mt-1.5">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
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

            <button
              type="submit"
              disabled={pending}
              className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-slate-700 to-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {pending ? "Signing in…" : "Sign In as Admin"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Not staff?{" "}
            <Link
              href="/signin"
              className="font-semibold text-teal-700 hover:underline dark:text-teal-400"
            >
              Go to Student Sign In
            </Link>
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
