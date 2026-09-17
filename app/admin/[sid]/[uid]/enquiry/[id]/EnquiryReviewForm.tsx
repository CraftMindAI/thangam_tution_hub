"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  acceptEnquiryProposal,
  rejectEnquiry,
  scheduleEnquiryMeeting,
} from "@/app/actions/enquiries";
import { AdminCard, AdminButton } from "../../_components/ui";
import { X } from "@/app/components/icons";
import {
  ENQUIRY_MIN_DURATION_MINUTES,
  ENQUIRY_MAX_DURATION_MINUTES,
  ENQUIRY_REJECTION_REASONS,
  formatEnquiryDate,
  formatTimeLabel,
  type EnquiryStatus,
} from "@/app/lib/enquiries";
import TimePicker12h from "./TimePicker12h";

const inputClass =
  "mt-1.5 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-xs font-semibold text-stone-900 outline-none placeholder:text-stone-400 focus:border-yellow-400 focus:bg-white dark:border-stone-800 dark:bg-stone-900 dark:text-white dark:focus:border-yellow-400 dark:focus:bg-stone-900 [color-scheme:light] dark:[color-scheme:dark] transition-colors";
const labelClass =
  "block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400";

type EnquiryDetail = {
  id: string;
  status: EnquiryStatus;
  admin_duration_minutes: number | null;
  payment_amount: number | null;
  proposed_date: string | null;
  suggested_times: string[];
  chosen_time: string | null;
  admin_note: string | null;
};

function ConflictModal({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-3xl border border-stone-200 bg-white p-6 shadow-2xl dark:border-stone-800 dark:bg-stone-900">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-xl p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15 text-red-600 dark:text-red-400 text-2xl font-black">
            !
          </div>
          <p className="mt-4 text-base font-extrabold text-stone-900 dark:text-white">
            Schedule Conflict
          </p>
          <p className="mt-1.5 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            {message}
          </p>
          <AdminButton type="button" size="sm" className="mt-5" onClick={onClose}>
            Choose Other Timing
          </AdminButton>
        </div>
      </div>
    </div>
  );
}

function AcceptForm({ enquiryId }: { enquiryId: string }) {
  const [state, formAction, pending] = useActionState(acceptEnquiryProposal, undefined);
  const [conflictDismissed, setConflictDismissed] = useState(false);
  const conflict =
    state && "error" in state && "conflict" in state && state.conflict && !conflictDismissed
      ? state.error
      : null;

  return (
    <AdminCard className="p-6">
      <h2 className="text-sm font-extrabold uppercase tracking-wider text-stone-900 dark:text-yellow-400">
        Accept &amp; Send Proposal
      </h2>

      {state && "error" in state && !state.conflict && (
        <div className="mt-3 rounded-2xl bg-red-500/10 border border-red-500/20 p-3 text-xs font-bold text-red-600 dark:text-red-400">
          {state.error}
        </div>
      )}
      {state && "success" in state && (
        <div className="mt-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 p-3 text-xs font-bold text-emerald-700 dark:text-emerald-300">
          {state.message}
        </div>
      )}

      <form action={formAction} className="mt-4 space-y-4">
        <input type="hidden" name="enquiry_id" value={enquiryId} />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Class Duration (minutes)
            <input
              name="admin_duration_minutes"
              type="number"
              required
              min={ENQUIRY_MIN_DURATION_MINUTES}
              max={ENQUIRY_MAX_DURATION_MINUTES}
              step={5}
              defaultValue={60}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Payment Amount (₹)
            <input
              name="payment_amount"
              type="number"
              required
              min={1}
              step="0.01"
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Class Date
            <input name="proposed_date" type="date" required className={inputClass} />
          </label>
        </div>

        <div>
          <p className={labelClass}>Suggest up to 3 times</p>
          <div className="mt-1.5 grid gap-3 sm:grid-cols-3">
            <TimePicker12h name="time_1" required />
            <TimePicker12h name="time_2" />
            <TimePicker12h name="time_3" />
          </div>
        </div>

        <label className={labelClass}>
          Note to Student (optional)
          <textarea name="admin_note" rows={2} className={inputClass} />
        </label>

        <AdminButton type="submit" loading={pending}>
          Send Proposal
        </AdminButton>
      </form>

      {conflict && (
        <ConflictModal message={conflict} onClose={() => setConflictDismissed(true)} />
      )}
    </AdminCard>
  );
}

