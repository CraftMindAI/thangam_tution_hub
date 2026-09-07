"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { BookOpen, CheckCircle, GraduationCap, Users } from "../components/icons";
import { signUp } from "../actions/signup";

type Role = "existing_student" | "new_student";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white";
const errorInputClass =
  "border-red-400 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500/70";
const labelClass = "text-sm font-medium text-slate-700 dark:text-slate-200";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

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
  const [role, setRole] = useState<Role | null>(null);
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
                ? "Your details have been received. Please check your email to confirm your account before signing in."
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
              Tell us a little about yourself to get started.
            </p>
          </div>

          {!role ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setRole("existing_student")}
                className="flex flex-col items-center gap-3 rounded-2xl border border-stone-200/70 bg-white p-6 text-center shadow-sm transition-colors hover:border-teal-500 dark:border-slate-800 dark:bg-slate-800 dark:hover:border-teal-500"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                  <BookOpen className="h-5 w-5" />
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  I&apos;m an Existing Student
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Already attending Thangam Varahi Tuition Hub
                </span>
              </button>
              <button
                type="button"
                onClick={() => setRole("new_student")}
                className="flex flex-col items-center gap-3 rounded-2xl border border-stone-200/70 bg-white p-6 text-center shadow-sm transition-colors hover:border-teal-500 dark:border-slate-800 dark:bg-slate-800 dark:hover:border-teal-500"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                  <Users className="h-5 w-5" />
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  I&apos;m a New Student
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Interested in joining us
                </span>
              </button>
            </div>
          ) : (
            <form
              action={formAction}
              className="mt-8 rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800"
            >
              <input type="hidden" name="role" value={role} />

              {formError && (
                <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
                  {formError}
                </p>
              )}

              <h2 className="text-sm font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                Account Details
              </h2>
              <Field label="Email" name="email" type="email" errors={errors?.email} />
              <Field
                label="Password"
                name="password"
                type="password"
                errors={errors?.password}
                inputProps={{ minLength: 8 }}
              />

              {role === "existing_student" ? (
                <>
                  <h2 className="mt-6 text-sm font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                    Existing Student Details
                  </h2>
                  <Field
                    label="Name of the Student"
                    name="student_name"
                    errors={errors?.student_name}
                  />
                  <Field
                    label="Parent's Name"
                    name="parent_name"
                    errors={errors?.parent_name}
                  />
                  <Field
                    label="Parent's Contact Number"
                    name="parent_contact"
                    type="tel"
                    errors={errors?.parent_contact}
                    inputProps={{
                      pattern: "[6-9][0-9]{9}",
                      maxLength: 10,
                      placeholder: "10-digit mobile number",
                    }}
                  />
                  <Field
                    label="Standard of Studying"
                    name="standard"
                    errors={errors?.standard}
                  />
                  <Field label="Subject" name="subject" errors={errors?.subject} />
                  <Field
                    label="Chapter / Unit (Name)"
                    name="chapter_unit"
                    errors={errors?.chapter_unit}
                  />

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="expected_class_date" className={labelClass}>
                        Expected Class Date
                      </label>
                      <input
                        id="expected_class_date"
                        name="expected_class_date"
                        type="date"
                        required
                        min={todayStr()}
                        className={`${inputClass} ${
                          errors?.expected_class_date?.length ? errorInputClass : ""
                        }`}
                      />
                      <FieldError messages={errors?.expected_class_date} />
                    </div>
                    <div>
                      <label htmlFor="expected_class_time" className={labelClass}>
                        Expected Class Time
                      </label>
                      <input
                        id="expected_class_time"
                        name="expected_class_time"
                        type="time"
                        required
                        className={`${inputClass} ${
                          errors?.expected_class_time?.length ? errorInputClass : ""
                        }`}
                      />
                      <FieldError messages={errors?.expected_class_time} />
                    </div>
                  </div>

                  <h2 className="mt-6 text-sm font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                    Feedback
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Please rate our classes so we can keep improving.
                  </p>
                  <div className="mt-3 space-y-2">
                    {[
                      { value: "not_satisfied", label: "Not Satisfied (Need to Improve more)" },
                      { value: "somewhat_good", label: "Some What Good — partially ok" },
                      { value: "excellent", label: "Excellent" },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className="flex items-center gap-2.5 rounded-lg border border-stone-200 px-3.5 py-2.5 text-sm text-slate-700 hover:border-teal-400 dark:border-slate-700 dark:text-slate-200"
                      >
                        <input
                          type="radio"
                          name="feedback_rating"
                          value={opt.value}
                          className="accent-teal-600"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                  <FieldError messages={errors?.feedback_rating} />
                </>
              ) : (
                <>
                  <h2 className="mt-6 text-sm font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                    New Student Enquiry
                  </h2>
                  <Field
                    label="Name of the Contacted Person"
                    name="contact_person_name"
                    errors={errors?.contact_person_name}
                  />
                  <Field
                    label="Relationship with Student"
                    name="relationship_with_student"
                    errors={errors?.relationship_with_student}
                  />
                  <Field
                    label="Name of the Student"
                    name="new_student_name"
                    errors={errors?.new_student_name}
                  />
                  <Field
                    label="Standard of Studying"
                    name="new_standard"
                    errors={errors?.new_standard}
                  />
                  <Field
                    label="Reaching Contact Person Name (Again)"
                    name="followup_contact_name"
                    errors={errors?.followup_contact_name}
                  />
                  <Field
                    label="Reaching Contact Person Number (Again)"
                    name="followup_contact_number"
                    type="tel"
                    errors={errors?.followup_contact_number}
                    inputProps={{
                      pattern: "[6-9][0-9]{9}",
                      maxLength: 10,
                      placeholder: "10-digit mobile number",
                    }}
                  />

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="meeting_date" className={labelClass}>
                        Meeting Date
                      </label>
                      <input
                        id="meeting_date"
                        name="meeting_date"
                        type="date"
                        required
                        min={todayStr()}
                        className={`${inputClass} ${
                          errors?.meeting_date?.length ? errorInputClass : ""
                        }`}
                      />
                      <FieldError messages={errors?.meeting_date} />
                    </div>
                    <div>
                      <label htmlFor="meeting_time" className={labelClass}>
                        Meeting Time
                      </label>
                      <input
                        id="meeting_time"
                        name="meeting_time"
                        type="time"
                        required
                        className={`${inputClass} ${
                          errors?.meeting_time?.length ? errorInputClass : ""
                        }`}
                      />
                      <FieldError messages={errors?.meeting_time} />
                    </div>
                  </div>
                </>
              )}

              <div className="mt-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRole(null)}
                  className="rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-teal-600 hover:text-teal-700 dark:border-slate-700 dark:text-slate-200"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-900/15 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                >
                  {pending ? "Submitting…" : "Create Account"}
                </button>
              </div>
            </form>
          )}

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
