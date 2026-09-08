"use client";

import { useActionState, useRef, useEffect } from "react";
import { submitStudentEnquiry } from "../../actions/enquiry";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white";
const errorInputClass =
  "border-red-400 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500/70";
const labelClass = "text-sm font-medium text-slate-700 dark:text-slate-200";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <p className="mt-1 text-xs text-red-600 dark:text-red-400">{messages[0]}</p>
  );
}

export default function NewEnquiryForm() {
  const [state, formAction, pending] = useActionState(submitStudentEnquiry, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const errors = state && "errors" in state ? state.errors : undefined;
  const formError = state && "formError" in state ? state.formError : undefined;
  const success = state && "success" in state;

  useEffect(() => {
    if (success) formRef.current?.reset();
  }, [success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800"
    >
      {formError && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {formError}
        </p>
      )}
      {success && (
        <p className="mb-4 rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
          Your enquiry has been submitted.
        </p>
      )}


      <label htmlFor="title" className={labelClass}>
        Title (e.g. Unit / Chapter name)
      </label>
      <input
        id="title"
        name="title"
        type="text"
        required
        placeholder="e.g. Algebra — Chapter 3"
        className={`${inputClass} ${errors?.title?.length ? errorInputClass : ""}`}
      />
      <FieldError messages={errors?.title} />

      <label htmlFor="subject" className={`mt-4 block ${labelClass}`}>
        Subject
      </label>
      <input
        id="subject"
        name="subject"
        type="text"
        required
        placeholder="e.g. Mathematics"
        className={`${inputClass} ${errors?.subject?.length ? errorInputClass : ""}`}
      />
      <FieldError messages={errors?.subject} />

      <label htmlFor="description" className={`mt-4 block ${labelClass}`}>
        Description
      </label>
      <textarea
        id="description"
        name="description"
        required
        rows={4}
        placeholder="Describe your doubt or question in detail"
        className={`${inputClass} resize-none ${errors?.description?.length ? errorInputClass : ""}`}
      />
      <FieldError messages={errors?.description} />

      <button
        type="submit"
        disabled={pending}
        className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-slate-700 to-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
      >
        {pending ? "Submitting…" : "Submit Enquiry"}
      </button>
    </form>
  );
}
