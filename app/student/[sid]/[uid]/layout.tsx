import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";
import {
  buildStudentDashboardPath,
  resolveSecurePath,
} from "@/app/lib/secure-path";

export default async function StudentSecureLayout({
  children,
  params,
}: LayoutProps<"/student/[sid]/[uid]">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const { sid, uid } = await params;
  const resolved = resolveSecurePath(sid, uid);

  // Tampered / mismatched segments — bounce to this user's real base URL.
  if (!resolved || resolved.userId !== user.id) {
    redirect(buildStudentDashboardPath(user.id));
  }

  return <>{children}</>;
}
