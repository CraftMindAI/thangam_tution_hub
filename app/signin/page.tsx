"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { Eye, EyeOff, GraduationCap } from "../components/icons";
import { signIn } from "../actions/auth";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, pending] = useActionState(signIn, undefined);

  return (
    <div className="flex flex-1 flex-col bg-white text-stone-900 dark:bg-stone-900 dark:text-stone-100">
      <SiteHeader />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-16">
        <div className="relative grid w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-xl md:grid-cols-2 dark:bg-stone-800">
          <div className="relative hidden flex-col items-center justify-center bg-gradient-to-br from-yellow-300 to-yellow-500 p-8 md:flex">
            <div className="relative aspect-square w-full max-w-[360px] overflow-hidden rounded-2xl">
              <Image
                src="/signin_illustration_yellow.png"
                alt="Illustration of a student securely signing in"
                fill
                priority
                className="object-cover scale-125"
              />
            </div>
            <p className="mt-6 text-center text-sm font-semibold text-stone-900/80">
              Welcome back to Thangam Varahi Tuition Hub.
            </p>
          </div>

          <div className="p-6 sm:p-10">
            <div className="flex flex-col items-center text-center md:hidden">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-yellow-500 text-stone-900 shadow-md">
                <GraduationCap className="h-6 w-6" />
              </span>
            </div>
            <h1 className="mt-4 text-center text-2xl font-bold tracking-tight text-stone-900 md:mt-0 md:text-left dark:text-white">
              Sign In
            </h1>
            <p className="mt-2 text-center text-sm text-stone-600 md:text-left dark:text-stone-400">
              Welcome back to Thangam Varahi Tuition Hub.
            </p>

            <form action={formAction} className="mt-6 max-w-sm">
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
                className="mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 dark:border-stone-600 dark:bg-stone-950 dark:text-white"
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
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 pr-11 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 dark:border-stone-600 dark:bg-stone-950 dark:text-white"
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
                  className="text-xs font-medium text-yellow-700 hover:underline dark:text-yellow-400"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={pending}
                className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 px-4 py-2.5 text-sm font-semibold text-stone-900 shadow-md transition-transform hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-60"
              >
                {pending ? "Signing in…" : "Sign In"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-stone-600 md:text-left dark:text-stone-400">
              New here?{" "}
              <Link
                href="/signup"
                className="font-semibold text-yellow-700 hover:underline dark:text-yellow-400"
              >
                Create an account
              </Link>
            </p>
            <p className="mt-2 text-center text-sm text-stone-600 md:text-left dark:text-stone-400">
              Need help accessing your account?{" "}
              <a
                href="tel:9789214998"
                className="font-semibold text-yellow-700 hover:underline dark:text-yellow-400"
              >
                Call us
              </a>
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
