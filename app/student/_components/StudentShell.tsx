"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "../../components/icons";
import { signOut } from "../../actions/auth";
import { buildStudentNav, isActive } from "../_lib/nav";

export default function StudentShell({
  children,
  studentName,
  studentEmail,
  dashboardHref,
}: {
  children: React.ReactNode;
  studentName: string;
  studentEmail: string;
  dashboardHref: string;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const studentNav = buildStudentNav(dashboardHref);
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
                ? "bg-gradient-to-r from-stone-700 to-stone-900 text-white shadow-sm shadow-stone-900/20"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white"
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
    <div className="flex flex-1 bg-stone-50 text-stone-900 dark:bg-stone-900 dark:text-stone-100">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-stone-200/70 bg-white py-5 lg:flex dark:border-stone-800 dark:bg-stone-800">
        <Link href="/" className="flex items-center gap-2.5 px-6 pb-5">
          <span className="relative flex h-9 w-9 shrink-0 overflow-hidden rounded-xl shadow-md shadow-stone-900/20">
            <Image
              src="/logo.jpeg"
              alt="Thangam Varahi Tuition Hub"
              fill
              sizes="36px"
              className="object-cover"
            />
          </span>
          <span className="text-sm font-extrabold leading-tight tracking-tight text-stone-900 dark:text-white">
            Thangam Varahi
            <span className="block text-xs font-semibold text-stone-500 dark:text-stone-400">
              Student Portal
            </span>
          </span>
        </Link>
        {nav}
        <div className="mt-auto border-t border-stone-200/70 px-3 pt-4 dark:border-stone-700">
          <div className="px-3 pb-2">
            <p className="truncate text-sm font-semibold text-stone-800 dark:text-stone-200">
              {studentName}
            </p>
            <p className="truncate text-xs text-stone-500 dark:text-stone-400">
              {studentEmail}
            </p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white"
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
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col border-r border-stone-200/70 bg-white py-5 dark:border-stone-800 dark:bg-stone-900">
            <div className="flex items-center justify-between px-6 pb-5">
              <span className="text-sm font-extrabold tracking-tight text-stone-900 dark:text-white">
                Student Portal
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="text-stone-500 hover:text-stone-800 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {nav}
            <div className="mt-auto border-t border-stone-200/70 px-3 pt-4 dark:border-stone-700">
              <form action={signOut}>
                <button
                  type="submit"
                  className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white"
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
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-stone-200/70 bg-white/90 px-4 py-3 backdrop-blur sm:px-6 dark:border-stone-800 dark:bg-stone-800/90">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="rounded-lg p-1.5 text-stone-600 hover:bg-stone-100 lg:hidden dark:text-stone-300 dark:hover:bg-stone-700"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-base font-bold tracking-tight text-stone-900 dark:text-white">
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
