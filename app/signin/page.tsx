"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { Eyebrow } from "../components/PlayfulUI";
import { Eye, EyeOff, GraduationCap } from "../components/icons";
import { signIn } from "../actions/auth";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, pending] = useActionState(signIn, undefined);

  return (
    <div className="flex flex-1 flex-col bg-white text-stone-900 dark:bg-stone-900 dark:text-stone-100">
      <SiteHeader />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-16">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-yellow-300/25 blur-3xl dark:bg-yellow-500/10" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-yellow-200/25 blur-3xl dark:bg-yellow-600/10" />

        <div className="relative w-full max-w-sm">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-stone-900 bg-yellow-400 text-stone-900 dark:border-stone-600">
              <GraduationCap className="h-6 w-6" />
            </span>
            <div className="mt-4">
              <Eyebrow>Student Portal</Eyebrow>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
              Sign In
            </h1>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
              Welcome back to Thangam Varahi Tuition Hub.
            </p>
          </div>

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

            <label
              htmlFor="password"
              className="mt-4 block text-sm font-bold text-stone-700 dark:text-stone-200"
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
                className="w-full rounded-xl border-2 border-stone-300 bg-stone-50 px-3.5 py-2.5 pr-11 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 dark:border-stone-700 dark:bg-stone-900 dark:text-white"
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

            <div className="mt-3 text-right">
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-yellow-700 hover:underline dark:text-yellow-400"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-full border-2 border-stone-900 bg-yellow-400 px-4 py-2.5 text-sm font-bold text-stone-900 shadow-[4px_4px_0_0_#1c1917] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:bg-yellow-300 hover:shadow-[6px_6px_0_0_#1c1917] disabled:pointer-events-none disabled:opacity-60"
            >
              {pending ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-600 dark:text-stone-400">
            New here?{" "}
            <Link
              href="/signup"
              className="font-semibold text-yellow-700 hover:underline dark:text-yellow-400"
            >
              Create an account
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-stone-600 dark:text-stone-400">
            Need help accessing your account?{" "}
            <a
              href="tel:9789214998"
              className="font-semibold text-yellow-700 hover:underline dark:text-yellow-400"
            >
              Call us
            </a>
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
