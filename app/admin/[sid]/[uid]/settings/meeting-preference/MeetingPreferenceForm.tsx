"use client";

import { useActionState } from "react";
import { updateMeetingPreferences } from "@/app/actions/admin";
import type { MeetingPreferences } from "@/app/lib/meeting-preferences";
import { CalendarClock } from "@/app/components/icons";

const options: {
  name: keyof MeetingPreferences;
  label: string;
  hint: string;
}[] = [
  {
    name: "audio_enabled",
    label: "Enable audio",
    hint: "Allow participants to use their microphone.",
  },
  {
    name: "video_enabled",
    label: "Enable video",
    hint: "Allow participants to turn on their camera.",
  },
  {
    name: "chat_enabled",
    label: "Enable chat",
    hint: "Allow in-meeting text chat.",
  },
  {
    name: "breakout_enabled",
    label: "Enable breakout rooms",
    hint: "Let the host split participants into separate rooms.",
  },
  {
    name: "student_email_notifications",
    label: "Student email notification",
    hint: "Email students when a meeting is scheduled or updated.",
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
    <form
      action={formAction}
      className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
          <CalendarClock className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Video Meeting Preferences
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Applies to every admin-hosted meeting. Admins only.
          </p>
        </div>
      </div>

      {state && "error" in state && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {state.error}
        </p>
      )}
      {state && "success" in state && (
        <p className="mt-4 rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
          Meeting Preferences has been saved it will apply for all future meetings.
        </p>
      )}

      <div className="mt-5 divide-y divide-stone-100 dark:divide-slate-700">
        {options.map((opt) => (
          <label
            key={opt.name}
            className="flex cursor-pointer items-start justify-between gap-4 py-3.5"
          >
            <span className="text-sm">
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {opt.label}
              </span>
              <span className="block text-slate-500 dark:text-slate-400">
                {opt.hint}
              </span>
            </span>
            <input
              type="checkbox"
              name={opt.name}
              defaultChecked={preferences[opt.name]}
              className="mt-1 h-4 w-4 shrink-0 accent-slate-800 dark:accent-teal-500"
            />
          </label>
        ))}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-6 rounded-full bg-gradient-to-r from-slate-700 to-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
      >
        {pending ? "Saving…" : "Save Preferences"}
      </button>
    </form>
  );
}
