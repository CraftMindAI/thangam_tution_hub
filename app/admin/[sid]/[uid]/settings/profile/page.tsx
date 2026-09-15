import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import ProfileForm from "./ProfileForm";
import { AdminPageHeader } from "../../_components/ui";

export default async function ProfileSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, role")
    .eq("id", user.id)
    .single();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Settings: Profile"
        subtitle="View and update your personal account information and contact numbers."
      />
      <ProfileForm
        email={user.email ?? ""}
        fullName={profile?.full_name ?? ""}
        phone={profile?.phone ?? ""}
        role={profile?.role ?? ""}
      />
    </div>
  );
}
