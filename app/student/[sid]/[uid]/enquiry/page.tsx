import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { AdminPageHeader } from "@/app/admin/_components/ui";
import type { StudentEnquiry } from "@/app/lib/enquiries";
import NewEnquiryForm from "./NewEnquiryForm";
import EnquiryTracker from "./EnquiryTracker";

export default async function StudentEnquiry() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const { data: enquiries } = await supabase
    .from("student_enquiries")
    .select(
      "id, user_id, title, subject, description, duration_requested_minutes, status, admin_duration_minutes, payment_amount, proposed_date, suggested_times, chosen_time, admin_note, reviewed_at, paid_at, scheduled_event_id, scheduled_at, created_at"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Enquiry"
        subtitle="Raise a question, subject doubt, or query with your tutors."
      />

      <NewEnquiryForm />

      <EnquiryTracker enquiries={(enquiries ?? []) as StudentEnquiry[]} />
    </div>
  );
}
