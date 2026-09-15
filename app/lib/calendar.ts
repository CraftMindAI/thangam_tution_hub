export const MEETING_TYPES = ["daily", "demo", "inquiry"] as const;

export type MeetingType = (typeof MEETING_TYPES)[number];

export const MEETING_TYPE_LABELS: Record<MeetingType, string> = {
  daily: "Daily class",
  demo: "Demo",
  inquiry: "Inquiry",
};

export const SEND_TO_OPTIONS = ["all", "selected"] as const;

export type SendTo = (typeof SEND_TO_OPTIONS)[number];

export const SEND_TO_LABELS: Record<SendTo, string> = {
  all: "All students",
  selected: "Selected students",
};
