import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import MeetingPageClient from "./MeetingPageClient";

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <MeetingPageClient
      callId={id}
      userId={user.id}
      userName={user.email ?? "Admin"}
    />
  );
}
