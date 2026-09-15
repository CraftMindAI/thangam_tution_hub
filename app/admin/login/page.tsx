"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import { Blobs } from "../../components/PlayfulUI";
import { Eye, EyeOff, Award } from "../../components/icons";
import { adminSignIn } from "../../actions/admin";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, pending] = useActionState(adminSignIn, undefined);

  return (
    <div className="flex flex-1 flex-col bg-white text-stone-900 dark:bg-stone-900 dark:text-stone-100">
      <SiteHeader />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-16">
        <Blobs variant="compact" />

        <div className="relative w-full max-w-sm">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-stone-700 to-stone-900 text-white shadow-md">
              <Award className="h-6 w-6" />
            </span>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
              Admin Login
            </h1>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
              Restricted access for Thangam Varahi Tuition Hub staff.
            </p>
          </div>

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
              placeholder="admin@example.com"
              className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-500/20 dark:border-stone-700 dark:bg-stone-900 dark:text-white"
            />

            <label
              htmlFor="password"
              className="mt-4 block text-sm font-medium text-stone-700 dark:text-stone-200"
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
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 pr-11 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-500/20 dark:border-stone-700 dark:bg-stone-900 dark:text-white"
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

            <button
              type="submit"
              disabled={pending}
              className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-stone-700 to-stone-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-60"
            >
              {pending ? "Signing in…" : "Sign In as Admin"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-600 dark:text-stone-400">
            Not staff?{" "}
            <Link
              href="/signin"
              className="font-semibold text-yellow-700 hover:underline dark:text-yellow-400"
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