function RejectForm({ enquiryId }: { enquiryId: string }) {
  const [state, formAction, pending] = useActionState(rejectEnquiry, undefined);
  const [reason, setReason] = useState<string>(ENQUIRY_REJECTION_REASONS[0]);
  const isOther = reason === "Other";

  return (
    <AdminCard className="p-6">
      <h2 className="text-sm font-extrabold uppercase tracking-wider text-stone-900 dark:text-white">
        Reject Enquiry
      </h2>

      {state && "error" in state && (
        <div className="mt-3 rounded-2xl bg-red-500/10 border border-red-500/20 p-3 text-xs font-bold text-red-600 dark:text-red-400">
          {state.error}
        </div>
      )}
      {state && "success" in state && (
        <div className="mt-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 p-3 text-xs font-bold text-emerald-700 dark:text-emerald-300">
          {state.message}
        </div>
      )}

      <form action={formAction} className="mt-4 space-y-4">
        <input type="hidden" name="enquiry_id" value={enquiryId} />
        <label className={labelClass}>
          Reason (shown to the student)
          <select
            name="reason"
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={inputClass}
          >
            {ENQUIRY_REJECTION_REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>

        {isOther && (
          <label className={labelClass}>
            Custom Reason
            <textarea name="admin_note" required rows={2} className={inputClass} />
          </label>
        )}

        <AdminButton type="submit" variant="danger" loading={pending}>
          Reject
        </AdminButton>
      </form>
    </AdminCard>
  );
}

function ScheduleForm({ enquiry }: { enquiry: EnquiryDetail }) {
  const [state, formAction, pending] = useActionState(scheduleEnquiryMeeting, undefined);
  return (
    <AdminCard className="p-6">
      <h2 className="text-sm font-extrabold uppercase tracking-wider text-stone-900 dark:text-yellow-400">
        Schedule the Class
      </h2>
      <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
        Confirm the final date/time — defaults to what the student paid for.
      </p>

      {state && "error" in state && (
        <div className="mt-3 rounded-2xl bg-red-500/10 border border-red-500/20 p-3 text-xs font-bold text-red-600 dark:text-red-400">
          {state.error}
        </div>
      )}
      {state && "success" in state && (
        <div className="mt-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 p-3 text-xs font-bold text-emerald-700 dark:text-emerald-300">
          {state.message}
        </div>
      )}

      <form action={formAction} className="mt-4 grid gap-4 sm:grid-cols-2">
        <input type="hidden" name="enquiry_id" value={enquiry.id} />
        <label className={labelClass}>
          Date
          <input
            name="date"
            type="date"
            required
            defaultValue={enquiry.proposed_date ?? ""}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Time
          <input
            name="time"
            type="time"
            required
            defaultValue={enquiry.chosen_time ?? ""}
            className={inputClass}
          />
        </label>
        <div className="sm:col-span-2">
          <AdminButton type="submit" loading={pending}>
            Schedule Meeting
          </AdminButton>
        </div>
      </form>
    </AdminCard>
  );
}

export default function EnquiryReviewForm({
  enquiry,
  callId,
}: {
  enquiry: EnquiryDetail;
  callId: string | null;
}) {
  if (enquiry.status === "requested") {
    return (
      <div className="space-y-6">
        <AcceptForm enquiryId={enquiry.id} />
        <RejectForm enquiryId={enquiry.id} />
      </div>
    );
  }

  if (enquiry.status === "reviewed") {
    return (
      <AdminCard className="p-6 space-y-2 text-sm">
        <p className="font-bold text-stone-900 dark:text-white">Proposal sent to the student.</p>
        <p className="text-stone-600 dark:text-stone-300">
          Duration: {enquiry.admin_duration_minutes} min · Amount: ₹{enquiry.payment_amount} ·
          Date: {enquiry.proposed_date ? formatEnquiryDate(enquiry.proposed_date) : "—"}
        </p>
        <p className="text-stone-600 dark:text-stone-300">
          Suggested times: {enquiry.suggested_times.map(formatTimeLabel).join(", ")}
        </p>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Waiting for the student to pick a time and pay.
        </p>
      </AdminCard>
    );
  }

  if (enquiry.status === "rejected") {
    return (
      <AdminCard className="p-6 text-sm">
        <p className="font-bold text-stone-900 dark:text-white">Enquiry rejected.</p>
        <p className="mt-1 text-stone-600 dark:text-stone-300">Reason: {enquiry.admin_note}</p>
      </AdminCard>
    );
  }

  if (enquiry.status === "paid") {
    return <ScheduleForm enquiry={enquiry} />;
  }

  return (
    <AdminCard className="p-6 space-y-2 text-sm">
      <p className="font-bold text-stone-900 dark:text-white">Class scheduled.</p>
      <p className="text-stone-600 dark:text-stone-300">
        {enquiry.chosen_time ? formatTimeLabel(enquiry.chosen_time) : ""} on{" "}
        {enquiry.proposed_date ? formatEnquiryDate(enquiry.proposed_date) : "—"}
      </p>
      {callId && (
        <Link
          href={`/admin/meeting/${callId}`}
          target="_blank"
          className="inline-block text-xs font-bold text-yellow-700 dark:text-yellow-400 hover:underline"
        >
          Open meeting link →
        </Link>
      )}
    </AdminCard>
  );
}
