import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { ArrowRight, Clock, Mail, MapPin, Phone } from "../components/icons";

export const metadata: Metadata = {
  title: "Contact Us | Thangam Varahi Tuition Hub",
  description:
    "Get in touch with Thangam Varahi Tuition Hub in West Mambalam, Chennai — call, email, or visit us to ask about admission.",
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
      {children}
    </span>
  );
}

export default function Contact() {
  return (
    <div className="flex flex-col flex-1 bg-stone-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-white dark:bg-slate-800">
          <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-teal-300/25 blur-3xl dark:bg-teal-500/10" />
          <div className="pointer-events-none absolute top-0 -right-24 h-96 w-96 rounded-full bg-emerald-300/25 blur-3xl dark:bg-emerald-500/10" />
          <div className="relative mx-auto max-w-3xl px-6 py-20 text-center sm:py-24">
            <Eyebrow>Contact</Eyebrow>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
              Visit or{" "}
              <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                contact us
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              We&apos;re happy to answer any questions about admission,
              timings, or fees — call, email, or drop by the centre any day
              during tuition hours.
            </p>
          </div>
        </section>

        {/* Contact details */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="grid overflow-hidden rounded-3xl border border-stone-200 shadow-sm sm:grid-cols-2 dark:border-slate-700">
              <div className="bg-gradient-to-br from-teal-600 to-emerald-600 p-8 text-white">
                <h3 className="font-semibold">Find Us</h3>
                <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-teal-50">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    49, Andiyappan Street, Near Supreme Mobiles Shop, West
                    Mambalam, T-Nagar, Chennai – 600033, Tamil Nadu
                  </span>
                </p>
                <p className="mt-4 flex items-center gap-2 text-sm text-teal-50">
                  <Phone className="h-4 w-4 shrink-0" />
                  <a href="tel:9789214998" className="font-semibold text-white">
                    97892 14998
                  </a>
                  <span>/</span>
                  <a href="tel:9790574321" className="font-semibold text-white">
                    97905 74321
                  </a>
                </p>
                <p className="mt-3 flex items-center gap-2 text-sm text-teal-50">
                  <Mail className="h-4 w-4 shrink-0" />
                  <a
                    href="mailto:thangamvarahituitionhub247365@gmail.com"
                    className="break-all font-semibold text-white"
                  >
                    thangamvarahituitionhub247365@gmail.com
                  </a>
                </p>
                <p className="mt-4 flex items-center gap-2 text-sm text-teal-50">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>Mon – Sat, 4:00 – 8:30 PM</span>
                </p>
              </div>
              <div className="flex flex-col items-center justify-center gap-4 bg-white p-8 text-center dark:bg-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Ready to admit your child?
                </h3>
                <p className="max-w-xs text-sm text-slate-600 dark:text-slate-400">
                  Call us to ask about admission, or book a demo class online.
                </p>
                <a
                  href="tel:9789214998"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-900/20 transition-transform hover:scale-[1.03]"
                >
                  Call: 97892 14998
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  href="/demo"
                  className="inline-flex items-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-teal-600 hover:text-teal-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-teal-500 dark:hover:text-teal-300"
                >
                  Book a Demo Class
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
