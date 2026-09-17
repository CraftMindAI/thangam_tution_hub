"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  deleteStudentEnquiry,
  updateStudentEnquiry,
} from "@/app/actions/enquiry";
import { AdminCard, AdminBadge, AdminButton } from "@/app/admin/_components/ui";
import { Eye, Pencil, X } from "@/app/components/icons";
import {
  ENQUIRY_STATUS_LABELS,
  formatEnquiryDate,
  formatTimeLabel,
  type StudentEnquiry,
} from "@/app/lib/enquiries";
import { studentBase } from "@/app/student/_lib/nav";

const statusBadgeVariant: Record<
  StudentEnquiry["status"],
  "outline" | "warning" | "gray" | "success" | "dark"
> = {
  requested: "outline",
  reviewed: "warning",
  rejected: "gray",
  paid: "success",
  scheduled: "dark",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const inputClass =
  "mt-1.5 block w-full rounded-2xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-xs font-semibold text-stone-900 outline-none transition-colors focus:border-yellow-400 focus:bg-white dark:border-stone-800 dark:bg-stone-900 dark:text-white dark:focus:border-yellow-400 dark:focus:bg-stone-900 [color-scheme:light] dark:[color-scheme:dark]";
const labelClass =
  "block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400";

function EditEnquiryForm({
  enquiry,
  onDone,
}: {
  enquiry: StudentEnquiry;
  onDone: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    updateStudentEnquiry,
    undefined
  );
  const errors = state && "errors" in state ? state.errors : undefined;
  const formError = state && "formError" in state ? state.formError : undefined;
  const success = state && "success" in state;

  useEffect(() => {
    if (success) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  return (
    <form action={formAction} className="mt-4 space-y-3">
      <input type="hidden" name="enquiry_id" value={enquiry.id} />
      {formError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs font-bold text-red-600 dark:text-red-400">
          {formError}
        </div>
      )}

      <div>
        <label className={labelClass}>Title</label>
        <input
          name="title"
          type="text"
          required
          defaultValue={enquiry.title}
          className={inputClass}
        />
        {errors?.title?.[0] && (
          <p className="mt-1 text-[11px] font-semibold text-red-600 dark:text-red-400">
            {errors.title[0]}
          </p>
        )}
      </div>

      <div>
        <label className={labelClass}>Subject</label>
        <input
          name="subject"
          type="text"
          required
          defaultValue={enquiry.subject}
          className={inputClass}
        />
        {errors?.subject?.[0] && (
          <p className="mt-1 text-[11px] font-semibold text-red-600 dark:text-red-400">
            {errors.subject[0]}
          </p>
        )}
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          name="description"
          required
          rows={3}
          defaultValue={enquiry.description}
          className={`${inputClass} resize-none`}
        />
        {errors?.description?.[0] && (
          <p className="mt-1 text-[11px] font-semibold text-red-600 dark:text-red-400">
            {errors.description[0]}
          </p>
        )}
      </div>

      <div>
        <label className={labelClass}>Duration Needed (minutes)</label>
        <input
          name="duration_requested_minutes"
          type="number"
          required
          min={40}
          max={90}
          step={5}
          defaultValue={enquiry.duration_requested_minutes ?? 60}
          className={inputClass}
        />
        {errors?.duration_requested_minutes?.[0] && (
          <p className="mt-1 text-[11px] font-semibold text-red-600 dark:text-red-400">
            {errors.duration_requested_minutes[0]}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <AdminButton type="button" variant="outline" size="sm" onClick={onDone}>
          Cancel
        </AdminButton>
        <AdminButton type="submit" size="sm" loading={pending}>
          Save Changes
        </AdminButton>
      </div>
    </form>
  );
}

export default function EnquiryCard({ enquiry: e }: { enquiry: StudentEnquiry }) {
  const [editing, setEditing] = useState(false);
  const pathname = usePathname();
  const base = studentBase(pathname);

  return (
    <AdminCard className="p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base font-extrabold text-stone-900 dark:text-white">
            {e.title}
          </p>
          <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
            {e.subject} · Submitted {formatDateTime(e.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AdminBadge variant={statusBadgeVariant[e.status]}>
            {ENQUIRY_STATUS_LABELS[e.status]}
          </AdminBadge>
          {e.status === "requested" && !editing && (
            <>
              <button
                type="button"
                onClick={() => setEditing(true)}
                aria-label="Edit enquiry"
                className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-white"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <form action={deleteStudentEnquiry}>
                <input type="hidden" name="enquiry_id" value={e.id} />
                <button
                  type="submit"
                  aria-label="Delete enquiry"
                  className="rounded-xl p-1.5 text-stone-400 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {editing ? (
        <EditEnquiryForm enquiry={e} onDone={() => setEditing(false)} />
      ) : (
        <>
          <p className="mt-3 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            {e.description}
          </p>
          {e.duration_requested_minutes && (
            <p className="mt-1 text-[11px] text-stone-500 dark:text-stone-400">
              Requested duration: {e.duration_requested_minutes} minutes
            </p>
          )}

          {e.status === "requested" && (
            <div className="mt-4 rounded-2xl bg-stone-100 dark:bg-stone-800/60 px-4 py-3 text-xs font-semibold text-stone-600 dark:text-stone-300">
              Waiting for admin review.
            </div>
          )}

          {e.status === "rejected" && (
            <div className="mt-4 rounded-2xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs font-semibold text-red-700 dark:text-red-300">
              {e.admin_note || "This enquiry could not be taken forward."}
            </div>
          )}

          {e.status === "reviewed" && (
            <Link
              href={`${base}/enquiry/${e.id}`}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-yellow-400/15 px-4 py-2 text-xs font-bold text-yellow-700 hover:bg-yellow-400/25 dark:text-yellow-400"
            >
              <Eye className="h-3.5 w-3.5" />
              View Proposal
            </Link>
          )}

          {e.status === "paid" && (
            <div className="mt-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              Payment received for{" "}
              {e.chosen_time ? formatTimeLabel(e.chosen_time) : "your chosen time"} on{" "}
              {e.proposed_date ? formatEnquiryDate(e.proposed_date) : "—"}. Waiting for
              the admin to schedule your class.
            </div>
          )}

          {e.status === "scheduled" && (
            <div className="mt-4 rounded-2xl bg-stone-900 text-white dark:bg-stone-800 px-4 py-3 text-xs font-semibold">
              Your class is scheduled for{" "}
              {e.chosen_time ? formatTimeLabel(e.chosen_time) : ""} on{" "}
              {e.proposed_date ? formatEnquiryDate(e.proposed_date) : "—"}. Check
              Meetings for the details.
            </div>
          )}
        </>
      )}
    </AdminCard>
  );
}
