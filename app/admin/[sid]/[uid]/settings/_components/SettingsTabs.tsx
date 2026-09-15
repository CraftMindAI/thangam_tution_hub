"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, CalendarClock, Users } from "@/app/components/icons";
import { adminBase } from "../../_lib/nav";

export function SettingsTabs() {
  const pathname = usePathname();
  const base = adminBase(pathname);

  const tabs = [
    {
      label: "Profile",
      href: `${base}/settings/profile`,
      icon: User,
    },
    {
      label: "Meeting Preferences",
      href: `${base}/settings/meeting-preference`,
      icon: CalendarClock,
    },
    {
      label: "Admin Users",
      href: `${base}/settings/admin-users`,
      icon: Users,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-stone-200/80 pb-3 dark:border-stone-800/80 mb-6">
      {tabs.map((t) => {
        const active = pathname === t.href || pathname.startsWith(`${t.href}/`);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all duration-150 ${
              active
                ? "bg-yellow-400 text-stone-950 shadow-sm shadow-yellow-500/20 scale-[1.02]"
                : "text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white"
            }`}
          >
            <t.icon className={`h-4 w-4 ${active ? "text-stone-950" : "text-stone-400"}`} />
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
