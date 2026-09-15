"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import { Eyebrow } from "../../components/PlayfulUI";
import { Award } from "../../components/icons";
import SetPasswordForm from "./SetPasswordForm";

export default function SetPassword() {
  const [status, setStatus] = useState<"loading" | "ready" | "invalid">("loading");
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
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-yellow-300/25 blur-3xl dark:bg-yellow-500/10" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-yellow-200/25 blur-3xl dark:bg-yellow-600/10" />

        <div className="relative w-full max-w-sm">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-stone-900 bg-stone-900 text-white shadow-[4px_4px_0_0_#facc15]">
              <Award className="h-6 w-6" />
            </span>
            <div className="mt-4">
              <Eyebrow>Staff Portal</Eyebrow>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
              Set Your Password
            </h1>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
              {status === "loading" && "Checking your invite link…"}
              {status === "ready" &&
                `Welcome, ${email}. Choose a password for your admin account.`}
              {status === "invalid" && "This invite link is invalid or has expired."}
            </p>
          </div>

          {status === "ready" && <SetPasswordForm />}
          {status === "invalid" && (
            <Link
              href="/admin/login"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full border-2 border-stone-900 bg-stone-900 px-6 py-2.5 text-sm font-bold text-white shadow-[4px_4px_0_0_#facc15] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0_0_#facc15]"
            >
              Go to Admin Login
            </Link>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
