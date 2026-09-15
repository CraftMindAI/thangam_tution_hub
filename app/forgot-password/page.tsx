import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { Eyebrow } from "../components/PlayfulUI";
import { GraduationCap } from "../components/icons";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default function ForgotPassword() {
  return (
    <div className="flex flex-1 flex-col bg-white text-stone-900 dark:bg-stone-900 dark:text-stone-100">
      <SiteHeader />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-16">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-yellow-300/25 blur-3xl dark:bg-yellow-500/10" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-yellow-200/25 blur-3xl dark:bg-yellow-600/10" />

        <div className="relative w-full max-w-sm">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-stone-900 bg-yellow-400 text-stone-900 dark:border-stone-600">
              <GraduationCap className="h-6 w-6" />
            </span>
            <div className="mt-4">
              <Eyebrow>Student Portal</Eyebrow>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
              Forgot Password
            </h1>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
              Enter your email and we&apos;ll send you a link to reset your
              password.
            </p>
          </div>

          <ForgotPasswordForm />

          <p className="mt-6 text-center text-sm text-stone-600 dark:text-stone-400">
            Remembered your password?{" "}
            <Link
              href="/signin"
              className="font-semibold text-yellow-700 hover:underline dark:text-yellow-400"
            >
              Back to Sign In
            </Link>
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
