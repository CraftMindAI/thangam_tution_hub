import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { Eyebrow, Wave } from "../components/PlayfulUI";
import { ArrowRight, Clock, Mail, MapPin, Phone, Sparkles } from "../components/icons";

export const metadata: Metadata = {
  title: "Contact Us | Thangam Varahi Tuition Hub",
  description:
    "Get in touch with Thangam Varahi Tuition Hub in West Mambalam, Chennai — call, email, or visit us to ask about admission.",
};

export default function Contact() {
  return (
    <div className="flex flex-col flex-1 bg-white text-stone-900 dark:bg-stone-900 dark:text-stone-100">
      <SiteHeader />

      <main className="flex-1 overflow-x-hidden">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-yellow-300/25 blur-3xl dark:bg-yellow-500/10" />
          <div className="pointer-events-none absolute top-0 -right-24 h-96 w-96 rounded-full bg-yellow-200/25 blur-3xl dark:bg-yellow-600/10" />
          <Sparkles className="pointer-events-none absolute top-16 right-[15%] hidden h-8 w-8 rotate-12 text-yellow-400/70 sm:block" />
          <Sparkles className="pointer-events-none absolute bottom-10 left-[10%] hidden h-6 w-6 -rotate-12 text-yellow-400/70 sm:block" />
          <div className="relative mx-auto max-w-3xl px-6 py-20 text-center sm:py-24">
            <Eyebrow>Contact</Eyebrow>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl dark:text-white">
              Visit or{" "}
              <span className="text-yellow-600">contact us</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-stone-600 dark:text-stone-300">
              We&apos;re happy to answer any questions about admission,
              timings, or fees — call, email, or drop by the centre any day
              during tuition hours.
            </p>
          </div>
          <Wave className="relative -mb-1 text-yellow-50 dark:text-stone-800" />
        </section>

        {/* Contact details */}
        <section className="bg-yellow-50 py-20 dark:bg-stone-800">
          <div className="mx-auto max-w-4xl px-6">
            <div className="grid overflow-hidden rounded-[2rem] border-4 border-stone-900 shadow-[6px_6px_0_0_#1c1917] sm:grid-cols-2 dark:border-stone-600">
              <div className="bg-yellow-400 p-8 text-stone-900">
                <h3 className="font-semibold">Find Us</h3>
                <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-stone-800">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    49, Andiyappan Street, Near Supreme Mobiles Shop, West
                    Mambalam, T-Nagar, Chennai – 600033, Tamil Nadu
                  </span>
                </p>
                <p className="mt-4 flex items-center gap-2 text-sm text-stone-800">
                  <Phone className="h-4 w-4 shrink-0" />
                  <a href="tel:9789214998" className="font-semibold text-stone-900">
                    97892 14998
                  </a>
                  <span>/</span>
                  <a href="tel:9790574321" className="font-semibold text-stone-900">
                    97905 74321
                  </a>
                </p>
                <p className="mt-3 flex items-center gap-2 text-sm text-stone-800">
                  <Mail className="h-4 w-4 shrink-0" />
                  <a
                    href="mailto:thangamvarahituitionhub247365@gmail.com"
                    className="break-all font-semibold text-stone-900"
                  >
                    thangamvarahituitionhub247365@gmail.com
                  </a>
                </p>
                <p className="mt-4 flex items-center gap-2 text-sm text-stone-800">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>Mon – Sat, 4:00 – 8:30 PM</span>
                </p>
                <a
                  href="https://wa.me/919789214998"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 rounded-full border-2 border-stone-900 bg-white px-4 py-2 text-xs font-bold text-stone-900 transition-colors hover:bg-stone-900/10"
                >
                  Chat with us on WhatsApp
                </a>
              </div>
              <div className="flex flex-col items-center justify-center gap-4 bg-white p-8 text-center dark:bg-stone-800">
                <h3 className="font-semibold text-stone-900 dark:text-white">
                  Ready to admit your child?
                </h3>
                <p className="max-w-xs text-sm text-stone-600 dark:text-stone-400">
                  Call us to ask about admission, or book a demo class online.
                </p>
                <a
                  href="tel:9789214998"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-stone-900 bg-yellow-400 px-8 py-3.5 text-sm font-bold text-stone-900 shadow-[4px_4px_0_0_#1c1917] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:bg-yellow-300 hover:shadow-[6px_6px_0_0_#1c1917]"
                >
                  Call: 97892 14998
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  href="/demo"
                  className="inline-flex items-center rounded-full border-2 border-stone-900 px-6 py-3 text-sm font-bold text-stone-700 transition-colors hover:text-yellow-700 dark:border-stone-600 dark:text-stone-200 dark:hover:text-yellow-300"
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
