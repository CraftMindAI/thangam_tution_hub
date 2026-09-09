import { redirect } from "next/navigation";
import { createClient } from "../../../../lib/supabase/server";
import {
  buildStudentDashboardPath,
  resolveSecurePath,
} from "../../../../lib/secure-path";
import DashboardView from "../../../_components/DashboardView";

export default async function StudentDashboardPage({
  params,
}: PageProps<"/student/[sid]/[uid]/dashboard">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const { sid, uid } = await params;
  const resolved = resolveSecurePath(sid, uid);

  // Tampered / mismatched segments — bounce to this user's real dashboard URL.
  if (!resolved || resolved.userId !== user.id) {
    redirect(buildStudentDashboardPath(user.id));
  }

  return <DashboardView userId={user.id} />;
}
