import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { GraduationCap } from "../components/icons";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default function ForgotPassword() {
  return (
    <div className="flex flex-1 flex-col bg-stone-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <SiteHeader />

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-900/10">
              <GraduationCap className="h-6 w-6" />
            </span>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Forgot Password
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Enter your email and we&apos;ll send you a link to reset your
              password.
            </p>
          </div>

          <ForgotPasswordForm />

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Remembered your password?{" "}
            <Link
              href="/signin"
              className="font-semibold text-teal-700 hover:underline dark:text-teal-400"
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
