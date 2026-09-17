"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminCard, AdminBadge } from "@/app/admin/_components/ui";
import {
  ENQUIRY_STATUS_LABELS,
  formatEnquiryDate,
  formatTimeLabel,
  type StudentEnquiry,
} from "@/app/lib/enquiries";
import PaymentModal from "../PaymentModal";

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

export default function EnquiryDetailView({ enquiry: e }: { enquiry: StudentEnquiry }) {
  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  return (
    <div className="space-y-6">
      <AdminCard className="p-6 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Status
          </p>
          <AdminBadge variant={statusBadgeVariant[e.status]}>
            {ENQUIRY_STATUS_LABELS[e.status]}
          </AdminBadge>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Description
          </p>
          <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
            {e.description}
          </p>
        </div>
        {e.duration_requested_minutes && (
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Requested Duration
            </p>
            <p className="text-sm font-bold text-stone-900 dark:text-white">
              {e.duration_requested_minutes} minutes
            </p>
          </div>
        )}
      </AdminCard>

      {e.status === "requested" && (
        <AdminCard className="p-6 text-sm font-semibold text-stone-600 dark:text-stone-300">
          Waiting for admin review.
        </AdminCard>
      )}

      {e.status === "rejected" && (
        <AdminCard className="p-6">
          <p className="text-sm font-bold text-stone-900 dark:text-white">Enquiry rejected</p>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">
            {e.admin_note || "This enquiry could not be taken forward."}
          </p>
        </AdminCard>
      )}

      {e.status === "reviewed" && (
        <AdminCard className="p-6">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-stone-900 dark:text-yellow-400">
            Proposal
          </h2>

          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <p>
              <span className="text-stone-500 dark:text-stone-400">Duration: </span>
              <span className="font-bold text-stone-900 dark:text-white">
                {e.admin_duration_minutes} minutes
              </span>
            </p>
            <p>
              <span className="text-stone-500 dark:text-stone-400">Amount: </span>
              <span className="font-bold text-stone-900 dark:text-white">
                ₹{e.payment_amount}
              </span>
            </p>
            <p className="sm:col-span-2">
              <span className="text-stone-500 dark:text-stone-400">Date: </span>
              <span className="font-bold text-stone-900 dark:text-white">
                {e.proposed_date ? formatEnquiryDate(e.proposed_date) : "—"}
              </span>
            </p>
          </div>
          {e.admin_note && (
            <p className="mt-3 text-xs text-stone-600 dark:text-stone-300">
              Note: {e.admin_note}
            </p>
          )}

          <p className="mt-6 text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Choose a class time
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {e.suggested_times.map((t) => (
              <label
                key={t}
                className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs font-bold transition-colors ${
                  selectedTime === t
                    ? "border-yellow-400 bg-yellow-400 text-stone-950"
                    : "border-stone-300 text-stone-600 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
                }`}
              >
                <input
                  type="radio"
                  name="chosen-time"
                  value={t}
                  className="sr-only"
                  checked={selectedTime === t}
                  onChange={() => setSelectedTime(t)}
                />
                {formatTimeLabel(t)}
              </label>
            ))}
          </div>

          <button
            type="button"
            disabled={!selectedTime}
            onClick={() => setPaying(true)}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-stone-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-yellow-400 dark:text-stone-950 dark:hover:bg-yellow-300"
          >
            Proceed to Pay ₹{e.payment_amount}
          </button>
        </AdminCard>
      )}

      {e.status === "paid" && (
        <AdminCard className="p-6 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
          Payment received for{" "}
          {e.chosen_time ? formatTimeLabel(e.chosen_time) : "your chosen time"} on{" "}
          {e.proposed_date ? formatEnquiryDate(e.proposed_date) : "—"}. Waiting for the admin
          to schedule your class.
        </AdminCard>
      )}

      {e.status === "scheduled" && (
        <AdminCard className="p-6 text-sm font-semibold text-stone-900 dark:text-white">
          Your class is scheduled for {e.chosen_time ? formatTimeLabel(e.chosen_time) : ""} on{" "}
          {e.proposed_date ? formatEnquiryDate(e.proposed_date) : "—"}. Check Meetings for
          the details.
        </AdminCard>
      )}

      {paying && selectedTime && (
        <PaymentModal
          enquiryId={e.id}
          title={e.title}
          amount={e.payment_amount ?? 0}
          chosenTime={selectedTime}
          onClose={() => {
            setPaying(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
