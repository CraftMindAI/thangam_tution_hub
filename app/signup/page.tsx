"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { CheckCircle, Eye, EyeOff, GraduationCap } from "../components/icons";
import { signUp } from "../actions/signup";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white";
const errorInputClass =
  "border-red-400 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500/70";
const labelClass = "text-sm font-medium text-slate-700 dark:text-slate-200";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{messages[0]}</p>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = true,
  errors,
  inputProps,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  errors?: string[];
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  return (
    <div className="mt-4">
      <label htmlFor={name} className={labelClass}>
        {label}
        {!required && (
          <span className="ml-1 text-xs font-normal text-slate-400">(optional)</span>
        )}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className={`${inputClass} ${errors?.length ? errorInputClass : ""}`}
        {...inputProps}
      />
      <FieldError messages={errors} />
    </div>
  );
}

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, pending] = useActionState(signUp, undefined);

  const errors = state && "errors" in state ? state.errors : undefined;
  const formError = state && "formError" in state ? state.formError : undefined;

  if (state && "success" in state) {
    return (
      <div className="flex flex-1 flex-col bg-stone-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
        <SiteHeader />
        <main className="flex flex-1 items-center justify-center px-6 py-16">
          <div className="w-full max-w-sm rounded-2xl border border-stone-200/70 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-800">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
              <CheckCircle className="h-6 w-6" />
            </span>
            <h1 className="mt-4 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Thank you!
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {state.needsConfirmation
                ? "Your account has been created and your details have been received. Please check your email to confirm your account before signing in."
                : "Your account has been created and your details have been received."}
            </p>
            <Link
              href="/signin"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-900/15 transition-transform hover:scale-[1.02]"
            >
              Go to Sign In
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-stone-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <SiteHeader />

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-900/10">
              <GraduationCap className="h-6 w-6" />
            </span>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Create Account
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Sign up to get started with Thangam Varahi Tuition Hub.
            </p>
          </div>

          <form
            action={formAction}
            className="mt-8 rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800"
          >
            {formError && (
              <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
                {formError}
              </p>
            )}

            <h2 className="text-sm font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              Account Details
            </h2>
            <Field label="Email" name="email" type="email" errors={errors?.email} />
            <div>
              <label htmlFor="password" className={`mt-4 block ${labelClass}`}>
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  placeholder="••••••••"
                  className={`${inputClass} pr-11 ${errors?.password?.length ? errorInputClass : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
              <FieldError messages={errors?.password} />
            </div>

            <div>
              <label htmlFor="confirmPassword" className={`mt-4 block ${labelClass}`}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="••••••••"
                className={`${inputClass} mt-1.5 ${
                  errors?.confirmPassword?.length ? errorInputClass : ""
                }`}
              />
              <FieldError messages={errors?.confirmPassword} />
            </div>

            <h2 className="mt-6 text-sm font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              Student Details
            </h2>
            <Field
              label="Name of the Student"
              name="student_name"
              errors={errors?.student_name}
            />
            <Field label="Class / Standard" name="standard" errors={errors?.standard} />
            <Field
              label="School Name"
              name="school_name"
              required={false}
              errors={errors?.school_name}
            />

            <h2 className="mt-6 text-sm font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              Parent Details
            </h2>
            <Field label="Parent's Name" name="parent_name" errors={errors?.parent_name} />
            <Field
              label="Parent's Phone Number"
              name="parent_phone"
              type="tel"
              errors={errors?.parent_phone}
              inputProps={{
                pattern: "[6-9][0-9]{9}",
                maxLength: 10,
                placeholder: "10-digit mobile number",
              }}
            />

            <button
              type="submit"
              disabled={pending}
              className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-900/15 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {pending ? "Creating…" : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-semibold text-teal-700 hover:underline dark:text-teal-400"
            >
              Sign In
            </Link>
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
