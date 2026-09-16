"use client";

import { useActionState, useRef, useEffect } from "react";
import { submitStudentEnquiry } from "@/app/actions/enquiry";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-500/20 dark:border-stone-700 dark:bg-stone-900 dark:text-white";
const errorInputClass =
  "border-yellow-400 focus:border-yellow-500 focus:ring-yellow-500/20 dark:border-yellow-500/70";
const labelClass = "text-sm font-medium text-stone-700 dark:text-stone-200";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-400">{messages[0]}</p>
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
      className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-800"
    >
      {formError && (
        <p className="mb-4 rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
          {formError}
        </p>
      )}
      {success && (
        <p className="mb-4 rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
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
        className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-stone-700 to-stone-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-stone-900/20 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
      >
        {pending ? "Submitting…" : "Submit Enquiry"}
      </button>
    </form>
  );
}
