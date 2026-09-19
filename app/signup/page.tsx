"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { Blobs } from "../components/PlayfulUI";
import { CheckCircle, Eye, EyeOff, GraduationCap } from "../components/icons";
import { signUp } from "../actions/signup";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 dark:border-stone-600 dark:bg-stone-950 dark:text-white";
const errorInputClass =
  "border-yellow-400 focus:border-yellow-500 focus:ring-yellow-500/20 dark:border-yellow-500/70";
const labelClass = "text-sm font-medium text-stone-700 dark:text-stone-200";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-400">
      {messages[0]}
    </p>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = true,
  errors,
  inputProps,
  span = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  errors?: string[];
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  /** Span both columns of the two-up field grid instead of sharing a row. */
  span?: boolean;
}) {
  return (
    <div className={span ? "sm:col-span-2" : undefined}>
      <label htmlFor={name} className={labelClass}>
        {label}
        {!required && (
          <span className="ml-1 text-xs font-normal text-stone-400">
            (optional)
          </span>
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
          <Blobs variant="compact" />
          <div className="relative w-full max-w-sm rounded-[2rem] bg-white p-8 text-center shadow-lg dark:bg-stone-800">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-yellow-500 text-stone-900 shadow-md">
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
              className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 px-6 py-2.5 text-sm font-semibold text-stone-900 shadow-md transition-transform hover:scale-[1.02]"
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
        <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-xl md:grid-cols-2 dark:bg-stone-800">
          <div className="relative hidden flex-col items-center justify-center bg-gradient-to-br from-yellow-300 to-yellow-500 p-8 md:flex">
            <div className="relative aspect-square w-full max-w-[360px] overflow-hidden rounded-2xl">
              <Image
                src="/signup_illustration_yellow.png"
                alt="Illustration of a student creating a new account"
                fill
                priority
                className="object-cover scale-125"
              />
            </div>
            <p className="mt-6 text-center text-sm font-semibold text-stone-900/80">
              Sign up to get started with Thangam Varahi Tuition Hub.
            </p>
          </div>

          <div className="p-6 sm:p-10">
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-yellow-500 text-stone-900 shadow-md md:hidden">
                <GraduationCap className="h-6 w-6" />
              </span>
              <h1 className="mt-4 text-2xl font-bold tracking-tight text-stone-900 md:mt-0 dark:text-white">
                Create Account
              </h1>
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                Sign up to get started with Thangam Varahi Tuition Hub.
              </p>
            </div>

            <form action={formAction} className="mt-6">
              {formError && (
                <p className="mb-4 rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                  {formError}
                </p>
              )}

              <h2 className="text-sm font-semibold uppercase tracking-wider text-yellow-700 dark:text-yellow-400">
                Account Details
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  errors={errors?.email}
                  span
                />

                <div>
                  <label htmlFor="password" className={labelClass}>
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
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
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
                  <label htmlFor="confirmPassword" className={labelClass}>
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
                    className={`${inputClass} ${
                      errors?.confirmPassword?.length ? errorInputClass : ""
                    }`}
                  />
                  <FieldError messages={errors?.confirmPassword} />
                </div>
              </div>

              <h2 className="mt-6 text-sm font-semibold uppercase tracking-wider text-yellow-700 dark:text-yellow-400">
                Student Details
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <Field
                  label="Name of the Student"
                  name="student_name"
                  errors={errors?.student_name}
                />
                <Field
                  label="Class / Standard"
                  name="standard"
                  errors={errors?.standard}
                />
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
              </div>

              <h2 className="mt-6 text-sm font-semibold uppercase tracking-wider text-yellow-700 dark:text-yellow-400">
                Parent Details
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <Field
                  label="Parent's Name"
                  name="parent_name"
                  errors={errors?.parent_name}
                />
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
                  span
                />
              </div>

              <button
                type="submit"
                disabled={pending}
                className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 px-4 py-2.5 text-sm font-semibold text-stone-900 shadow-md transition-transform hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-60"
              >
                {pending ? "Creating…" : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-stone-600 md:text-left dark:text-stone-400">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-semibold text-yellow-700 hover:underline dark:text-yellow-400"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
