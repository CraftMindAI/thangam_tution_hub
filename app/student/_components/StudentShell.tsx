"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "../../components/icons";
import { signOut } from "../../actions/auth";
import { studentNav, isActive } from "../_lib/nav";

export default function StudentShell({
  children,
  studentName,
  studentEmail,
}: {
  children: React.ReactNode;
  studentName: string;
  studentEmail: string;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const current = studentNav.find((item) => isActive(pathname, item));
  const pageTitle = current?.label ?? "Student Portal";

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {studentNav.map((item) => {
        const active = isActive(pathname, item);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-sm shadow-slate-900/20"
                : "text-slate-600 hover:bg-stone-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            }`}
          >
            <item.icon className="h-4.5 w-4.5 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex flex-1 bg-stone-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-stone-200/70 bg-white py-5 lg:flex dark:border-slate-800 dark:bg-slate-800">
        <Link href="/" className="flex items-center gap-2.5 px-6 pb-5">
          <span className="relative flex h-9 w-9 shrink-0 overflow-hidden rounded-xl shadow-md shadow-slate-900/20">
            <Image
              src="/logo.jpeg"
              alt="Thangam Varahi Tuition Hub"
              fill
              sizes="36px"
              className="object-cover"
            />
          </span>
          <span className="text-sm font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white">
            Thangam Varahi
            <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Student Portal
            </span>
          </span>
        </Link>
        {nav}
        <div className="mt-auto border-t border-stone-200/70 px-3 pt-4 dark:border-slate-700">
          <div className="px-3 pb-2">
            <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
              {studentName}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {studentEmail}
            </p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-stone-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col border-r border-stone-200/70 bg-white py-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between px-6 pb-5">
              <span className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
                Student Portal
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="text-slate-500 hover:text-slate-800 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {nav}
            <div className="mt-auto border-t border-stone-200/70 px-3 pt-4 dark:border-slate-700">
              <form action={signOut}>
                <button
                  type="submit"
                  className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-stone-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-stone-200/70 bg-white/90 px-4 py-3 backdrop-blur sm:px-6 dark:border-slate-800 dark:bg-slate-800/90">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-lg p-1.5 text-slate-600 hover:bg-stone-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
            {pageTitle}
          </h1>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
