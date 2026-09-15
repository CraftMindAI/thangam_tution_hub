import { createClient } from "@/app/lib/supabase/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import CreateAdminForm from "@/app/admin/CreateAdminForm";
import {
  AdminPageHeader,
  AdminTableContainer,
  AdminBadge,
  tableClasses,
} from "../../_components/ui";
import { SettingsTabs } from "../_components/SettingsTabs";
import { Users } from "@/app/components/icons";

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
      <AdminPageHeader
        title="Settings: Admin Staff"
        subtitle="Manage authorized administrators and team access credentials."
      />

      <SettingsTabs />

      <CreateAdminForm />

      <AdminTableContainer
        header={
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-stone-900 dark:text-yellow-400">
              Active Admin Staff ({admins?.length ?? 0})
            </h2>
          </div>
        }
      >
        <table className={tableClasses.table}>
          <thead className={tableClasses.thead}>
            <tr>
              <th className={tableClasses.th}>Administrator</th>
              <th className={tableClasses.th}>Official Email</th>
              <th className={tableClasses.th}>Contact Phone</th>
              <th className={`${tableClasses.th} text-right`}>Role</th>
            </tr>
          </thead>
          <tbody className={tableClasses.tbody}>
            {admins?.length ? (
              admins.map((a) => {
                const initial = (a.full_name || "A").trim().charAt(0).toUpperCase();
                return (
                  <tr key={a.id} className={tableClasses.tr}>
                    <td className={tableClasses.td}>
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-400 text-stone-950 font-black text-xs shadow-sm">
                          {initial}
                        </span>
                        <span className="font-extrabold text-stone-900 dark:text-white">
                          {a.full_name ?? "—"}
                        </span>
                      </div>
                    </td>
                    <td className={tableClasses.td}>
                      <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                        {emailById.get(a.id) ?? "—"}
                      </span>
                    </td>
                    <td className={tableClasses.td}>
                      <span className="text-xs text-stone-600 dark:text-stone-400">
                        {a.phone ?? "—"}
                      </span>
                    </td>
                    <td className={`${tableClasses.td} text-right`}>
                      <AdminBadge variant="yellow">ADMIN</AdminBadge>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="py-10 text-center text-stone-500 dark:text-stone-400"
                >
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-400">
                    <Users className="h-5 w-5" />
                  </div>
                  <p className="mt-2 text-xs font-semibold">No admin users found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </AdminTableContainer>
    </div>
  );
}
