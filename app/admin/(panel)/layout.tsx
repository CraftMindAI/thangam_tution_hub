import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import AdminShell from "./_components/AdminShell";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <AdminShell
      adminName={profile.full_name ?? "Admin"}
      adminEmail={user.email ?? ""}
    >
      {children}
    </AdminShell>
  );
}
