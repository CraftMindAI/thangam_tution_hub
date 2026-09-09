import { redirect } from "next/navigation";

export default async function SettingsPage({
  params,
}: PageProps<"/admin/[sid]/[uid]/settings">) {
  const { sid, uid } = await params;
  redirect(`/admin/${sid}/${uid}/settings/profile`);
}
