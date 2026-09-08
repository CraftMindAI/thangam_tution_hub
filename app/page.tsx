import Link from "next/link";
import Image from "next/image";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  GraduationCap,
  HeartHandshake,
  Mail,
  MapPin,
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
    desc: "Time-keeping, homework, handwriting, discipline and rewards are graded and shared with parents every month.",
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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-stone-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <SiteHeader />

      <main id="top" className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-teal-300/30 blur-3xl dark:bg-teal-500/10" />
          <div className="pointer-events-none absolute top-1/2 -right-24 h-96 w-96 -translate-y-1/2 rounded-full bg-emerald-300/30 blur-3xl dark:bg-emerald-500/10" />
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-30 dark:opacity-15"
            src="/banner-animation.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-50/80 via-stone-50/90 to-stone-50 dark:from-slate-900/80 dark:via-slate-900/90 dark:to-slate-900" />

          <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:py-28 md:grid-cols-2 md:items-center">
            <div>
              <Eyebrow>Serving West Mambalam &amp; T-Nagar since 2021</Eyebrow>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                Practice makes us{" "}
                <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                  perfect.
                </span>
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600 dark:text-slate-300">
                Best-quality tuition at an affordable, reasonable price for
                Nursery to 10th Std — with individual attention, disciplined
                study habits and a genuine focus on every child&apos;s
                result.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="tel:9789214998"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-900/20 transition-transform hover:scale-[1.03]"
                >
                  Call for Admission: 97892 14998
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <Link
                  href="/#fees"
                  className="inline-flex items-center rounded-full border border-slate-300 bg-white/70 px-6 py-3.5 text-sm font-semibold text-slate-700 backdrop-blur transition-colors hover:border-teal-600 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:border-teal-500 dark:hover:text-teal-300"
                >
                  View Fee Structure
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-stone-200/80 bg-white/80 p-5 shadow-sm backdrop-blur transition-transform hover:-translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/60"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white">
                    {value}
                  </div>
                  <div className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About teaser */}
        <section className="bg-white py-20 dark:bg-slate-800">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <Eyebrow>About Us</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              A tuition centre built on trust
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
              Thangam Varahi Tuition Hub has been seeded in the land of
              Chennai since <strong>5th September 2021</strong>, on the
              foundation of providing the best quality tutoring at an
              affordable, reasonable price for all kinds of wage-earning
              families. We are a Government-recognised MSME (Udyam)
              enterprise under the academic tutoring services category.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:gap-2.5 dark:text-teal-300"
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
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                From Nursery all the way to 10th Std
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
                Covering the full school syllabus, subject by subject.
              </p>
            </div>

            <div className="relative mt-12 flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div
                className="absolute top-6 right-8 left-8 hidden h-0.5 bg-gradient-to-r from-teal-300 via-teal-400 to-emerald-400 sm:block dark:from-teal-800 dark:via-teal-700 dark:to-emerald-700"
                aria-hidden
              />
              {[
                "Nursery (LKG / UKG)",
                "1st – 5th Std.",
                "6th – 9th Std.",
                "10th Std.",
              ].map((grade, i) => (
                <div
                  key={grade}
                  className="relative flex flex-1 flex-col items-center gap-3 text-center"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-emerald-600 text-base font-bold text-white shadow-md shadow-teal-900/20 ring-4 ring-stone-50 dark:ring-slate-900">
                    {i + 1}
                  </span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {grade}
                  </span>
                </div>
              ))}
            </div>

            <h3 className="mt-16 text-center text-xl font-bold text-slate-900 dark:text-white">
              Subjects Covered
            </h3>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {subjects.map((subject) => (
                <span
                  key={subject}
                  className="rounded-full bg-teal-50 px-4 py-2 text-sm font-medium text-teal-800 dark:bg-teal-900/30 dark:text-teal-300"
                >
                  {subject}
                </span>
              ))}
            </div>

            <h3 className="mt-16 text-center text-xl font-bold text-slate-900 dark:text-white">
              Annual Holiday Activities
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-slate-600 dark:text-slate-400">
              No tuition fees for 2 months of annual holidays — instead, we
              teach valuable extra-curricular skills.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {activities.map((activity) => (
                <span
                  key={activity}
                  className="rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                >
                  {activity}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Online Classes */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <Eyebrow>Class On Air</Eyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Free Online Doubt-Clearing Sessions
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
                Every child gets live, one-on-one online sessions after
                tuition hours, at no extra cost — so no doubt goes
                unanswered.
              </p>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-stone-200/70 shadow-sm dark:border-slate-800">
                <Image
                  src="/coa.jpg"
                  alt="Live online class in session"
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-stone-200/70 shadow-sm dark:border-slate-800">
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
        <section id="why-us" className="bg-white py-20 dark:bg-slate-800">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <Eyebrow>Why Us</Eyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Why parents choose us
              </h2>
            </div>
            <div className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-stone-200 shadow-sm sm:grid-cols-2 lg:grid-cols-3 dark:bg-slate-700">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="group bg-white p-7 transition-colors hover:bg-teal-50/60 dark:bg-slate-800 dark:hover:bg-slate-900"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700 transition-colors group-hover:bg-teal-600 group-hover:text-white dark:bg-teal-900/40 dark:text-teal-300">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fees */}
        <section id="fees" className="py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center">
              <Eyebrow>Fee Structure</Eyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Simple, affordable, monthly
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">
                Payable before the 7th of every month.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {fees.map((row) =>
                row.highlight ? (
                  <div
                    key={row.grade}
                    className="flex flex-col rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 p-6 text-white shadow-lg shadow-teal-900/25 transition-transform hover:-translate-y-1"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-teal-100">
                      {row.sub}
                    </span>
                    <span className="mt-1 font-semibold text-white">
                      {row.grade}
                    </span>
                    <span className="mt-4 text-3xl font-extrabold">
                      ₹{row.amount}
                    </span>
                    <span className="text-xs text-teal-100">per month</span>
                  </div>
                ) : (
                  <div
                    key={row.grade}
                    className="flex flex-col rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {row.sub}
                    </span>
                    <span className="mt-1 font-semibold text-slate-900 dark:text-white">
                      {row.grade}
                    </span>
                    <span className="mt-4 text-3xl font-extrabold text-teal-700 dark:text-teal-300">
                      ₹{row.amount}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      per month
                    </span>
                  </div>
                ),
              )}
            </div>

            <ul className="mx-auto mt-10 grid max-w-2xl gap-3 text-sm text-slate-600 sm:grid-cols-2 dark:text-slate-400">
              {[
                "No extra fees for online doubt-clearing sessions.",
                "New joiners after the 15th of a month pay no fees for that month.",
                "Referral bonus available for all our children.",
                "No tuition fees during annual holidays (2 months).",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Timings */}
        <section id="timings" className="bg-white py-20 dark:bg-slate-800">
          <div className="mx-auto max-w-4xl px-6">
            <div className="text-center">
              <Eyebrow>Timings</Eyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Tuition Timings
              </h2>
            </div>
            <div className="mt-10 flex flex-col divide-y divide-stone-200 overflow-hidden rounded-2xl border border-stone-200 bg-stone-50/60 sm:flex-row sm:divide-x sm:divide-y-0 dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-900/40">
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
                <div key={t.label} className="flex-1 p-7 text-center">
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                    <Clock className="h-5 w-5" />
                  </span>
                  <div className="mt-3 font-semibold text-teal-700 dark:text-teal-300">
                    {t.label}
                  </div>
                  <div className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                    {t.value}
                  </div>
                  {t.sub && (
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-500">
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
          <div className="pointer-events-none absolute -bottom-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-teal-300/20 blur-3xl dark:bg-teal-500/10" />
          <div className="relative mx-auto max-w-4xl px-6">
            <div className="text-center">
              <Eyebrow>Contact</Eyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Visit or contact us
              </h2>
            </div>
            <div className="mt-10 grid overflow-hidden rounded-3xl border border-stone-200 shadow-sm sm:grid-cols-2 dark:border-slate-700">
              <div className="bg-gradient-to-br from-teal-600 to-emerald-600 p-8 text-white">
                <h3 className="font-semibold">Find Us</h3>
                <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-teal-50">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    49, Andiyappan Street, Near Supreme Mobiles Shop, West
                    Mambalam, T-Nagar, Chennai – 600033, Tamil Nadu
                  </span>
                </p>
                <p className="mt-4 flex items-center gap-2 text-sm text-teal-50">
                  <Phone className="h-4 w-4 shrink-0" />
                  <a href="tel:9789214998" className="font-semibold text-white">
                    97892 14998
                  </a>
                  <span>/</span>
                  <a href="tel:9790574321" className="font-semibold text-white">
                    97905 74321
                  </a>
                </p>
                <p className="mt-3 flex items-center gap-2 text-sm text-teal-50">
                  <Mail className="h-4 w-4 shrink-0" />
                  <a
                    href="mailto:thangamvarahituitionhub247365@gmail.com"
                    className="break-all font-semibold text-white"
                  >
                    thangamvarahituitionhub247365@gmail.com
                  </a>
                </p>
              </div>
              <div className="flex flex-col items-center justify-center gap-4 bg-white p-8 text-center dark:bg-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Ready to admit your child?
                </h3>
                <p className="max-w-xs text-sm text-slate-600 dark:text-slate-400">
                  Call us to ask about admission, or drop by the centre any
                  day during tuition hours.
                </p>
                <a
                  href="tel:9789214998"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-900/20 transition-transform hover:scale-[1.03]"
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
