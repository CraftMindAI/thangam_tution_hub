import { redirect } from "next/navigation";
import { createClient } from "../lib/supabase/server";
import { buildStudentDashboardPath } from "../lib/secure-path";

export default async function StudentIndex() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  redirect(buildStudentDashboardPath(user.id));
}
