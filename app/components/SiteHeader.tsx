"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Menu, Phone, User, X } from "./icons";

const nav = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/demo", label: "Demo" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-zinc-950">
      <div className="hidden bg-yellow-400 text-zinc-900 md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-1.5 text-xs font-semibold">
          <div className="flex items-center gap-5">
            <a
              href="tel:9789214998"
              className="flex items-center gap-1.5 hover:text-white"
            >
              <Phone className="h-3.5 w-3.5" />
              97892 14998
            </a>
            <a
              href="tel:9790574321"
              className="flex items-center gap-1.5 hover:text-white"
            >
              <Phone className="h-3.5 w-3.5" />
              97905 74321
            </a>
            <a
              href="mailto:thangamvarahituitionhub247365@gmail.com"
              className="flex items-center gap-1.5 hover:text-white"
            >
              <Mail className="h-3.5 w-3.5" />
              thangamvarahituitionhub247365@gmail.com
            </a>
          </div>
          <span>West Mambalam, T-Nagar, Chennai — Since 2021</span>
        </div>
      </div>

      <div className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="relative flex h-9 w-9 shrink-0 overflow-hidden rounded-xl shadow-md shadow-black/40 ring-1 ring-yellow-400/30">
              <Image
                src="/logo.jpeg"
                alt="Thangam Varahi Tuition Hub"
                fill
                sizes="36px"
                className="object-cover"
                priority
              />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-extrabold tracking-tight text-white sm:text-base">
                Thangam Varahi
              </span>
              <span className="text-[11px] font-medium text-yellow-400">
                Tuition Hub
              </span>
            </span>
          </Link>

          <nav className="hidden gap-1 text-sm font-medium md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3.5 py-2 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-yellow-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/signin"
              className="hidden shrink-0 items-center gap-1.5 rounded-full border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 transition-colors hover:border-yellow-400 hover:text-yellow-300 sm:flex"
            >
              <User className="h-3.5 w-3.5" />
              Sign In
            </Link>
            <Link
              href="/signup"
              className="hidden shrink-0 items-center gap-1.5 rounded-full bg-yellow-400 px-4 py-2 text-sm font-semibold text-zinc-900 shadow-md shadow-black/20 transition-colors hover:bg-yellow-300 sm:flex"
            >
              Sign Up
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-yellow-400 text-zinc-900 shadow-md shadow-black/30 ring-1 ring-white/40 transition-transform hover:scale-105 md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-zinc-800 bg-zinc-950 px-6 py-3 text-sm font-medium md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-zinc-300 hover:bg-zinc-800 hover:text-yellow-300"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/signin"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center justify-center gap-1.5 rounded-full border border-zinc-700 px-4 py-2.5 font-semibold text-zinc-200"
          >
            <User className="h-3.5 w-3.5" />
            Sign In
          </Link>
          <Link
            href="/signup"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1.5 rounded-full bg-yellow-400 px-4 py-2.5 font-semibold text-zinc-900"
          >
            Sign Up
          </Link>
        </nav>
      )}
    </header>
  );
}
