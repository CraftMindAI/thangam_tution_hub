import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import { User } from "../../../components/icons";

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

  const rows = [
    { label: "Full name", value: profile?.full_name ?? "—" },
    { label: "Email", value: user.email ?? "—" },
    { label: "Phone", value: profile?.phone ?? "—" },
    { label: "Role", value: profile?.role ?? "—" },
  ];

  return (
    <div className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
          <User className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white">
            {profile?.full_name ?? "Admin"}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {user.email}
          </p>
        </div>
      </div>

      <dl className="mt-6 divide-y divide-stone-100 dark:divide-slate-700">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex justify-between gap-4 py-3 text-sm"
          >
            <dt className="text-slate-500 dark:text-slate-400">{r.label}</dt>
            <dd className="font-medium text-slate-800 dark:text-slate-200">
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
