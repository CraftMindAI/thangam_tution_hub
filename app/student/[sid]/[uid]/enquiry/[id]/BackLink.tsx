"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { studentBase } from "@/app/student/_lib/nav";

export default function BackLink() {
  const pathname = usePathname();
  const base = studentBase(pathname);

  return (
    <Link
      href={`${base}/enquiry`}
      className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
    >
      ← Back to Enquiries
    </Link>
  );
}
