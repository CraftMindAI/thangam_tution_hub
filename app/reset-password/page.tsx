"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../lib/supabase/client";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { Blobs } from "../components/PlayfulUI";
import { Award } from "../components/icons";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPassword() {
  const [status, setStatus] = useState<"loading" | "ready" | "invalid">(
    "loading"
  );
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      if (session) {
        setEmail(session.user.email ?? null);
        setStatus("ready");
      } else {
        setStatus("invalid");
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

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
              Reset Your Password
            </h1>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
              {status === "loading" && "Checking your reset link…"}
              {status === "ready" &&
                `Signed in as ${email}. Choose a new password.`}
              {status === "invalid" &&
                "This reset link is invalid or has expired."}
            </p>
          </div>

          {status === "ready" && <ResetPasswordForm />}
          {status === "invalid" && (
            <Link
              href="/signin"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-stone-700 to-stone-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.02]"
            >
              Go to Sign In
            </Link>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
