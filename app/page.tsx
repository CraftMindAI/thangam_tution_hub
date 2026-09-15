import Link from "next/link";
import Image from "next/image";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import { Blobs, Eyebrow, iconBadge } from "./components/PlayfulUI";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle,
  ClipboardList,
  Clock,
  GraduationCap,
  HeartHandshake,
  LayoutDashboard,
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
  { name: "Tamil", icon: BookOpen },
  { name: "English", icon: BookOpen },
  { name: "Hindi", icon: BookOpen },
  { name: "Mathematics", icon: Pencil },
  { name: "Science", icon: Sparkles },
  { name: "Social Science", icon: Users },
  { name: "Computer Science", icon: LayoutDashboard },
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
    <div className="flex flex-col flex-1 bg-zinc-950 text-white">
      <SiteHeader />

      <main id="top" className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <Blobs />

          <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:py-28 md:grid-cols-2 md:items-center">
            <div>
              <Eyebrow>Serving West Mambalam &amp; T-Nagar since 2021</Eyebrow>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl">
                Practice makes us{" "}
                <span className="text-yellow-400">perfect.</span>
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-8 text-zinc-400">
                Best-quality tuition at an affordable, reasonable price for
                Nursery to 10th Std — with individual attention, disciplined
                study habits and a genuine focus on every child&apos;s
                result.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/demo"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 px-6 py-3.5 text-sm font-semibold text-zinc-900 shadow-lg shadow-yellow-500/20 transition-transform hover:scale-[1.03]"
                >
                  Book a Free Demo Class
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a
                  href="tel:9789214998"
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/60 px-6 py-3.5 text-sm font-semibold text-zinc-200 backdrop-blur transition-colors hover:text-yellow-300"
                >
                  <Phone className="h-4 w-4" />
                  97892 14998
                </a>
              </div>
              <Link
                href="/#fees"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-yellow-400 hover:gap-2.5"
              >
                View fee structure
                <ArrowRight className="h-4 w-4 transition-all" />
              </Link>
            </div>

            <div className="relative">
              <div className="relative -rotate-2 aspect-[4/3] w-full overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/50">
                <Image
                  src="/landing.jpg"
                  alt="Student attending an online tuition class at Thangam Varahi Tuition Hub"
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
              <span className="absolute -bottom-5 -left-5 flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 shadow-lg shadow-black/40">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBadge}`}>
                  <GraduationCap className="h-4.5 w-4.5" />
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-extrabold text-white">
                    Nursery – 10th
                  </span>
                  <span className="block text-xs text-zinc-500">
                    every grade, one roof
                  </span>
                </span>
              </span>
            </div>
          </div>

          <div className="relative mx-auto mt-16 max-w-6xl px-6 pb-16 sm:pb-24">
            <div className="grid grid-cols-2 divide-y divide-zinc-800 rounded-[2rem] border border-zinc-800 bg-zinc-900/80 shadow-lg shadow-black/30 backdrop-blur sm:grid-cols-4 sm:divide-x sm:divide-y-0">
              {stats.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 px-6 py-6 text-center"
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBadge}`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <div className="text-xl font-extrabold text-white">
                    {value}
                  </div>
                  <div className="text-xs font-medium text-zinc-500">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About teaser */}
        <section className="relative overflow-hidden bg-zinc-900 py-24">
          <span
            className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 select-none text-[10rem] leading-none font-black text-yellow-400/5 sm:text-[14rem]"
            aria-hidden
          >
            2021
          </span>
          <div className="relative mx-auto max-w-2xl px-6 text-center">
            <Eyebrow>About Us</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              A tuition centre built on trust
            </h2>
            <p className="mt-6 text-lg leading-8 text-zinc-300">
              Thangam Varahi Tuition Hub has been seeded in the land of
              Chennai since <strong className="text-white">5th September 2021</strong>, on the
              foundation of providing the best quality tutoring at an
              affordable, reasonable price for all kinds of wage-earning
              families. We are a Government-recognised MSME (Udyam)
              enterprise under the academic tutoring services category.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-yellow-400 hover:gap-2.5"
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
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">
                From Nursery all the way to 10th Std
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-zinc-400">
                Covering the full school syllabus, subject by subject.
              </p>
            </div>

            <div className="relative mt-14 flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <div
                className="absolute top-6 right-8 left-8 hidden h-0.5 bg-gradient-to-r from-yellow-800 via-yellow-600 to-yellow-800 sm:block"
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
              ].map(({ grade, sub, icon: Icon, desc }) => (
                <div
                  key={grade}
                  className="group relative flex flex-1 flex-col items-center gap-3 text-center"
                >
                  <span
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ring-4 ring-zinc-950 transition-transform group-hover:scale-110 ${iconBadge}`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-yellow-400">
                    {sub}
                  </span>
                  <span className="-mt-2 text-base font-bold text-white">
                    {grade}
                  </span>
                  <p className="max-w-[15rem] text-sm leading-6 text-zinc-400">
                    {desc}
                  </p>
                </div>
              ))}
            </div>

            <h3 className="mt-16 text-center text-xl font-bold text-white">
              Subjects Covered
            </h3>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
              {subjects.map(({ name, icon: Icon }, i) => (
                <div key={name} className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-yellow-400" />
                    <span className="text-base font-semibold text-zinc-200">
                      {name}
                    </span>
                  </div>
                  {i < subjects.length - 1 && (
                    <span className="hidden h-1.5 w-1.5 rounded-full bg-zinc-700 sm:block" aria-hidden />
                  )}
                </div>
              ))}
            </div>

            <h3 className="mt-16 text-center text-xl font-bold text-white">
              Annual Holiday Activities
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-zinc-400">
              No tuition fees for 2 months of annual holidays — instead, we
              teach valuable extra-curricular skills.
            </p>
            <div className="relative mt-8 -mx-6 overflow-hidden sm:mx-0">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-zinc-950 to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-zinc-950 to-transparent" />
              <div className="animate-marquee flex w-max gap-3 px-6">
                {[...activities, ...activities].map((activity, i) => (
                  <span
                    key={`${activity}-${i}`}
                    className="shrink-0 rounded-full bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm"
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Online Classes */}
        <section className="bg-zinc-900 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <Eyebrow>Class On Air</Eyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">
                Free Online Doubt-Clearing Sessions
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-zinc-400">
                Every child gets live, one-on-one online sessions after
                tuition hours, at no extra cost — so no doubt goes
                unanswered.
              </p>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-zinc-800 shadow-xl shadow-black/40">
                <Image
                  src="/coa.jpg"
                  alt="Live online class in session"
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-zinc-800 shadow-xl shadow-black/40">
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
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">
                Why parents choose us
              </h2>
            </div>
            <div className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className="flex gap-5 border-t border-zinc-800 pt-6"
                >
                  <span className="text-3xl font-black tabular-nums text-yellow-400/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fees */}
        <section id="fees" className="bg-zinc-900 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center">
              <Eyebrow>Fee Structure</Eyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">
                Simple, affordable, monthly
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-zinc-400">
                Payable before the 7th of every month.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {fees.map((row) =>
                row.highlight ? (
                  <div
                    key={row.grade}
                    className="relative flex flex-col rounded-3xl bg-gradient-to-br from-yellow-300 to-yellow-500 p-6 text-zinc-900 shadow-lg shadow-yellow-500/25 transition-transform hover:-translate-y-1"
                  >
                    <span className="absolute -top-2.5 right-5 rounded-full bg-zinc-900 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Board Year
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                      {row.sub}
                    </span>
                    <span className="mt-1 font-semibold text-zinc-900">
                      {row.grade}
                    </span>
                    <span className="mt-4 text-3xl font-extrabold">
                      ₹{row.amount}
                    </span>
                    <span className="text-xs text-zinc-700">per month</span>
                  </div>
                ) : (
                  <div
                    key={row.grade}
                    className="flex flex-col rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-md shadow-black/30 transition-all hover:-translate-y-1 hover:border-yellow-500/30"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      {row.sub}
                    </span>
                    <span className="mt-1 font-semibold text-white">
                      {row.grade}
                    </span>
                    <span className="mt-4 text-3xl font-extrabold text-yellow-400">
                      ₹{row.amount}
                    </span>
                    <span className="text-xs text-zinc-500">
                      per month
                    </span>
                  </div>
                ),
              )}
            </div>

            <ul className="mx-auto mt-10 grid max-w-2xl gap-3 text-sm text-zinc-400 sm:grid-cols-2">
              {[
                "No extra fees for online doubt-clearing sessions.",
                "New joiners after the 15th of a month pay no fees for that month.",
                "Referral bonus available for all our children.",
                "No tuition fees during annual holidays (2 months).",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-center text-sm text-zinc-500">
              Curious how we keep the centre calm and disciplined?{" "}
              <Link
                href="/about"
                className="font-semibold text-yellow-400 hover:underline"
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
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">
                Tuition Timings
              </h2>
            </div>
            <div className="mt-10 flex flex-col divide-y divide-zinc-800 overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-900 sm:flex-row sm:divide-x sm:divide-y-0">
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
              ].map((t) => (
                <div key={t.label} className="flex-1 p-8 text-center">
                  <span
                    className={`mx-auto flex h-11 w-11 items-center justify-center rounded-2xl ${iconBadge}`}
                  >
                    <Clock className="h-5 w-5" />
                  </span>
                  <div className="mt-3 font-semibold text-yellow-400">
                    {t.label}
                  </div>
                  <div className="mt-1 text-lg font-bold text-white">
                    {t.value}
                  </div>
                  {t.sub && (
                    <div className="mt-1 text-xs text-zinc-500">
                      ({t.sub})
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="relative overflow-hidden bg-zinc-900 py-20">
          <div className="relative mx-auto max-w-4xl px-6">
            <div className="text-center">
              <Eyebrow>Contact</Eyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">
                Visit or contact us
              </h2>
            </div>
            <div className="mt-10 grid overflow-hidden rounded-[2rem] shadow-2xl shadow-black/40 sm:grid-cols-2">
              <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 p-8 text-zinc-900">
                <h3 className="font-semibold">Find Us</h3>
                <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-zinc-800">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    49, Andiyappan Street, Near Supreme Mobiles Shop, West
                    Mambalam, T-Nagar, Chennai – 600033, Tamil Nadu
                  </span>
                </p>
                <p className="mt-4 flex items-center gap-2 text-sm text-zinc-800">
                  <Phone className="h-4 w-4 shrink-0" />
                  <a href="tel:9789214998" className="font-semibold text-zinc-900">
                    97892 14998
                  </a>
                  <span>/</span>
                  <a href="tel:9790574321" className="font-semibold text-zinc-900">
                    97905 74321
                  </a>
                </p>
                <p className="mt-3 flex items-center gap-2 text-sm text-zinc-800">
                  <Mail className="h-4 w-4 shrink-0" />
                  <a
                    href="mailto:thangamvarahituitionhub247365@gmail.com"
                    className="break-all font-semibold text-zinc-900"
                  >
                    thangamvarahituitionhub247365@gmail.com
                  </a>
                </p>
                <a
                  href="https://wa.me/919789214998"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-zinc-900/10 px-4 py-2 text-xs font-semibold text-zinc-900 transition-colors hover:bg-zinc-900/20"
                >
                  Chat with us on WhatsApp
                </a>
              </div>
              <div className="flex flex-col items-center justify-center gap-4 bg-zinc-950 p-8 text-center">
                <h3 className="font-semibold text-white">
                  Ready to admit your child?
                </h3>
                <p className="max-w-xs text-sm text-zinc-400">
                  Call us to ask about admission, or drop by the centre any
                  day during tuition hours.
                </p>
                <a
                  href="tel:9789214998"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 px-8 py-3.5 text-sm font-semibold text-zinc-900 shadow-lg shadow-yellow-500/20 transition-transform hover:scale-[1.03]"
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
