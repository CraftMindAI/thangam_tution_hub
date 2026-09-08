export const MEETING_TYPES = ["daily", "demo", "inquiry"] as const;

export type MeetingType = (typeof MEETING_TYPES)[number];

export const MEETING_TYPE_LABELS: Record<MeetingType, string> = {
  daily: "Daily class",
  demo: "Demo",
  inquiry: "Inquiry",
};
