"use client";

import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { Eyebrow, Wave, tilts } from "../components/PlayfulUI";
import { CheckCircle, Clock, HeartHandshake, Sparkles, Users } from "../components/icons";
import { submitDemoRequest } from "../actions/demo";

const trustPoints = [
  { icon: Users, text: "Individual attention at your child's own table" },
  { icon: Clock, text: "Free online doubt-clearing after tuition hours" },
  { icon: HeartHandshake, text: "Monthly report cards shared with parents" },
];

const inputClass =
  "mt-1.5 w-full rounded-xl border-2 border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 dark:border-stone-700 dark:bg-stone-900 dark:text-white";
const errorInputClass =
  "border-yellow-400 focus:border-yellow-500 focus:ring-yellow-500/20 dark:border-yellow-500/70";
const labelClass = "text-sm font-bold text-stone-700 dark:text-stone-200";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-400">{messages[0]}</p>
  );
}

export default function Demo() {
  const [state, formAction, pending] = useActionState(submitDemoRequest, undefined);
  const errors = state && "errors" in state ? state.errors : undefined;
  const formError = state && "formError" in state ? state.formError : undefined;

  if (state && "success" in state) {
    return (
      <div className="flex flex-1 flex-col bg-white text-stone-900 dark:bg-stone-900 dark:text-stone-100">
        <SiteHeader />
        <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-16">
          <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-yellow-300/25 blur-3xl dark:bg-yellow-500/10" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-yellow-200/25 blur-3xl dark:bg-yellow-600/10" />
          <div className="relative w-full max-w-sm rounded-3xl border-2 border-stone-900 bg-white p-8 text-center shadow-[5px_5px_0_0_#1c1917] dark:border-stone-600 dark:bg-stone-800">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-stone-900 bg-yellow-400 text-stone-900 dark:border-stone-600">
              <CheckCircle className="h-6 w-6" />
            </span>
            <h1 className="mt-4 text-xl font-bold tracking-tight text-stone-900 dark:text-white">
              Thank you!
            </h1>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
              We&apos;ve received your demo request and will reach out to you
              shortly.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center rounded-full border-2 border-stone-900 bg-yellow-400 px-6 py-2.5 text-sm font-bold text-stone-900 shadow-[4px_4px_0_0_#1c1917] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:bg-yellow-300 hover:shadow-[6px_6px_0_0_#1c1917]"
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
    <div className="flex flex-1 flex-col bg-white text-stone-900 dark:bg-stone-900 dark:text-stone-100">
      <SiteHeader />

      <main className="flex-1 overflow-x-hidden">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-yellow-300/25 blur-3xl dark:bg-yellow-500/10" />
          <div className="pointer-events-none absolute top-0 -right-24 h-96 w-96 rounded-full bg-yellow-200/25 blur-3xl dark:bg-yellow-600/10" />
          <Sparkles className="pointer-events-none absolute top-16 right-[15%] hidden h-8 w-8 rotate-12 text-yellow-400/70 sm:block" />
          <Sparkles className="pointer-events-none absolute bottom-10 left-[10%] hidden h-6 w-6 -rotate-12 text-yellow-400/70 sm:block" />
          <div className="relative mx-auto max-w-2xl px-6 py-16 text-center sm:py-20">
            <Eyebrow>Free Demo</Eyebrow>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl dark:text-white">
              Book a <span className="text-yellow-600">Demo Class</span>
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-lg leading-8 text-stone-600 dark:text-stone-300">
              Tell us a bit about your child and we&apos;ll get in touch to
              schedule a free demo class — no cost, no obligation.
            </p>
          </div>
          <Wave className="relative -mb-1 text-yellow-50 dark:text-stone-800" />
        </section>

        {/* Form */}
        <section className="bg-yellow-50 py-16 dark:bg-stone-800">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-[3fr_2fr]">
            <div className="order-2 space-y-6 lg:order-1">
              <div className="relative -rotate-2 aspect-[900/553] w-full overflow-hidden rounded-3xl border-4 border-white bg-white shadow-[6px_6px_0_0_#1c1917] transition-transform hover:rotate-0 dark:border-stone-900">
                <Image
                  src="/onlineclass.png"
                  alt="Live online class in session"
                  fill
                  sizes="(min-width: 1024px) 720px, 100vw"
                  className="object-cover"
                  priority
                />
                <span className="absolute -top-3 -left-3 flex h-10 w-10 rotate-12 items-center justify-center rounded-full border-2 border-stone-900 bg-yellow-400 text-stone-900">
                  <Sparkles className="h-4 w-4" />
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {trustPoints.map((p, i) => (
                  <div
                    key={p.text}
                    className={`${tilts[i % tilts.length]} flex flex-col items-start gap-2 rounded-2xl border-2 border-stone-900 bg-white p-4 shadow-[3px_3px_0_0_#1c1917] transition-all hover:rotate-0 hover:-translate-y-1 dark:border-stone-600 dark:bg-stone-900`}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-stone-900 bg-yellow-400 text-stone-900 dark:border-stone-600">
                      <p.icon className="h-4 w-4" />
                    </span>
                    <p className="text-xs font-medium leading-5 text-stone-600 dark:text-stone-400">
                      {p.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <form
              action={formAction}
              className="order-1 rounded-3xl border-2 border-stone-900 bg-white p-6 shadow-[5px_5px_0_0_#1c1917] lg:order-2 dark:border-stone-600 dark:bg-stone-900"
            >
            {formError && (
              <p className="mb-4 rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
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
              className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-full border-2 border-stone-900 bg-yellow-400 px-4 py-2.5 text-sm font-bold text-stone-900 shadow-[4px_4px_0_0_#1c1917] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:bg-yellow-300 hover:shadow-[6px_6px_0_0_#1c1917] disabled:pointer-events-none disabled:opacity-60"
            >
              {pending ? "Submitting…" : "Request Demo Class"}
            </button>
            </form>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
