import { getMeetingPreferences } from "@/app/actions/admin";
import MeetingPreferenceForm from "./MeetingPreferenceForm";
import { AdminPageHeader } from "../../_components/ui";

export default async function MeetingPreferencePage() {
  const preferences = await getMeetingPreferences();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Settings: Meeting Preferences"
        subtitle="Configure real-time stream parameters, permissions, and email notifications for meetings."
      />
      <MeetingPreferenceForm preferences={preferences} />
    </div>
  );
}
