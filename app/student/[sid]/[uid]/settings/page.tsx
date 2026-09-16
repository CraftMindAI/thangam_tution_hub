import { redirect } from "next/navigation";

export default async function StudentSettingsPage({
  params,
}: PageProps<"/student/[sid]/[uid]/settings">) {
  const { sid, uid } = await params;
  redirect(`/student/${sid}/${uid}/settings/profile`);
}
