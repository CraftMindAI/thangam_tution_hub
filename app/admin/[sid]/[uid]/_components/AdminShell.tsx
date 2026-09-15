"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Award, Menu, X, LogOut, ChevronRight } from "@/app/components/icons";
import { signOut } from "@/app/actions/auth";
import { adminBase, buildAdminNav, isActive } from "../_lib/nav";
import { AdminThemeProvider, ThemeToggle } from "./ui";

function AdminShellContent({
  children,
  adminName,
  adminEmail,
}: {
  children: React.ReactNode;
  adminName: string;
  adminEmail: string;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);

  const base = adminBase(pathname);
  const adminNav = buildAdminNav(base);
  const flatNav = adminNav.flatMap((item) =>
    item.children ? [item, ...item.children] : [item]
  );
  const current = [...flatNav]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => isActive(pathname, item) || pathname.startsWith(`${item.href}/`));
  const pageTitle = current?.label ?? "Admin";

  const adminInitial = (adminName || "A").trim().charAt(0).toUpperCase();

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
      {adminNav.map((item) => {
        const active = isActive(pathname, item);
        const childOnPath =
          item.children?.some((c) => isActive(pathname, c)) ?? false;
        const sectionOpen =
          Boolean(item.children) &&
          (active || childOnPath || hoveredHref === item.href);

        return (
          <div
            key={item.href}
            onMouseEnter={() => item.children && setHoveredHref(item.href)}
            onMouseLeave={() => setHoveredHref(null)}
          >
            <Link
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`group flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 ${
                active
                  ? "bg-yellow-400 text-stone-950 shadow-md shadow-yellow-500/20 font-bold scale-[1.01]"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800/80 dark:hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={`h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-110 ${
                    active
                      ? "text-stone-950"
                      : "text-stone-400 group-hover:text-stone-700 dark:text-stone-500 dark:group-hover:text-stone-300"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.children && (
                <ChevronRight
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    sectionOpen ? "rotate-90" : ""
                  } ${active ? "text-stone-900" : "text-stone-400"}`}
                />
              )}
            </Link>

            {item.children && sectionOpen && (
              <div className="mt-1 ml-5 flex flex-col gap-0.5 border-l-2 border-stone-200 pl-3 dark:border-stone-800">
                {item.children.map((child) => {
                  const childActive = isActive(pathname, child);
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                        childActive
                          ? "bg-yellow-400/20 text-stone-950 dark:bg-yellow-400/20 dark:text-yellow-300 font-bold"
                          : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          childActive
                            ? "bg-yellow-500 dark:bg-yellow-400"
                            : "bg-stone-300 dark:bg-stone-700"
                        }`}
                      />
                      {child.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <div
      data-admin-shell="true"
      className="flex h-screen h-[100dvh] overflow-hidden bg-[#f8f9fa] text-stone-900 dark:bg-[#0c0d12] dark:text-stone-100 transition-colors duration-200 font-sans"
    >
      {/* Desktop sidebar */}
      <aside className="hidden h-full w-72 shrink-0 flex-col border-r border-stone-200/80 bg-white py-6 lg:flex dark:border-stone-800/80 dark:bg-[#121318]">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-3 px-6 pb-6 group">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-400 text-stone-950 shadow-md shadow-yellow-500/25 transition-transform group-hover:scale-105">
            <Award className="h-6 w-6" />
          </span>
          <div>
            <span className="text-base font-extrabold leading-tight tracking-tight text-stone-900 dark:text-white block">
              Thangam Varahi
            </span>
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400">
              Admin Portal
            </span>
          </div>
        </Link>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto no-scrollbar">{nav}</div>

        {/* Admin Profile in sidebar footer */}
        <div className="mt-auto border-t border-stone-200/80 p-4 dark:border-stone-800/80">
          <div className="flex items-center gap-3 rounded-2xl bg-stone-100/80 p-2.5 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800/60">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-stone-950 font-black text-sm shadow-sm">
              {adminInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-stone-900 dark:text-white">
                {adminName}
              </p>
              <p className="truncate text-[11px] text-stone-500 dark:text-stone-400">
                {adminEmail}
              </p>
            </div>
            <form action={signOut} className="shrink-0">
              <button
                type="submit"
                title="Sign Out"
                className="flex h-8 w-8 items-center justify-center rounded-xl text-stone-400 hover:bg-white hover:text-stone-900 dark:hover:bg-stone-800 dark:hover:text-white transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-stone-200/80 bg-white py-6 dark:border-stone-800/80 dark:bg-[#121318] shadow-2xl">
            <div className="flex items-center justify-between px-6 pb-6">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-400 text-stone-950 shadow-md">
                  <Award className="h-5 w-5" />
                </span>
                <span className="text-sm font-extrabold tracking-tight text-stone-900 dark:text-white">
                  Admin Panel
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar">{nav}</div>

            <div className="mt-auto border-t border-stone-200/80 p-4 dark:border-stone-800/80">
              <div className="mb-3 px-2">
                <p className="truncate text-xs font-bold text-stone-800 dark:text-stone-200">
                  {adminName}
                </p>
                <p className="truncate text-[11px] text-stone-500 dark:text-stone-400">
                  {adminEmail}
                </p>
              </div>
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-100 px-4 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </form>
            </div>
          </aside>
        </div>
      )}

      {/* Main Column */}
      <div className="flex min-w-0 flex-1 flex-col h-full overflow-hidden">
        {/* Top header */}
        <header className="shrink-0 z-30 flex items-center justify-between border-b border-stone-200/80 bg-white/80 px-4 py-3 backdrop-blur-md sm:px-8 dark:border-stone-800/80 dark:bg-[#121318]/80">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="rounded-xl p-2 text-stone-600 hover:bg-stone-100 lg:hidden dark:text-stone-300 dark:hover:bg-stone-800"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-stone-900 dark:text-white flex items-center gap-2">
                {pageTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle className="inline-flex" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar px-4 py-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function AdminShell({
  children,
  adminName,
  adminEmail,
}: {
  children: React.ReactNode;
  adminName: string;
  adminEmail: string;
}) {
  return (
    <AdminThemeProvider>
      <AdminShellContent adminName={adminName} adminEmail={adminEmail}>
        {children}
      </AdminShellContent>
    </AdminThemeProvider>
  );
}

