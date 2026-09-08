"use client";

import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { CheckCircle } from "../components/icons";
import { submitDemoRequest } from "../actions/demo";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white";
const errorInputClass =
  "border-red-400 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500/70";
const labelClass = "text-sm font-medium text-slate-700 dark:text-slate-200";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{messages[0]}</p>
  );
}

export default function Demo() {
  const [state, formAction, pending] = useActionState(submitDemoRequest, undefined);
  const errors = state && "errors" in state ? state.errors : undefined;
  const formError = state && "formError" in state ? state.formError : undefined;

  if (state && "success" in state) {
    return (
      <div className="flex flex-1 flex-col bg-stone-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
        <SiteHeader />
        <main className="flex flex-1 items-center justify-center px-6 py-16">
          <div className="w-full max-w-sm rounded-2xl border border-stone-200/70 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-800">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
              <CheckCircle className="h-6 w-6" />
            </span>
            <h1 className="mt-4 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Thank you!
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              We&apos;ve received your demo request and will reach out to you
              shortly.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-900/15 transition-transform hover:scale-[1.02]"
            >
              Back to Home
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-stone-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <SiteHeader />

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[3fr_2fr]">
          <div className="order-2 lg:order-1">
            <div className="relative aspect-[900/553] w-full overflow-hidden rounded-2xl border border-stone-200/70 shadow-sm dark:border-slate-800">
              <Image
                src="/onlineclass.png"
                alt="Live online class in session"
                fill
                sizes="(min-width: 1024px) 720px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Book a Demo Class
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Tell us a bit about your child and we&apos;ll get in touch to
                schedule a free demo class.
              </p>
            </div>

            <form
              action={formAction}
              className="mt-8 rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800"
            >
            {formError && (
              <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
                {formError}
              </p>
            )}

            <label htmlFor="name" className={labelClass}>
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Your name"
              className={`${inputClass} ${errors?.name?.length ? errorInputClass : ""}`}
            />
            <FieldError messages={errors?.name} />

            <label htmlFor="email" className={`mt-4 block ${labelClass}`}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className={`${inputClass} ${errors?.email?.length ? errorInputClass : ""}`}
            />
            <FieldError messages={errors?.email} />

            <label htmlFor="phone" className={`mt-4 block ${labelClass}`}>
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              pattern="[6-9][0-9]{9}"
              maxLength={10}
              placeholder="10-digit mobile number"
              className={`${inputClass} ${errors?.phone?.length ? errorInputClass : ""}`}
            />
            <FieldError messages={errors?.phone} />

            <label htmlFor="description" className={`mt-4 block ${labelClass}`}>
              Tell us more
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              placeholder="Which class / subject are you interested in? Preferred timing?"
              className={`${inputClass} resize-none ${errors?.description?.length ? errorInputClass : ""}`}
            />
            <FieldError messages={errors?.description} />

            <button
              type="submit"
              disabled={pending}
              className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-900/15 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {pending ? "Submitting…" : "Request Demo Class"}
            </button>
            </form>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
