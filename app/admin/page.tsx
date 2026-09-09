import { redirect } from "next/navigation";
import { createClient } from "../lib/supabase/server";
import { buildAdminPath } from "../lib/secure-path";

// Stable entry point — sends a signed-in admin to their encrypted panel URL.
export default async function AdminIndex() {
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

  redirect(buildAdminPath(user.id));
}
