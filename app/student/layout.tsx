import { redirect } from "next/navigation";
import { createClient } from "../lib/supabase/server";
import StudentShell from "./_components/StudentShell";

export default async function StudentLayout({
  children,
}: LayoutProps<"/student">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  return (
    <StudentShell
      studentName={profile?.full_name ?? user.email ?? "Student"}
      studentEmail={user.email ?? ""}
    >
      {children}
    </StudentShell>
  );
}
