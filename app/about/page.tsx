import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { Blobs, Eyebrow, iconBadge } from "../components/PlayfulUI";
import {
  Award,
  ArrowRight,
  BookOpen,
  CheckCircle,
  ClipboardList,
  Clock,
  GraduationCap,
  HeartHandshake,
  Pencil,
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

const tracking = [
  {
    icon: ClipboardList,
    title: "Monthly Report Card",
    desc: "Every child is graded out of 10 each month on Leave, Time Keeping, Keep Silence, Homework and Handwriting, plus an overall Studies + Discipline credit grade (A++ to E) — shared with and signed by parents.",
  },
  {
    icon: BookOpen,
    title: "SSS Note (Std 3 and above)",
    desc: "An 80-page note tracking what's covered in school, what's fully completed, and what's studied every morning at home before school — checked weekly and countersigned by parents.",
  },
  {
    icon: Pencil,
    title: "Question & Answer Notes",
    desc: "From Std 3 onwards, children keep separate Question and Answer notes for every lesson, verified and marked 'Thoroughly Cleared' before each exam so no doubt is left unresolved.",
  },
];

const rules = [
  "Keep silence during study hours — it helps everyone focus.",
  "Individual tables for every child — no standing to ask doubts.",
  "Wear a neat, proper dress code to every session.",
  "Bring your own water bottle, pen, pencil and eraser — no borrowing.",
  "Except for medical leave (with a prescription), please avoid frequent absences.",
  "Tuition fees are collected within the first 5 days of every month.",
  "Bring your Tuition diary daily — parents must check and sign it.",
  "Attend the monthly parents' feedback meeting on the last Tuesday.",
];

export default function About() {
  return (
    <div className="flex flex-col flex-1 bg-white text-stone-900 dark:bg-stone-900 dark:text-stone-100">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <Blobs variant="compact" />
          <div className="relative mx-auto max-w-3xl px-6 py-20 text-center sm:py-24">
            <Eyebrow>Our Story</Eyebrow>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl dark:text-white">
              About{" "}
              <span className="text-yellow-600">Thangam Varahi</span>{" "}
              Tuition Hub
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-stone-600 dark:text-stone-300">
              We welcome you all, our cute children&apos;s, as God&apos;s
              gift &mdash; the line we&apos;ve stood by since the day we
              opened our doors.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="relative overflow-hidden bg-yellow-50 py-24 dark:bg-stone-800">
          <span
            className="pointer-events-none absolute top-2 left-1/2 -translate-x-1/2 select-none text-[9rem] leading-none font-black text-yellow-500/10 sm:text-[13rem] dark:text-yellow-300/5"
            aria-hidden
          >
            2021
          </span>
          <div className="relative mx-auto max-w-2xl px-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl dark:text-white">
              Where we started
            </h2>
            <p className="mt-5 leading-8 text-stone-700 dark:text-stone-300">
              Thangam Varahi Tuition Hub was seeded in the land of Chennai
              on <strong>5th September 2021</strong>, built on one simple
              idea: every wage-earning family deserves access to
              best-quality tutoring at an affordable, reasonable price.
              Since then we have taught a wide variety of children, from
              Nursery through 10th Std, gathering experience and refining
              how we teach — with clarity and care that shows in our
              students&apos; results.
            </p>
            <p className="mt-4 leading-8 text-stone-700 dark:text-stone-300">
              We are registered with the Government of India as a Micro
              enterprise under Udyam (Reg. No.{" "}
              <strong>UDYAM-TN-02-0419567</strong>), classified under
              academic tutoring services &mdash; a small but meaningful
              marker of how seriously we take this work.
            </p>
          </div>
        </section>

        {/* Pledge */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-center text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
              Our Tuition Pledge
            </h2>
            <div className="relative mt-8 space-y-4 rounded-[2rem] bg-yellow-100 p-8 leading-8 text-stone-700 shadow-lg dark:bg-yellow-950/30 dark:text-stone-300">
              <span className="pointer-events-none absolute -top-4 left-6 select-none text-6xl font-serif text-yellow-400/60 dark:text-yellow-700/50">
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
              <span className="text-lg font-bold text-yellow-700 dark:text-yellow-300">
                &ldquo;Practice makes us perfect.&rdquo;
              </span>
              <span className="text-lg font-bold text-yellow-700 dark:text-yellow-300">
                &ldquo;Training till we achieve our targets.&rdquo;
              </span>
            </div>
          </div>
        </section>

        {/* How we teach */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center">
              <Eyebrow>Our Approach</Eyebrow>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
                How We Teach
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-stone-600 dark:text-stone-400">
                None of this is complicated. It&apos;s just followed
                consistently, for every child, every day.
              </p>
            </div>
            <div className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2">
              {values.map((v, i) => (
                <div
                  key={v.title}
                  className="flex gap-5 border-t border-stone-200 pt-6 dark:border-stone-800"
                >
                  <span className="text-3xl font-black tabular-nums text-yellow-400/70 dark:text-yellow-500/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-semibold text-stone-900 dark:text-white">
                      {v.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-stone-600 dark:text-stone-400">
                      {v.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tracking progress */}
        <section className="bg-yellow-50 py-20 dark:bg-stone-800">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center">
              <Eyebrow>Progress Tracking</Eyebrow>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
                How We Track Every Child&apos;s Progress
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-stone-600 dark:text-stone-400">
                Paperwork parents can actually see — not just promises.
              </p>
            </div>
            <div className="mt-10 flex flex-col divide-y divide-stone-200 overflow-hidden rounded-[2rem] border border-stone-200 bg-white sm:flex-row sm:divide-x sm:divide-y-0 dark:divide-stone-700 dark:border-stone-700 dark:bg-stone-900/40">
              {tracking.map((t) => (
                <div key={t.title} className="flex-1 p-8">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconBadge}`}
                  >
                    <t.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-semibold text-stone-900 dark:text-white">
                    {t.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-400">
                    {t.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Centre rules */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6">
            <div className="text-center">
              <Eyebrow>Life at the Centre</Eyebrow>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
                Centre Rules
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-stone-600 dark:text-stone-400">
                Simple rules, followed by every child, so the room stays calm
                and every child gets a fair shot at focus.
              </p>
            </div>
            <ul className="mx-auto mt-10 grid max-w-2xl gap-x-8 gap-y-4 text-sm text-stone-600 sm:grid-cols-2 dark:text-stone-400">
              {rules.map((item) => (
                <li key={item} className="flex items-start gap-2.5 border-t border-stone-200 pt-4 dark:border-stone-800">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden py-20 text-center">
          <div className="pointer-events-none absolute -bottom-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-yellow-200/30 blur-3xl dark:bg-yellow-500/10" />
          <div className="relative mx-auto max-w-2xl px-6">
            <span className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${iconBadge}`}>
              <Clock className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
              Want to see it for yourself?
            </h2>
            <p className="mt-3 text-stone-600 dark:text-stone-400">
              Visit us in West Mambalam, or call to ask about admission for
              your child.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a
                href="tel:9789214998"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 px-6 py-3 text-sm font-semibold text-stone-900 shadow-lg shadow-yellow-500/20 transition-transform hover:scale-[1.03]"
              >
                Call: 97892 14998
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/#fees"
                className="inline-flex items-center rounded-full border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-700 shadow-sm transition-colors hover:text-yellow-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:text-yellow-300"
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
