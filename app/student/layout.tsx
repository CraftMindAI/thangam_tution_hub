import { redirect } from "next/navigation";
import { createClient } from "../lib/supabase/server";
import Sidebar from "./Sidebar";

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

  return (
    <div className="flex flex-1 bg-stone-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
