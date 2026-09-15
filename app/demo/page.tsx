"use client";

import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { Blobs, Eyebrow, iconBadge } from "../components/PlayfulUI";
import { CheckCircle, Clock, HeartHandshake, Users } from "../components/icons";
import { submitDemoRequest } from "../actions/demo";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-stone-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20";
const errorInputClass =
  "border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500/20";
const labelClass = "text-sm font-medium text-stone-300";

const trustPoints = [
  { icon: Users, text: "Individual attention at your child's own table" },
  { icon: Clock, text: "Free online doubt-clearing after tuition hours" },
  { icon: HeartHandshake, text: "Monthly report cards shared with parents" },
];

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <p className="mt-1 text-xs text-yellow-400">{messages[0]}</p>
  );
}

export default function Demo() {
  const [state, formAction, pending] = useActionState(submitDemoRequest, undefined);
  const errors = state && "errors" in state ? state.errors : undefined;
  const formError = state && "formError" in state ? state.formError : undefined;

  if (state && "success" in state) {
    return (
      <div className="flex flex-1 flex-col bg-stone-950 text-white">
        <SiteHeader />
        <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-16">
          <Blobs variant="compact" />
          <div className="relative w-full max-w-sm rounded-[2rem] border border-stone-800 bg-stone-900 p-8 text-center shadow-xl shadow-black/30">
            <span className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${iconBadge}`}>
              <CheckCircle className="h-6 w-6" />
            </span>
            <h1 className="mt-4 text-xl font-bold tracking-tight text-white">
              Thank you!
            </h1>
            <p className="mt-2 text-sm text-stone-400">
              We&apos;ve received your demo request and will reach out to you
              shortly.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 px-6 py-2.5 text-sm font-semibold text-stone-900 shadow-md transition-transform hover:scale-[1.02]"
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
    <div className="flex flex-1 flex-col bg-stone-950 text-white">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <Blobs variant="compact" />
          <div className="relative mx-auto max-w-2xl px-6 py-16 text-center sm:py-20">
            <Eyebrow>Free Demo</Eyebrow>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Book a{" "}
              <span className="text-yellow-400">Demo Class</span>
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-lg leading-8 text-stone-400">
              Tell us a bit about your child and we&apos;ll get in touch to
              schedule a free demo class — no cost, no obligation.
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="bg-stone-900 py-16">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-[3fr_2fr]">
            <div className="order-2 space-y-6 lg:order-1">
              <div className="relative aspect-[900/553] w-full overflow-hidden rounded-[2rem] border border-stone-800 shadow-xl shadow-black/40">
                <Image
                  src="/onlineclass.png"
                  alt="Live online class in session"
                  fill
                  sizes="(min-width: 1024px) 720px, 100vw"
                  className="object-cover"
                  priority
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {trustPoints.map((p) => (
                  <div
                    key={p.text}
                    className="flex flex-col items-start gap-2 rounded-2xl border border-stone-800 bg-stone-950 p-4 shadow-md shadow-black/20"
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-xl ${iconBadge}`}
                    >
                      <p.icon className="h-4 w-4" />
                    </span>
                    <p className="text-xs font-medium leading-5 text-stone-400">
                      {p.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <form
              action={formAction}
              className="order-1 rounded-[2rem] border border-stone-800 bg-stone-950 p-6 shadow-xl shadow-black/30 lg:order-2"
            >
            {formError && (
              <p className="mb-4 rounded-lg bg-yellow-500/10 px-3 py-2 text-sm text-yellow-300">
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
              className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 px-4 py-2.5 text-sm font-semibold text-stone-900 shadow-md transition-transform hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-60"
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
