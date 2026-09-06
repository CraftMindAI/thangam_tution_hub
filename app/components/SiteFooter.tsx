import Link from "next/link";
import { GraduationCap, Mail, MapPin, Phone } from "./icons";

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/#classes", label: "Classes" },
  { href: "/#fees", label: "Fee Structure" },
  { href: "/#timings", label: "Timings" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-stone-200/70 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
                Thangam Varahi Tuition Hub
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">
              Affordable, quality tuition for Nursery to 10th Std in West
              Mambalam, Chennai — since 2021.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-600 transition-colors hover:text-teal-700 dark:text-slate-400 dark:hover:text-teal-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Get in Touch
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
                <span>
                  49, Andiyappan Street, West Mambalam, Chennai – 600033
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
                <a href="tel:9789214998" className="hover:text-teal-700 dark:hover:text-teal-300">
                  97892 14998
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
                <a
                  href="mailto:thangamvarahituitionhub247365@gmail.com"
                  className="break-all hover:text-teal-700 dark:hover:text-teal-300"
                >
                  thangamvarahituitionhub247365@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-stone-200/70 pt-6 text-xs text-slate-500 sm:flex-row dark:border-slate-800 dark:text-slate-500">
          <span>
            © {new Date().getFullYear()} Thangam Varahi Tuition Hub. All
            rights reserved.
          </span>
          <span>Udyam Reg. No. UDYAM-TN-02-0419567</span>
        </div>
      </div>
    </footer>
  );
}
