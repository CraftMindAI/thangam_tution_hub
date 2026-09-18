import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail, MapPin, Phone } from "./icons";

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/demo", label: "Book a Demo" },
  { href: "/signin", label: "Sign In" },
];

const exploreLinks = [
  { href: "/#classes", label: "Classes" },
  { href: "/#why-us", label: "Why Us" },
  { href: "/#fees", label: "Fee Structure" },
  { href: "/#timings", label: "Timings" },
];

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-zinc-950 text-zinc-400">
      <div className="pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-yellow-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-10 border-b border-zinc-800 pb-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex h-11 w-11 shrink-0 overflow-hidden rounded-2xl ring-2 ring-yellow-400/30">
              <Image
                src="/logo.jpeg"
                alt="Thangam Varahi Tuition Hub"
                fill
                sizes="44px"
                className="object-cover"
              />
            </span>
            <div>
              <div className="text-base font-extrabold tracking-tight text-white">
                Thangam Varahi Tuition Hub
              </div>
              <p className="text-sm text-zinc-400">
                Nursery to 10th Std &middot; West Mambalam, Chennai
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="tel:9789214998"
              className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition-transform hover:scale-[1.03]"
            >
              <Phone className="h-3.5 w-3.5" />
              97892 14998
            </a>
            <a
              href="tel:9790574321"
              className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition-transform hover:scale-[1.03]"
            >
              <Phone className="h-3.5 w-3.5" />
              97905 74321
            </a>
            <Link
              href="/demo"
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition-colors hover:border-yellow-400 hover:text-yellow-300"
            >
              Book a Demo
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm leading-6 text-zinc-400">
              Affordable, quality tuition for Nursery to 10th Std, run on
              individual attention and daily discipline — since 2021.
            </p>
            <a
              href="https://wa.me/919790574321"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-yellow-400 hover:underline"
            >
              Chat on WhatsApp
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 transition-colors hover:text-yellow-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 transition-colors hover:text-yellow-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Get in Touch
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-zinc-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400" />
                <span>
                  49, Andiyappan Street, West Mambalam, Chennai – 600033
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-yellow-400" />
                <span className="flex items-center gap-1.5">
                  <a href="tel:9789214998" className="hover:text-yellow-300">
                    97892 14998
                  </a>
                  <span>/</span>
                  <a href="tel:9790574321" className="hover:text-yellow-300">
                    97905 74321
                  </a>
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-yellow-400" />
                <a
                  href="mailto:thangamvarahituitionhub247365@gmail.com"
                  className="break-all hover:text-yellow-300"
                >
                  thangamvarahituitionhub247365@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-zinc-800 pt-6 text-xs text-zinc-500 sm:flex-row">
          <span>
            © {new Date().getFullYear()} Thangam Varahi Tuition Hub. All
            rights reserved.
          </span>
          <span className="flex items-center gap-4">
            <span>Udyam Reg. No. UDYAM-TN-02-0419567</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
