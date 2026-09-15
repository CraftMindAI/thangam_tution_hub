import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "./icons";

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/#classes", label: "Classes" },
  { href: "/#fees", label: "Fee Structure" },
  { href: "/#timings", label: "Timings" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-yellow-100 bg-white dark:border-stone-800 dark:bg-stone-950">
      <div className="bg-yellow-400">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 text-center sm:flex-row sm:text-left">
          <div>
            <p className="text-base font-bold text-stone-900">
              Ready to admit your child?
            </p>
            <p className="text-sm text-stone-800">
              Call us or book a free demo class today.
            </p>
          </div>
          <a
            href="tel:9789214998"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
          >
            <Phone className="h-3.5 w-3.5" />
            97892 14998
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-9 w-9 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src="/logo.jpeg"
                  alt="Thangam Varahi Tuition Hub"
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </span>
              <span className="text-sm font-extrabold tracking-tight text-stone-900 dark:text-white">
                Thangam Varahi Tuition Hub
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-stone-500 dark:text-stone-400">
              Affordable, quality tuition for Nursery to 10th Std in West
              Mambalam, Chennai — since 2021.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-stone-600 transition-colors hover:text-yellow-700 dark:text-stone-400 dark:hover:text-yellow-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
              Get in Touch
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-stone-600 dark:text-stone-400">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
                <span>
                  49, Andiyappan Street, West Mambalam, Chennai – 600033
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
                <a href="tel:9789214998" className="hover:text-yellow-700 dark:hover:text-yellow-300">
                  97892 14998
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
                <a
                  href="mailto:thangamvarahituitionhub247365@gmail.com"
                  className="break-all hover:text-yellow-700 dark:hover:text-yellow-300"
                >
                  thangamvarahituitionhub247365@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-yellow-100 pt-6 text-xs text-stone-500 sm:flex-row dark:border-stone-800 dark:text-stone-500">
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
