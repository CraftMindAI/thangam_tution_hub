import { getMeetingPreferences } from "../../../../actions/admin";
import MeetingPreferenceForm from "./MeetingPreferenceForm";

export default async function MeetingPreferencePage() {
  const preferences = await getMeetingPreferences();

  return <MeetingPreferenceForm preferences={preferences} />;
}
