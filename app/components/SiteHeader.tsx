"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, Menu, Phone, User, X } from "./icons";

const nav = [
  { href: "/about", label: "About" },
  { href: "/#classes", label: "Classes" },
  { href: "/#why-us", label: "Why Us" },
  { href: "/#fees", label: "Fees" },
  { href: "/#timings", label: "Timings" },
  { href: "/#contact", label: "Contact" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/70 bg-stone-50/80 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-900/10">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-extrabold tracking-tight text-slate-900 sm:text-base dark:text-white">
              Thangam Varahi
            </span>
            <span className="text-[11px] font-medium text-teal-700 dark:text-teal-400">
              Tuition Hub
            </span>
          </span>
        </Link>

        <nav className="hidden gap-1 text-sm font-medium md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-slate-600 transition-colors hover:bg-teal-50 hover:text-teal-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-teal-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/signin"
            className="hidden shrink-0 items-center gap-1.5 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-teal-600 hover:text-teal-700 sm:flex dark:border-slate-700 dark:text-slate-200 dark:hover:border-teal-500 dark:hover:text-teal-300"
          >
            <User className="h-3.5 w-3.5" />
            Sign In
          </Link>
          <a
            href="tel:9789214998"
            className="hidden shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-teal-900/15 transition-transform hover:scale-[1.03] sm:flex"
          >
            <Phone className="h-3.5 w-3.5" />
            Call Now
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 hover:bg-stone-200/70 md:hidden dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-stone-200/70 bg-stone-50 px-6 py-3 text-sm font-medium md:hidden dark:border-slate-800 dark:bg-slate-900">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-slate-700 hover:bg-teal-50 hover:text-teal-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-teal-300"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/signin"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center justify-center gap-1.5 rounded-full border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            <User className="h-3.5 w-3.5" />
            Sign In
          </Link>
          <a
            href="tel:9789214998"
            className="flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2.5 font-semibold text-white"
          >
            <Phone className="h-3.5 w-3.5" />
            Call Now
          </a>
        </nav>
      )}
    </header>
  );
}
