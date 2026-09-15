import { notFound, redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { getEnquiryStudents, getMeetingInvitees } from "@/app/lib/roster";
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
      "id, title, description, meeting_type, starts_at, duration_minutes, class_filter, enquiry_user_id, attachment_name, send_to"
    )
    .eq("id", id)
    .eq("created_by", user.id)
    .single();

  if (!event) notFound();

  // Fetch selected student IDs if send_to = 'selected'.
  let defaultSelectedStudentIds: string[] = [];
  if (event.send_to === "selected") {
    const { data: selectedRows } = await supabase
      .from("calendar_event_selected_students")
      .select("user_id")
      .eq("event_id", id);
    defaultSelectedStudentIds = (selectedRows ?? []).map((r) => r.user_id as string);
  }

  const [enquiryStudents, allOffline] = await Promise.all([
    getEnquiryStudents(),
    getMeetingInvitees(null),
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
        defaultSelectedStudentIds={defaultSelectedStudentIds}
      />
    </div>
  );
}
