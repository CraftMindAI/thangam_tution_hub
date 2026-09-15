import Link from "next/link";
import Image from "next/image";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import { Eyebrow, Wave, tilts } from "./components/PlayfulUI";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle,
  ClipboardList,
  Clock,
  GraduationCap,
  HeartHandshake,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Sparkles,
  Users,
} from "./components/icons";

const stats = [
  { label: "Founded", value: "2021", icon: Sparkles },
  { label: "Grades taught", value: "Nursery–10th", icon: GraduationCap },
  { label: "Registered", value: "MSME / Udyam", icon: Award },
  { label: "Subjects covered", value: "7", icon: BookOpen },
];

const fees = [
  { grade: "Nursery", sub: "LKG / UKG", amount: "500" },
  { grade: "1st – 5th Std.", sub: "Primary", amount: "500" },
  { grade: "6th – 9th Std.", sub: "Middle & High", amount: "600–900" },
  { grade: "10th Std.", sub: "Board Year", amount: "1,000", highlight: true },
];

const features = [
  {
    icon: Users,
    title: "Individual Attention",
    desc: "Every child gets their own table — no crowding, no shared desks. Doubts are cleared one-on-one, right where you sit.",
  },
  {
    icon: Sparkles,
    title: "Free Online Doubt Clearing",
    desc: "We take online sessions for all children after tuition hours, at no extra cost.",
  },
  {
    icon: BookOpen,
    title: "Two Dedicated Notebooks",
    desc: "A separate Tuition Note and Test Note for every student, checked regularly against school syllabus coverage.",
  },
  {
    icon: Award,
    title: "Monthly Report Cards",
    desc: "Graded out of 10 each month on time-keeping, silence, homework and handwriting, plus an overall Studies + Discipline credit grade, shared with parents.",
  },
  {
    icon: HeartHandshake,
    title: "Monthly Parent Meetings",
    desc: "Held on the last Tuesday of every month (offline / online) to discuss each child's progress.",
  },
  {
    icon: GraduationCap,
    title: "Referral Bonus",
    desc: "Know a family looking for good tuition? Refer them and earn a bonus.",
  },
  {
    icon: ClipboardList,
    title: "SSS Note (Std 3+)",
    desc: "An 80-page note tracking school syllabus coverage, what's completed, and daily morning study at home — checked weekly and signed by parents.",
  },
  {
    icon: Pencil,
    title: "Question & Answer Notes",
    desc: "From Std 3 onwards, separate notebooks for exam questions and answers, lesson by lesson, verified and cleared before every exam.",
  },
];

const subjects = [
  "Tamil",
  "English",
  "Hindi",
  "Mathematics",
  "Science",
  "Social Science",
  "Computer Science",
];

