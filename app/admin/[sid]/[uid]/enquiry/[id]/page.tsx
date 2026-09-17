import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { ENQUIRY_STATUS_LABELS, type EnquiryStatus } from "@/app/lib/enquiries";
import { AdminPageHeader, AdminCard, AdminBadge } from "../../_components/ui";
import EnquiryReviewForm from "./EnquiryReviewForm";

export default async function EnquiryDetailPage({
  params,
}: PageProps<"/admin/[sid]/[uid]/enquiry/[id]">) {
  const { sid, uid, id } = await params;
  const admin = createAdminClient();

  const { data: enquiry } = await admin
    .from("student_enquiries")
    .select(
      "id, user_id, title, subject, description, duration_requested_minutes, status, admin_duration_minutes, payment_amount, proposed_date, suggested_times, chosen_time, admin_note, reviewed_at, paid_at, scheduled_event_id, scheduled_at, created_at"
    )
    .eq("id", id)
    .single();

  if (!enquiry) notFound();

  const [{ data: authUser }, { data: profile }, event] = await Promise.all([
    admin.auth.admin.getUserById(enquiry.user_id),
    admin.from("profiles").select("full_name").eq("id", enquiry.user_id).single(),
    enquiry.scheduled_event_id
      ? admin
          .from("calendar_events")
          .select("call_id")
          .eq("id", enquiry.scheduled_event_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const studentName = profile?.full_name || authUser?.user?.email || "Student";
  const status = enquiry.status as EnquiryStatus;

  return (
    <div className="space-y-6">
      <Link
        href={`/admin/${sid}/${uid}/enquiry`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
      >
        ← Back to Enquiries
      </Link>

      <AdminPageHeader
        title={enquiry.title}
        subtitle={`${studentName} · ${authUser?.user?.email ?? ""}`}
        badge={
          <AdminBadge
            variant={
              status === "rejected"
                ? "gray"
                : status === "scheduled"
                ? "dark"
                : status === "paid"
                ? "success"
                : status === "reviewed"
                ? "warning"
                : "outline"
            }
          >
            {ENQUIRY_STATUS_LABELS[status]}
          </AdminBadge>
        }
      />

      <AdminCard className="p-6 space-y-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Subject
          </p>
          <p className="text-sm font-bold text-stone-900 dark:text-white">{enquiry.subject}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Description
          </p>
          <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
            {enquiry.description}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Requested Duration
          </p>
          <p className="text-sm font-bold text-stone-900 dark:text-white">
            {enquiry.duration_requested_minutes} minutes
          </p>
        </div>
      </AdminCard>

      <EnquiryReviewForm
        enquiry={{
          ...enquiry,
          status,
          suggested_times: (enquiry.suggested_times as string[] | null) ?? [],
        }}
        callId={event?.data?.call_id ?? null}
      />
    </div>
  );
}
