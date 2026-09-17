import { notFound, redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { AdminPageHeader } from "@/app/admin/_components/ui";
import type { StudentEnquiry } from "@/app/lib/enquiries";
import EnquiryDetailView from "./EnquiryDetailView";
import BackLink from "./BackLink";

export default async function StudentEnquiryDetailPage({
  params,
}: PageProps<"/student/[sid]/[uid]/enquiry/[id]">) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const { data: enquiry } = await supabase
    .from("student_enquiries")
    .select(
      "id, user_id, title, subject, description, duration_requested_minutes, status, admin_duration_minutes, payment_amount, proposed_date, suggested_times, chosen_time, admin_note, reviewed_at, paid_at, scheduled_event_id, scheduled_at, created_at"
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!enquiry) notFound();

  return (
    <div className="space-y-6">
      <BackLink />

      <AdminPageHeader
        title={enquiry.title}
        subtitle={`${enquiry.subject} · Submitted ${new Date(
          enquiry.created_at
        ).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`}
      />

      <EnquiryDetailView
        enquiry={{
          ...enquiry,
          suggested_times: (enquiry.suggested_times as string[] | null) ?? [],
        } as StudentEnquiry}
      />
    </div>
  );
}