const activities = [
  "Spoken English",
  "Computer Updates",
  "Make-up Training",
  "Cloth Stitching",
  "Chess",
  "Carrom",
  "Cricket",
  "Badminton",
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-white text-stone-900 dark:bg-stone-900 dark:text-stone-100">
      <SiteHeader />

      <main id="top" className="flex-1 overflow-x-hidden">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-yellow-300/30 blur-3xl dark:bg-yellow-500/10" />
          <div className="pointer-events-none absolute top-1/2 -right-24 h-96 w-96 -translate-y-1/2 rounded-full bg-yellow-200/30 blur-3xl dark:bg-yellow-600/10" />
          <Sparkles className="pointer-events-none absolute top-24 right-[12%] hidden h-8 w-8 rotate-12 text-yellow-400/70 sm:block" />
          <Sparkles className="pointer-events-none absolute bottom-10 left-[8%] hidden h-6 w-6 -rotate-12 text-yellow-400/70 sm:block" />
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-30 dark:opacity-15"
            src="/banner-animation.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/90 to-white dark:from-stone-900/80 dark:via-stone-900/90 dark:to-stone-900" />

          <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:py-28 md:grid-cols-2 md:items-center">
            <div>
              <Eyebrow>Serving West Mambalam &amp; T-Nagar since 2021</Eyebrow>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-stone-900 sm:text-5xl dark:text-white">
                Practice makes us{" "}
                <span className="relative inline-block text-yellow-600">
                  perfect.
                  <svg
                    viewBox="0 0 200 16"
                    preserveAspectRatio="none"
                    className="absolute -bottom-2 left-0 h-3 w-full text-yellow-300"
                    aria-hidden
                  >
                    <path
                      d="M2 10 C 40 2, 80 14, 100 8 C 130 1, 160 13, 198 6"
                      stroke="currentColor"
                      strokeWidth="5"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-stone-600 dark:text-stone-300">
                Best-quality tuition at an affordable, reasonable price for
                Nursery to 10th Std — with individual attention, disciplined
                study habits and a genuine focus on every child&apos;s
                result.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/demo"
                  className="group inline-flex items-center gap-2 rounded-full border-2 border-stone-900 bg-yellow-400 px-6 py-3.5 text-sm font-bold text-stone-900 shadow-[4px_4px_0_0_#1c1917] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:bg-yellow-300 hover:shadow-[6px_6px_0_0_#1c1917] dark:border-yellow-300"
                >
                  Book a Free Demo Class
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a
                  href="tel:9789214998"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-stone-900 bg-white px-6 py-3.5 text-sm font-bold text-stone-700 shadow-[4px_4px_0_0_#1c1917] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:text-yellow-700 hover:shadow-[6px_6px_0_0_#1c1917] dark:border-stone-600 dark:bg-stone-800/50 dark:text-stone-200 dark:hover:text-yellow-300"
                >
                  <Phone className="h-4 w-4" />
                  97892 14998
                </a>
              </div>
              <Link
                href="/#fees"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-yellow-700 hover:gap-2.5 dark:text-yellow-300"
              >
                View fee structure
                <ArrowRight className="h-4 w-4 transition-all" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {stats.map(({ label, value, icon: Icon }, i) => (
                <div
                  key={label}
                  className={`${tilts[i % tilts.length]} rounded-3xl border-2 border-stone-900 bg-white p-5 shadow-[4px_4px_0_0_#1c1917] transition-all hover:rotate-0 hover:-translate-y-1 dark:border-stone-600 dark:bg-stone-800/60`}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-stone-900 bg-yellow-400 text-stone-900 dark:border-stone-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="mt-3 text-xl font-extrabold text-stone-900 dark:text-white">
                    {value}
                  </div>
                  <div className="mt-0.5 text-xs font-medium text-stone-500 dark:text-stone-400">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Wave className="relative -mb-1 text-yellow-50 dark:text-stone-800" />
        </section>

        {/* About teaser */}
        <section className="bg-yellow-50 py-20 dark:bg-stone-800">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <Eyebrow>About Us</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-stone-900 dark:text-white">
              A tuition centre built on trust
            </h2>
            <div className="relative mt-8 rotate-1 rounded-3xl border-2 border-stone-900 bg-white p-7 text-left shadow-[5px_5px_0_0_#1c1917] dark:border-stone-600 dark:bg-stone-900/60">
              <span className="absolute -top-3 -left-3 flex h-9 w-9 -rotate-12 items-center justify-center rounded-full border-2 border-stone-900 bg-yellow-400 text-stone-900 dark:border-stone-600">
                <Sparkles className="h-4 w-4" />
              </span>
              <p className="text-lg leading-8 text-stone-600 dark:text-stone-300">
                Thangam Varahi Tuition Hub has been seeded in the land of
                Chennai since <strong>5th September 2021</strong>, on the
                foundation of providing the best quality tutoring at an
                affordable, reasonable price for all kinds of wage-earning
                families. We are a Government-recognised MSME (Udyam)
                enterprise under the academic tutoring services category.
              </p>
            </div>
            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-yellow-700 hover:gap-2.5 dark:text-yellow-300"
            >
              Read our full story
              <ArrowRight className="h-4 w-4 transition-all" />
            </Link>
          </div>
        </section>

        {/* Classes / Subjects */}
        <section id="classes" className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <Eyebrow>Classes We Teach</Eyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-stone-900 dark:text-white">
                From Nursery all the way to 10th Std
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-stone-600 dark:text-stone-400">
                Covering the full school syllabus, subject by subject.
              </p>
            </div>

            <div className="relative mt-14 flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <div
                className="absolute top-6 right-8 left-8 hidden border-t-4 border-dashed border-yellow-300 sm:block dark:border-yellow-700"
                aria-hidden
              />
              {[
                {
                  grade: "Nursery",
                  sub: "LKG / UKG",
                  icon: Sparkles,
                  desc: "Playful, foundational learning to build early reading, writing and number skills.",
                },
                {
                  grade: "1st – 5th Std.",
                  sub: "Primary",
                  icon: BookOpen,
                  desc: "Strong basics across all subjects, with two dedicated notebooks per child.",
                },
                {
                  grade: "6th – 9th Std.",
                  sub: "Middle & High",
                  icon: Users,
                  desc: "Deeper subject coverage with individual attention at every child's own table.",
                },
                {
                  grade: "10th Std.",
                  sub: "Board Year",
                  icon: Award,
                  desc: "Focused, exam-ready preparation to help every child give their best in boards.",
                },
              ].map(({ grade, sub, icon: Icon, desc }, i) => (
                <div
                  key={grade}
                  className="group relative flex flex-1 flex-col items-center gap-3 text-center"
                >
                  <span
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-stone-900 bg-yellow-400 text-stone-900 shadow-[3px_3px_0_0_#1c1917] ring-4 ring-white transition-transform group-hover:-rotate-6 group-hover:scale-110 dark:border-stone-600 dark:ring-stone-900 ${tilts[i % tilts.length]}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-yellow-700 dark:text-yellow-400">
                    {sub}
                  </span>
                  <span className="-mt-2 text-base font-bold text-stone-900 dark:text-white">
                    {grade}
                  </span>
                  <p className="max-w-[15rem] text-sm leading-6 text-stone-600 dark:text-stone-400">
                    {desc}
                  </p>
                </div>
              ))}
            </div>

            <h3 className="mt-16 text-center text-xl font-bold text-stone-900 dark:text-white">
              Subjects Covered
            </h3>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {subjects.map((subject, i) => (
                <span
                  key={subject}
                  className={`${tilts[i % tilts.length]} rounded-full border-2 border-dashed border-yellow-300 bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-800 transition-transform hover:rotate-0 hover:scale-105 dark:border-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300`}
                >
                  {subject}
                </span>
              ))}
            </div>

            <h3 className="mt-16 text-center text-xl font-bold text-stone-900 dark:text-white">
              Annual Holiday Activities
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-stone-600 dark:text-stone-400">
              No tuition fees for 2 months of annual holidays — instead, we
              teach valuable extra-curricular skills.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {activities.map((activity, i) => (
                <span
                  key={activity}
                  className={`${tilts[i % tilts.length]} rounded-full border-2 border-yellow-400 bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-800 transition-transform hover:rotate-0 hover:scale-105 dark:border-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300`}
                >
                  {activity}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Online Classes */}
        <section className="relative overflow-hidden bg-yellow-50 py-20 dark:bg-stone-800">
          <Wave className="absolute top-0 left-0 w-full -translate-y-1/2 rotate-180 text-white dark:text-stone-900" />
          <div className="relative mx-auto max-w-6xl px-6">
            <div className="text-center">
              <Eyebrow>Class On Air</Eyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-stone-900 dark:text-white">
                Free Online Doubt-Clearing Sessions
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-stone-600 dark:text-stone-400">
                Every child gets live, one-on-one online sessions after
                tuition hours, at no extra cost — so no doubt goes
                unanswered.
              </p>
            </div>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div className="relative -rotate-2 aspect-[4/3] overflow-hidden rounded-3xl border-4 border-white bg-white shadow-[6px_6px_0_0_#1c1917] transition-transform hover:rotate-0 dark:border-stone-900">
                <Image
                  src="/coa.jpg"
                  alt="Live online class in session"
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="relative rotate-2 aspect-[4/3] overflow-hidden rounded-3xl border-4 border-white bg-white shadow-[6px_6px_0_0_#1c1917] transition-transform hover:rotate-0 dark:border-stone-900">
                <Image
                  src="/online.avif"
                  alt="Student attending an online tuition session"
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why Us */}
        <section id="why-us" className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <Eyebrow>Why Us</Eyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-stone-900 dark:text-white">
                Why parents choose us
              </h2>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className={`${tilts[i % tilts.length]} group rounded-3xl border-2 border-stone-900 bg-white p-7 shadow-[4px_4px_0_0_#1c1917] transition-all hover:rotate-0 hover:-translate-y-1 dark:border-stone-600 dark:bg-stone-800`}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-stone-900 bg-yellow-50 text-yellow-700 transition-colors group-hover:bg-yellow-400 dark:border-stone-600 dark:bg-yellow-900/40 dark:text-yellow-300">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-semibold text-stone-900 dark:text-white">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-400">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fees */}
        <section id="fees" className="relative overflow-hidden bg-yellow-50 py-20 dark:bg-stone-800">
          <Wave className="absolute top-0 left-0 w-full -translate-y-1/2 rotate-180 text-white dark:text-stone-900" />
          <div className="relative mx-auto max-w-5xl px-6">
            <div className="text-center">
              <Eyebrow>Fee Structure</Eyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-stone-900 dark:text-white">
                Simple, affordable, monthly
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-stone-600 dark:text-stone-400">
                Payable before the 7th of every month.
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {fees.map((row, i) =>
                row.highlight ? (
                  <div
                    key={row.grade}
                    className="relative flex rotate-1 flex-col rounded-3xl border-2 border-stone-900 bg-yellow-400 p-6 text-stone-900 shadow-[5px_5px_0_0_#1c1917] transition-all hover:rotate-0 hover:-translate-y-1"
                  >
                    <span className="absolute -top-3 -right-3 -rotate-6 rounded-full border-2 border-stone-900 bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-stone-900 shadow-[2px_2px_0_0_#1c1917]">
                      Board Year
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                      {row.sub}
                    </span>
                    <span className="mt-1 font-semibold text-stone-900">
                      {row.grade}
                    </span>
                    <span className="mt-4 text-3xl font-extrabold">
                      ₹{row.amount}
                    </span>
                    <span className="text-xs text-stone-700">per month</span>
                  </div>
                ) : (
                  <div
                    key={row.grade}
                    className={`${tilts[i % tilts.length]} flex flex-col rounded-3xl border-2 border-stone-900 bg-white p-6 shadow-[4px_4px_0_0_#1c1917] transition-all hover:rotate-0 hover:-translate-y-1 dark:border-stone-600 dark:bg-stone-800`}
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                      {row.sub}
                    </span>
                    <span className="mt-1 font-semibold text-stone-900 dark:text-white">
                      {row.grade}
                    </span>
                    <span className="mt-4 text-3xl font-extrabold text-yellow-700 dark:text-yellow-300">
                      ₹{row.amount}
                    </span>
                    <span className="text-xs text-stone-500 dark:text-stone-400">
                      per month
                    </span>
                  </div>
                ),
              )}
            </div>

            <ul className="mx-auto mt-10 grid max-w-2xl gap-3 text-sm text-stone-600 sm:grid-cols-2 dark:text-stone-400">
              {[
                "No extra fees for online doubt-clearing sessions.",
                "New joiners after the 15th of a month pay no fees for that month.",
                "Referral bonus available for all our children.",
                "No tuition fees during annual holidays (2 months).",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-center text-sm text-stone-500 dark:text-stone-400">
              Curious how we keep the centre calm and disciplined?{" "}
              <Link
                href="/about"
                className="font-semibold text-yellow-700 hover:underline dark:text-yellow-300"
              >
                Read our centre rules
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Timings */}
        <section id="timings" className="py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="text-center">
              <Eyebrow>Timings</Eyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-stone-900 dark:text-white">
                Tuition Timings
              </h2>
            </div>
            <div className="mt-10 flex flex-col gap-5 sm:flex-row">
              {[
                {
                  label: "Monday – Saturday",
                  value: "4:00 – 8:30 PM",
                },
                {
                  label: "During Exams",
                  value: "Compulsory Sunday Classes",
                },
                {
                  label: "Government Holidays",
                  value: "10:00 AM – 6:00 PM",
                  sub: "Lunch break 12:30 – 2:00 PM",
                },
              ].map((t, i) => (
                <div
                  key={t.label}
                  className={`${tilts[i % tilts.length]} flex-1 rounded-3xl border-2 border-stone-900 bg-white p-7 text-center shadow-[4px_4px_0_0_#1c1917] transition-all hover:rotate-0 hover:-translate-y-1 dark:border-stone-600 dark:bg-stone-900/40`}
                >
                  <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border-2 border-stone-900 bg-yellow-50 text-yellow-700 dark:border-stone-600 dark:bg-yellow-900/40 dark:text-yellow-300">
                    <Clock className="h-5 w-5" />
                  </span>
                  <div className="mt-3 font-semibold text-yellow-700 dark:text-yellow-300">
                    {t.label}
                  </div>
                  <div className="mt-1 text-lg font-bold text-stone-900 dark:text-white">
                    {t.value}
                  </div>
                  {t.sub && (
                    <div className="mt-1 text-xs text-stone-500 dark:text-stone-500">
                      ({t.sub})
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="relative overflow-hidden py-20">
          <div className="pointer-events-none absolute -bottom-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-yellow-300/20 blur-3xl dark:bg-yellow-500/10" />
          <div className="relative mx-auto max-w-4xl px-6">
            <div className="text-center">
              <Eyebrow>Contact</Eyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-stone-900 dark:text-white">
                Visit or contact us
              </h2>
            </div>
            <div className="mt-10 grid overflow-hidden rounded-[2rem] border-4 border-stone-900 shadow-[6px_6px_0_0_#1c1917] sm:grid-cols-2 dark:border-stone-600">
              <div className="bg-yellow-400 p-8 text-stone-900">
                <h3 className="font-semibold">Find Us</h3>
                <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-stone-800">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    49, Andiyappan Street, Near Supreme Mobiles Shop, West
                    Mambalam, T-Nagar, Chennai – 600033, Tamil Nadu
                  </span>
                </p>
                <p className="mt-4 flex items-center gap-2 text-sm text-stone-800">
                  <Phone className="h-4 w-4 shrink-0" />
                  <a href="tel:9789214998" className="font-semibold text-stone-900">
                    97892 14998
                  </a>
                  <span>/</span>
                  <a href="tel:9790574321" className="font-semibold text-stone-900">
                    97905 74321
                  </a>
                </p>
                <p className="mt-3 flex items-center gap-2 text-sm text-stone-800">
                  <Mail className="h-4 w-4 shrink-0" />
                  <a
                    href="mailto:thangamvarahituitionhub247365@gmail.com"
                    className="break-all font-semibold text-stone-900"
                  >
                    thangamvarahituitionhub247365@gmail.com
                  </a>
                </p>
                <a
                  href="https://wa.me/919789214998"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 rounded-full border-2 border-stone-900 bg-white px-4 py-2 text-xs font-bold text-stone-900 transition-colors hover:bg-stone-900/10"
                >
                  Chat with us on WhatsApp
                </a>
              </div>
              <div className="flex flex-col items-center justify-center gap-4 bg-white p-8 text-center dark:bg-stone-800">
                <h3 className="font-semibold text-stone-900 dark:text-white">
                  Ready to admit your child?
                </h3>
                <p className="max-w-xs text-sm text-stone-600 dark:text-stone-400">
                  Call us to ask about admission, or drop by the centre any
                  day during tuition hours.
                </p>
                <a
                  href="tel:9789214998"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-stone-900 bg-yellow-400 px-8 py-3.5 text-sm font-bold text-stone-900 shadow-[4px_4px_0_0_#1c1917] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:bg-yellow-300 hover:shadow-[6px_6px_0_0_#1c1917]"
                >
                  Enquire About Admission
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
