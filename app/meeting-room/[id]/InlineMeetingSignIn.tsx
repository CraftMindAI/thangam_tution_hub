"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInForMeeting } from "@/app/actions/auth";
import { Eye, EyeOff, GraduationCap } from "@/app/components/icons";

export default function InlineMeetingSignIn() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, pending] = useActionState(signInForMeeting, undefined);

  useEffect(() => {
    if (state && "success" in state) router.refresh();
  }, [state, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-stone-950 px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-yellow-500 text-stone-900 shadow-md">
            <GraduationCap className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-xl font-bold tracking-tight text-white">
            Sign in to join this meeting
          </h1>
          <p className="mt-2 text-sm text-stone-400">
            Enter your account details to continue straight into the call.
          </p>
        </div>

        <form action={formAction} className="mt-8 rounded-3xl bg-stone-900 p-6 shadow-lg">
          {state && "error" in state && (
            <p className="mb-4 rounded-lg bg-yellow-500/10 px-3 py-2 text-sm text-yellow-300">
              {state.error}
            </p>
          )}

          <label className="block text-sm font-medium text-stone-300">
            Email
            <input
              name="email"
              type="email"
              required
              className="mt-1.5 w-full rounded-lg border border-stone-700 bg-stone-950 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-stone-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
              placeholder="you@example.com"
            />
          </label>

          <label className="mt-4 block text-sm font-medium text-stone-300">
            Password
            <div className="relative mt-1.5">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full rounded-lg border border-stone-700 bg-stone-950 px-3.5 py-2.5 pr-10 text-sm text-white outline-none placeholder:text-stone-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={pending}
            className="mt-6 w-full rounded-full bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-stone-900 shadow-md shadow-yellow-500/20 transition-transform hover:scale-[1.02] hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            {pending ? "Signing in…" : "Sign In & Join"}
          </button>
        </form>
      </div>
    </div>
  );
}
