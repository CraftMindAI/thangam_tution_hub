export const ENQUIRY_STATUSES = [
  "requested",
  "reviewed",
  "rejected",
  "paid",
  "scheduled",
] as const;

export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const ENQUIRY_STATUS_LABELS: Record<EnquiryStatus, string> = {
  requested: "Requested",
  reviewed: "Proposal Sent",
  rejected: "Rejected",
  paid: "Paid",
  scheduled: "Scheduled",
};

export const ENQUIRY_MIN_DURATION_MINUTES = 40;
export const ENQUIRY_MAX_DURATION_MINUTES = 90;
export const ENQUIRY_MAX_SUGGESTED_TIMES = 3;

export const ENQUIRY_REJECTION_REASONS = [
  "Requested time slot not available",
  "Staff not available",
  "Duration requested is not feasible",
  "Subject/topic not currently offered",
  "Other",
] as const;

export type EnquiryRejectionReason = (typeof ENQUIRY_REJECTION_REASONS)[number];

export type StudentEnquiry = {
  id: string;
  user_id: string;
  title: string;
  subject: string;
  description: string;
  duration_requested_minutes: number | null;
  status: EnquiryStatus;
  admin_duration_minutes: number | null;
  payment_amount: number | null;
  proposed_date: string | null;
  suggested_times: string[];
  chosen_time: string | null;
  admin_note: string | null;
  reviewed_at: string | null;
  paid_at: string | null;
  scheduled_event_id: string | null;
  scheduled_at: string | null;
  created_at: string;
};

/** "18:00" -> "6:00 PM" */
export function formatTimeLabel(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return hhmm;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export function formatEnquiryDate(d: string): string {
  return new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
