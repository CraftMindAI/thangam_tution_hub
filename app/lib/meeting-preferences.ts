export type MeetingPreferences = {
  audio_enabled: boolean;
  video_enabled: boolean;
  chat_enabled: boolean;
  breakout_enabled: boolean;
  student_email_notifications: boolean;
};

export const defaultMeetingPreferences: MeetingPreferences = {
  audio_enabled: true,
  video_enabled: true,
  chat_enabled: true,
  breakout_enabled: false,
  student_email_notifications: true,
};
