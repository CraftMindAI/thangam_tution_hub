import { createClient } from "../../../../lib/supabase/server";
import { createAdminClient } from "../../../../lib/supabase/admin";
import CreateAdminForm from "../../../CreateAdminForm";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: admins } = await supabase
    .from("profiles")
    .select("id, full_name, phone")
    .eq("role", "admin")
    .order("full_name", { ascending: true });

  // Emails live on auth.users, not profiles — pull them with the service client.
  const emailById = new Map<string, string>();
  try {
    const adminClient = createAdminClient();
    const { data } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
    for (const u of data?.users ?? []) {
      if (u.email) emailById.set(u.id, u.email);
    }
  } catch {
    // If the service key isn't configured, just show a dash for email.
  }

  return (
    <div className="space-y-6">
      <CreateAdminForm />

      <div className="overflow-x-auto rounded-2xl border border-stone-200/70 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-800">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-stone-200/70 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-slate-700">
            {admins?.length ? (
              admins.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                    {a.full_name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    {emailById.get(a.id) ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                    {a.phone ?? "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-6 text-center text-slate-500 dark:text-slate-400"
                >
                  No admin users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
