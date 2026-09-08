"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { settingsNav, isActive } from "../../_lib/nav";

export default function SettingsNav() {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 overflow-x-auto border-b border-stone-200/70 dark:border-slate-800">
      {settingsNav.map((item) => {
        const active = isActive(pathname, item);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`-mb-px shrink-0 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "border-slate-800 text-slate-900 dark:border-white dark:text-white"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
