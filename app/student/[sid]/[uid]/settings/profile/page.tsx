import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import ProfileForm from "./ProfileForm";
import { AdminPageHeader } from "@/app/admin/_components/ui";

export default async function StudentProfileSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "full_name, phone, role, class, school, location, parent_name, parent_phone, parent_email"
    )
    .eq("id", user.id)
    .single();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Settings: Profile"
        subtitle="View and update your personal account information and contact number."
      />
      <ProfileForm
        email={user.email ?? ""}
        fullName={profile?.full_name ?? ""}
        phone={profile?.phone ?? ""}
        role={profile?.role ?? ""}
        studentClass={profile?.class ?? ""}
        school={profile?.school ?? ""}
        location={profile?.location ?? ""}
        parentName={profile?.parent_name ?? ""}
        parentPhone={profile?.parent_phone ?? ""}
        parentEmail={profile?.parent_email ?? ""}
      />
    </div>
  );
}
