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
    <div className="flex flex-col flex-1 bg-zinc-950 text-white">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <Blobs variant="compact" />
          <div className="relative mx-auto max-w-3xl px-6 py-20 text-center sm:py-24">
            <Eyebrow>Our Story</Eyebrow>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              About{" "}
              <span className="text-yellow-400">Thangam Varahi</span>{" "}
              Tuition Hub
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
              We welcome you all, our cute children&apos;s, as God&apos;s
              gift &mdash; the line we&apos;ve stood by since the day we
              opened our doors.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="bg-zinc-900 py-20">
          <div className="mx-auto max-w-3xl px-6">
            <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8 shadow-xl shadow-black/30">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Where we started
              </h2>
              <p className="mt-4 leading-8 text-zinc-400">
                Thangam Varahi Tuition Hub was seeded in the land of Chennai
                on <strong className="text-white">5th September 2021</strong>, built on one simple
                idea: every wage-earning family deserves access to
                best-quality tutoring at an affordable, reasonable price.
                Since then we have taught a wide variety of children, from
                Nursery through 10th Std, gathering experience and refining
                how we teach — with clarity and care that shows in our
                students&apos; results.
              </p>
              <p className="mt-4 leading-8 text-zinc-400">
                We are registered with the Government of India as a Micro
                enterprise under Udyam (Reg. No.{" "}
                <strong className="text-white">UDYAM-TN-02-0419567</strong>), classified under
                academic tutoring services &mdash; a small but meaningful
                marker of how seriously we take this work.
              </p>
            </div>
          </div>
        </section>

        {/* Pledge */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-center text-2xl font-bold tracking-tight text-white">
              Our Tuition Pledge
            </h2>
            <div className="relative mt-8 space-y-4 rounded-[2rem] bg-gradient-to-br from-yellow-300 to-yellow-500 p-8 leading-8 text-zinc-800 shadow-lg shadow-yellow-500/20">
              <span className="pointer-events-none absolute -top-4 left-6 select-none text-6xl font-serif text-zinc-900/20">
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
              <span className="text-lg font-bold text-yellow-400">
                &ldquo;Practice makes us perfect.&rdquo;
              </span>
              <span className="text-lg font-bold text-yellow-400">
                &ldquo;Training till we achieve our targets.&rdquo;
              </span>
            </div>
          </div>
        </section>

        {/* How we teach */}
        <section className="bg-zinc-900 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <Eyebrow>Our Approach</Eyebrow>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
                How We Teach
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-zinc-400">
                None of this is complicated. It&apos;s just followed
                consistently, for every child, every day.
              </p>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-md shadow-black/20 transition-all hover:-translate-y-1 hover:border-yellow-500/30"
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconBadge}`}
                  >
                    <v.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-semibold text-white">
                    {v.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-zinc-400">
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tracking progress */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <Eyebrow>Progress Tracking</Eyebrow>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
                How We Track Every Child&apos;s Progress
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-zinc-400">
                Paperwork parents can actually see — not just promises.
              </p>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {tracking.map((t) => (
                <div
                  key={t.title}
                  className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-md shadow-black/20 transition-all hover:-translate-y-1 hover:border-yellow-500/30"
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconBadge}`}
                  >
                    <t.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-semibold text-white">
                    {t.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {t.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Centre rules */}
        <section className="bg-zinc-900 py-20">
          <div className="mx-auto max-w-3xl px-6">
            <div className="text-center">
              <Eyebrow>Life at the Centre</Eyebrow>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
                Centre Rules
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-zinc-400">
                Simple rules, followed by every child, so the room stays calm
                and every child gets a fair shot at focus.
              </p>
            </div>
            <div className="mt-10 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8 shadow-xl shadow-black/30">
              <ul className="grid gap-3 text-sm text-zinc-400 sm:grid-cols-2">
                {rules.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden py-20 text-center">
          <div className="pointer-events-none absolute -bottom-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-yellow-500/10 blur-3xl" />
          <div className="relative mx-auto max-w-2xl px-6">
            <span className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${iconBadge}`}>
              <Clock className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
              Want to see it for yourself?
            </h2>
            <p className="mt-3 text-zinc-400">
              Visit us in West Mambalam, or call to ask about admission for
              your child.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a
                href="tel:9789214998"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 px-6 py-3 text-sm font-semibold text-zinc-900 shadow-lg shadow-yellow-500/20 transition-transform hover:scale-[1.03]"
              >
                Call: 97892 14998
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="tel:9790574321"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 px-6 py-3 text-sm font-semibold text-zinc-900 shadow-lg shadow-yellow-500/20 transition-transform hover:scale-[1.03]"
              >
                Call: 97905 74321
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/#fees"
                className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900 px-6 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:text-yellow-300"
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
