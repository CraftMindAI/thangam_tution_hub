"use client";

import { useActionState } from "react";
import { updateMeetingPreferences } from "@/app/actions/admin";
import type { MeetingPreferences } from "@/app/lib/meeting-preferences";
import { CalendarClock } from "@/app/components/icons";
import { AdminCard, AdminButton } from "../../_components/ui";
import { SettingsTabs } from "../_components/SettingsTabs";

const options: {
  name: keyof MeetingPreferences;
  label: string;
  hint: string;
}[] = [
  {
    name: "audio_enabled",
    label: "Enable Audio by Default",
    hint: "Allow participants to use microphone upon joining.",
  },
  {
    name: "video_enabled",
    label: "Enable Video Camera by Default",
    hint: "Allow participants to activate their camera in live classes.",
  },
  {
    name: "chat_enabled",
    label: "Enable In-Meeting Live Chat",
    hint: "Allow students and teachers to send real-time text messages.",
  },
  {
    name: "breakout_enabled",
    label: "Enable Breakout Rooms",
    hint: "Permit the teacher/host to split students into smaller study groups.",
  },
  {
    name: "student_email_notifications",
    label: "Automated Student Email Notifications",
    hint: "Email students whenever a new session or reschedule occurs.",
  },
];

export default function MeetingPreferenceForm({
  preferences,
}: {
  preferences: MeetingPreferences;
}) {
  const [state, formAction, pending] = useActionState(
    updateMeetingPreferences,
    undefined
  );

  return (
    <div className="space-y-6">
      <SettingsTabs />

      <AdminCard className="p-6 sm:p-8">
        <form action={formAction}>
          <div className="flex items-center gap-3 pb-6 border-b border-stone-100 dark:border-stone-800/80">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-400 text-stone-950 shadow-md">
              <CalendarClock className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-stone-900 dark:text-white">
                Live Class & Video Meeting Defaults
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                These settings apply globally to every session created by administrators.
              </p>
            </div>
          </div>

          {state && "error" in state && (
            <div className="mt-4 rounded-2xl bg-yellow-400/20 p-3.5 text-xs font-bold text-yellow-800 dark:text-yellow-300 border border-yellow-400/40">
              {state.error}
            </div>
          )}
          {state && "success" in state && (
            <div className="mt-4 rounded-2xl bg-emerald-500/15 p-3.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              Meeting preferences saved successfully. All future sessions will adopt these defaults.
            </div>
          )}

          <div className="mt-6 divide-y divide-stone-100 dark:divide-stone-800/80">
            {options.map((opt) => (
              <label
                key={opt.name}
                className="group flex cursor-pointer items-center justify-between gap-4 py-4 transition-colors hover:bg-stone-50/50 dark:hover:bg-stone-900/30 px-2 rounded-2xl"
              >
                <div className="min-w-0 pr-4">
                  <span className="text-sm font-extrabold text-stone-800 dark:text-stone-200 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                    {opt.label}
                  </span>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    {opt.hint}
                  </p>
                </div>

                <div className="relative inline-flex items-center shrink-0">
                  <input
                    type="checkbox"
                    name={opt.name}
                    defaultChecked={preferences[opt.name]}
                    className="peer sr-only"
                  />
                  <div className="h-6 w-11 rounded-full bg-stone-200 transition-colors peer-checked:bg-yellow-400 peer-focus:outline-none dark:bg-stone-800" />
                  <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5 peer-checked:bg-stone-950 shadow-sm" />
                </div>
              </label>
            ))}
          </div>

          <div className="mt-8 flex justify-end pt-4 border-t border-stone-100 dark:border-stone-800">
            <AdminButton
              type="submit"
              loading={pending}
            >
              Save Preferences
            </AdminButton>
          </div>
        </form>
      </AdminCard>
    </div>
  );
}
