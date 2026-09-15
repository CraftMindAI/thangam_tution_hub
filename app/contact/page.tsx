import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { Blobs, Eyebrow } from "../components/PlayfulUI";
import { ArrowRight, Clock, Mail, MapPin, Phone } from "../components/icons";

export const metadata: Metadata = {
  title: "Contact Us | Thangam Varahi Tuition Hub",
  description:
    "Get in touch with Thangam Varahi Tuition Hub in West Mambalam, Chennai — call, email, or visit us to ask about admission.",
};

export default function Contact() {
  return (
    <div className="flex flex-col flex-1 bg-stone-950 text-white">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <Blobs variant="compact" />
          <div className="relative mx-auto max-w-3xl px-6 py-20 text-center sm:py-24">
            <Eyebrow>Contact</Eyebrow>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Visit or{" "}
              <span className="text-yellow-400">contact us</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-stone-400">
              We&apos;re happy to answer any questions about admission,
              timings, or fees — call, email, or drop by the centre any day
              during tuition hours.
            </p>
          </div>
        </section>

        {/* Contact details */}
        <section className="bg-stone-900 py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="grid overflow-hidden rounded-[2rem] shadow-2xl shadow-black/40 sm:grid-cols-2">
              <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 p-8 text-stone-900">
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
                  className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-stone-900/10 px-4 py-2 text-xs font-semibold text-stone-900 transition-colors hover:bg-stone-900/20"
                >
                  Chat with us on WhatsApp
                </a>
              </div>
              <div className="flex flex-col items-center justify-center gap-4 bg-stone-950 p-8 text-center">
                <h3 className="font-semibold text-white">
                  Ready to admit your child?
                </h3>
                <p className="max-w-xs text-sm text-stone-400">
                  Call us to ask about admission, or book a demo class online.
                </p>
                <a
                  href="tel:9789214998"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 px-8 py-3.5 text-sm font-semibold text-stone-900 shadow-lg shadow-yellow-500/20 transition-transform hover:scale-[1.03]"
                >
                  Call: 97892 14998
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  href="/demo"
                  className="inline-flex items-center rounded-full border border-stone-700 bg-stone-900 px-6 py-3 text-sm font-semibold text-stone-200 transition-colors hover:text-yellow-300"
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
