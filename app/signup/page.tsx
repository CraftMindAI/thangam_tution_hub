"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { Eyebrow } from "../components/PlayfulUI";
import { CheckCircle, Eye, EyeOff, GraduationCap } from "../components/icons";
import { signUp } from "../actions/signup";

const inputClass =
  "mt-1.5 w-full rounded-xl border-2 border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 dark:border-stone-700 dark:bg-stone-900 dark:text-white";
const errorInputClass =
  "border-yellow-400 focus:border-yellow-500 focus:ring-yellow-500/20 dark:border-yellow-500/70";
const labelClass = "text-sm font-bold text-stone-700 dark:text-stone-200";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-400">{messages[0]}</p>
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
          <span className="ml-1 text-xs font-normal text-stone-400">(optional)</span>
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
      <div className="flex flex-1 flex-col bg-white text-stone-900 dark:bg-stone-900 dark:text-stone-100">
        <SiteHeader />
        <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-16">
          <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-yellow-300/25 blur-3xl dark:bg-yellow-500/10" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-yellow-200/25 blur-3xl dark:bg-yellow-600/10" />
          <div className="relative w-full max-w-sm rounded-3xl border-2 border-stone-900 bg-white p-8 text-center shadow-[5px_5px_0_0_#1c1917] dark:border-stone-600 dark:bg-stone-800">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-stone-900 bg-yellow-400 text-stone-900 dark:border-stone-600">
              <CheckCircle className="h-6 w-6" />
            </span>
            <h1 className="mt-4 text-xl font-bold tracking-tight text-stone-900 dark:text-white">
              Thank you!
            </h1>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
              {state.needsConfirmation
                ? "Your account has been created and your details have been received. Please check your email to confirm your account before signing in."
                : "Your account has been created and your details have been received."}
            </p>
            <Link
              href="/signin"
              className="mt-6 inline-flex items-center justify-center rounded-full border-2 border-stone-900 bg-yellow-400 px-6 py-2.5 text-sm font-bold text-stone-900 shadow-[4px_4px_0_0_#1c1917] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:bg-yellow-300 hover:shadow-[6px_6px_0_0_#1c1917]"
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
    <div className="flex flex-1 flex-col bg-white text-stone-900 dark:bg-stone-900 dark:text-stone-100">
      <SiteHeader />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-16">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-yellow-300/25 blur-3xl dark:bg-yellow-500/10" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-yellow-200/25 blur-3xl dark:bg-yellow-600/10" />

        <div className="relative w-full max-w-lg">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-stone-900 bg-yellow-400 text-stone-900 dark:border-stone-600">
              <GraduationCap className="h-6 w-6" />
            </span>
            <div className="mt-4">
              <Eyebrow>Student Portal</Eyebrow>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
              Create Account
            </h1>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
              Sign up to get started with Thangam Varahi Tuition Hub.
            </p>
          </div>

          <form
            action={formAction}
            className="mt-8 rounded-3xl border-2 border-stone-900 bg-white p-6 shadow-[5px_5px_0_0_#1c1917] dark:border-stone-600 dark:bg-stone-800"
          >
            {formError && (
              <p className="mb-4 rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                {formError}
              </p>
            )}

            <h2 className="text-sm font-semibold uppercase tracking-wider text-yellow-700 dark:text-yellow-400">
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
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
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

            <h2 className="mt-6 text-sm font-semibold uppercase tracking-wider text-yellow-700 dark:text-yellow-400">
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
            <Field
              label="Location"
              name="location"
              errors={errors?.location}
              inputProps={{ placeholder: "Area / locality" }}
            />

            <h2 className="mt-6 text-sm font-semibold uppercase tracking-wider text-yellow-700 dark:text-yellow-400">
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
            <Field
              label="Parent's Email"
              name="parent_email"
              type="email"
              required={false}
              errors={errors?.parent_email}
            />

            <button
              type="submit"
              disabled={pending}
              className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-full border-2 border-stone-900 bg-yellow-400 px-4 py-2.5 text-sm font-bold text-stone-900 shadow-[4px_4px_0_0_#1c1917] transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:bg-yellow-300 hover:shadow-[6px_6px_0_0_#1c1917] disabled:pointer-events-none disabled:opacity-60"
            >
              {pending ? "Creating…" : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-600 dark:text-stone-400">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-semibold text-yellow-700 hover:underline dark:text-yellow-400"
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
