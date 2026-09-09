import { notFound, redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
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
      "id, title, description, meeting_type, starts_at, duration_minutes, class_filter, attachment_name"
    )
    .eq("id", id)
    .eq("created_by", user.id)
    .single();

  if (!event) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-4 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
        Edit Meeting
      </h2>
      <EventForm mode="edit" event={event as EditableEvent} />
    </div>
  );
}
