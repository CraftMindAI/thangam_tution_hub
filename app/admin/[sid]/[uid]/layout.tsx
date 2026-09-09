import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import { buildAdminPath, resolveSecurePath } from "@/app/lib/secure-path";
import AdminShell from "./_components/AdminShell";

export default async function AdminPanelLayout({
  children,
  params,
}: LayoutProps<"/admin/[sid]/[uid]">) {
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

  // Admins only — every page in this subtree is behind this check.
  if (profile?.role !== "admin") {
    redirect("/admin/login");
  }

  // The URL segments must decrypt to this signed-in admin, so one admin's
  // link cannot be used by another account (or a tampered one by anybody).
  const { sid, uid } = await params;
  const resolved = resolveSecurePath(sid, uid);
  if (!resolved || resolved.userId !== user.id) {
    redirect(buildAdminPath(user.id));
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
