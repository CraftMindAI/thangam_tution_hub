import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import {
  Award,
  ArrowRight,
  BookOpen,
  Clock,
  GraduationCap,
  HeartHandshake,
  Sparkles,
  Users,
} from "../components/icons";

export const metadata: Metadata = {
  title: "About Us | Thangam Varahi Tuition Hub",
  description:
    "The story, pledge and teaching approach behind Thangam Varahi Tuition Hub — a Udyam-registered tuition centre in West Mambalam, Chennai, since 2021.",
};

const values = [
  {
    icon: Users,
    title: "Individual tables, not crowds",
    desc: "Every child sits at their own table. Doubts are cleared where you sit — no need to stand up or shout across the room.",
  },
  {
    icon: BookOpen,
    title: "Two notebooks per child",
    desc: "A Tuition Note and a Test Note for every student, checked regularly against what's actually being taught in school that week.",
  },
  {
    icon: Sparkles,
    title: "Daily morning study notes",
    desc: "Children keep a short study note for what they revise at home before school, reviewed and signed off every Saturday.",
  },
  {
    icon: GraduationCap,
    title: "Discipline with care",
    desc: "Silence during study hours, a clean and hygienic space, and clear rules — because a calm room is what lets children actually focus.",
  },
  {
    icon: HeartHandshake,
    title: "Parents in the loop",
    desc: "Monthly report cards and a parents' feedback meeting on the last Tuesday of every month, offline or online.",
  },
  {
    icon: Award,
    title: "Beyond the syllabus",
    desc: "During the two months of annual holidays, when we don't charge fees, we teach spoken English, computer skills, chess, cricket and more.",
  },
];

function Eyebrow({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
      {children}
    </span>
  );
}

export default function About() {
  return (
    <div className="flex flex-col flex-1 bg-stone-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-white dark:bg-slate-800">
          <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-teal-300/25 blur-3xl dark:bg-teal-500/10" />
          <div className="pointer-events-none absolute top-0 -right-24 h-96 w-96 rounded-full bg-emerald-300/25 blur-3xl dark:bg-emerald-500/10" />
          <div className="relative mx-auto max-w-3xl px-6 py-20 text-center sm:py-24">
            <Eyebrow>Our Story</Eyebrow>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
              About{" "}
              <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                Thangam Varahi
              </span>{" "}
              Tuition Hub
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              We welcome you all, our cute children&apos;s, as God&apos;s
              gift &mdash; the line we&apos;ve stood by since the day we
              opened our doors.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Where we started
            </h2>
            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-300">
              Thangam Varahi Tuition Hub was seeded in the land of Chennai on{" "}
              <strong>5th September 2021</strong>, built on one simple idea:
              every wage-earning family deserves access to best-quality
              tutoring at an affordable, reasonable price. Since then we have
              taught a wide variety of children, from Nursery through 10th
              Std, gathering experience and refining how we teach — with
              clarity and care that shows in our students&apos; results.
            </p>
            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-300">
              We are registered with the Government of India as a Micro
              enterprise under Udyam (Reg. No.{" "}
              <strong>UDYAM-TN-02-0419567</strong>), classified under
              academic tutoring services &mdash; a small but meaningful
              marker of how seriously we take this work.
            </p>
          </div>
        </section>

        {/* Pledge */}
        <section className="bg-white py-20 dark:bg-slate-800">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Our Tuition Pledge
            </h2>
            <div className="relative mt-8 space-y-4 rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-emerald-50 p-8 leading-8 text-slate-700 dark:border-slate-700 dark:from-slate-900/60 dark:to-teal-950/30 dark:text-slate-300">
              <span className="pointer-events-none absolute -top-4 left-6 select-none text-6xl font-serif text-teal-300/70 dark:text-teal-700/50">
                &ldquo;
              </span>
              <p>
                We have trust in God&apos;s workship. But for our true
                dedication towards success, we feed hard work as food to
                reach step by step upwards.
              </p>
              <p>
                All students are like our babies. So we take responsibility
                for all our babies&apos; education. Education is a light to
                fight against darkness like illiteracy, disappointment and
                failure. All babies have the right to ask doubts, anytime.
              </p>
            </div>
            <div className="mt-8 flex flex-col items-center gap-2 text-center">
              <span className="text-lg font-bold text-teal-700 dark:text-teal-300">
                &ldquo;Practice makes us perfect.&rdquo;
              </span>
              <span className="text-lg font-bold text-teal-700 dark:text-teal-300">
                &ldquo;Training till we achieve our targets.&rdquo;
              </span>
            </div>
          </div>
        </section>

        {/* How we teach */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <Eyebrow>Our Approach</Eyebrow>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                How We Teach
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
                None of this is complicated. It&apos;s just followed
                consistently, for every child, every day.
              </p>
            </div>
            <div className="relative mx-auto mt-10 max-w-2xl">
              <div
                className="absolute top-2 bottom-2 left-5 w-0.5 bg-gradient-to-b from-teal-300 via-teal-300 to-emerald-300 dark:from-teal-800 dark:via-teal-700 dark:to-emerald-800"
                aria-hidden
              />
              <div className="flex flex-col gap-8">
                {values.map((v) => (
                  <div key={v.title} className="relative flex gap-5 pl-0">
                    <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-900/20 ring-4 ring-stone-50 dark:ring-slate-900">
                      <v.icon className="h-5 w-5" />
                    </span>
                    <div className="pt-1.5">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {v.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        {v.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-white py-20 text-center dark:bg-slate-800">
          <div className="pointer-events-none absolute -bottom-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-teal-300/20 blur-3xl dark:bg-teal-500/10" />
          <div className="relative mx-auto max-w-2xl px-6">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
              <Clock className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Want to see it for yourself?
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Visit us in West Mambalam, or call to ask about admission for
              your child.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a
                href="tel:9789214998"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-900/20 transition-transform hover:scale-[1.03]"
              >
                Call: 97892 14998
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/#fees"
                className="inline-flex items-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-teal-600 hover:text-teal-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-teal-500 dark:hover:text-teal-300"
              >
                View Fee Structure
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
