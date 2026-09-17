import { notFound, redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import {
  getEnquiryStudents,
  getMeetingInvitees,
  getPendingDemoRequests,
} from "@/app/lib/roster";
import EventForm, { type EditableEvent } from "../../EventForm";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: event } = await supabase
    .from("calendar_events")
    .select(
      "id, title, description, meeting_type, starts_at, duration_minutes, class_filter, enquiry_user_id, attachment_name, send_to, selected_student_ids"
    )
    .eq("id", id)
    .eq("created_by", user.id)
    .single();

  if (!event) notFound();

  const defaultSelectedStudentIds = (event.selected_student_ids as string[] | null) ?? [];

  const [enquiryStudents, allOffline, demoRequests] = await Promise.all([
    getEnquiryStudents(),
    getMeetingInvitees(null),
    getPendingDemoRequests(),
  ]);

  const allStudents = allOffline.map((s) => ({
    userId: s.userId,
    name: s.name,
    class: s.class,
    type: s.type,
  }));

  return (
    <div className="mx-auto max-w-4xl">
      <h2 className="mb-2 text-base font-bold tracking-tight text-stone-900 dark:text-white">
        Edit Meeting
      </h2>
      <EventForm
        mode="edit"
        event={event as EditableEvent}
        enquiryStudents={enquiryStudents}
        allStudents={allStudents}
        demoRequests={demoRequests}
        defaultSelectedStudentIds={defaultSelectedStudentIds}
      />
    </div>
  );
}
