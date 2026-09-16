"use client";

import { useActionState, useRef, useEffect } from "react";
import { submitStudentEnquiry } from "@/app/actions/enquiry";
import { AdminCard, AdminButton } from "@/app/admin/_components/ui";
import { MessageSquare } from "@/app/components/icons";

const inputClass =
  "mt-1.5 block w-full rounded-2xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-xs font-semibold text-stone-900 outline-none transition-colors focus:border-yellow-400 focus:bg-white dark:border-stone-800 dark:bg-stone-900 dark:text-white dark:focus:border-yellow-400 dark:focus:bg-stone-900 [color-scheme:light] dark:[color-scheme:dark]";
const errorInputClass =
  "border-red-400 focus:border-red-500 dark:border-red-500";
const labelClass =
  "block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <p className="mt-1 text-[11px] font-semibold text-red-600 dark:text-red-400">{messages[0]}</p>
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
    <AdminCard className="p-6 sm:p-8">
      <form ref={formRef} action={formAction} className="space-y-4">
        {formError && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs font-bold text-red-600 dark:text-red-400">
            {formError}
          </div>
        )}
        {success && (
          <div className="rounded-2xl border border-yellow-400/30 bg-yellow-400/15 px-4 py-3 text-xs font-bold text-yellow-800 dark:text-yellow-300">
            Your enquiry has been submitted successfully.
          </div>
        )}

        <div>
          <label htmlFor="title" className={labelClass}>
            Title (e.g. Unit / Chapter Name)
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
        </div>

        <div>
          <label htmlFor="subject" className={labelClass}>
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
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            placeholder="Describe your doubt or question in detail..."
            className={`${inputClass} resize-none ${errors?.description?.length ? errorInputClass : ""}`}
          />
          <FieldError messages={errors?.description} />
        </div>

        <div className="pt-2">
          <AdminButton
            type="submit"
            disabled={pending}
            icon={MessageSquare}
            className="w-full"
          >
            {pending ? "Submitting…" : "Submit Enquiry"}
          </AdminButton>
        </div>
      </form>
    </AdminCard>
  );
}
