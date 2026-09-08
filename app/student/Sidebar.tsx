"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import SignOutButton from "../components/SignOutButton";
import { Calendar, LayoutDashboard, MessageSquare } from "../components/icons";

const nav = [
  { href: "/student", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student/calendar", label: "Calendar", icon: Calendar },
  { href: "/student/enquiry", label: "Enquiry", icon: MessageSquare },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-stone-200/70 bg-white dark:border-slate-800 dark:bg-slate-800">
      <Link href="/" className="flex items-center gap-2.5 border-b border-stone-200/70 px-5 py-4 dark:border-slate-800">
        <span className="relative flex h-9 w-9 shrink-0 overflow-hidden rounded-xl shadow-md shadow-teal-900/10">
          <Image
            src="/logo.jpeg"
            alt="Thangam Varahi Tuition Hub"
            fill
            sizes="36px"
            className="object-cover"
          />
        </span>
        <span className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
          Student Portal
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {nav.map((item) => {
          const active =
            item.href === "/student" ? pathname === "/student" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-teal-50 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300"
                  : "text-slate-600 hover:bg-stone-100 dark:text-slate-300 dark:hover:bg-slate-700/50"
              }`}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-stone-200/70 p-3 dark:border-slate-800">
        <SignOutButton />
      </div>
    </aside>
  );
}
