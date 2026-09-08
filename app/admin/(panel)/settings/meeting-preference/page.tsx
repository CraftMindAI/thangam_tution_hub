import { CalendarClock } from "../../../../components/icons";

export default function MeetingPreferencePage() {
  return (
    <div className="space-y-6">
      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-300">
        Preferences aren&apos;t saved yet. These options will control how video
        meetings start once a settings store is added.
      </p>

      <div className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
            <CalendarClock className="h-5 w-5" />
          </span>
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Video Meeting Preferences
          </h2>
        </div>

        <div className="mt-5 space-y-4">
          <label className="flex items-start justify-between gap-4">
            <span className="text-sm">
              <span className="font-medium text-slate-800 dark:text-slate-200">
                Join with camera on
              </span>
              <span className="block text-slate-500 dark:text-slate-400">
                Turn your camera on automatically when a call starts.
              </span>
            </span>
            <input type="checkbox" defaultChecked disabled className="mt-1 h-4 w-4" />
          </label>

          <label className="flex items-start justify-between gap-4">
            <span className="text-sm">
              <span className="font-medium text-slate-800 dark:text-slate-200">
                Join muted
              </span>
              <span className="block text-slate-500 dark:text-slate-400">
                Start every meeting with your microphone muted.
              </span>
            </span>
            <input type="checkbox" disabled className="mt-1 h-4 w-4" />
          </label>

          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Default layout
            <select
              disabled
              className="mt-1.5 w-full rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              <option>Speaker</option>
              <option>Grid</option>
              <option>Speaker (Right)</option>
            </select>
          </label>

          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Default meeting duration (minutes)
            <input
              type="number"
              defaultValue={30}
              disabled
              className="mt-1.5 w-full rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </label>
        </div>

        <button
          type="button"
          disabled
          className="mt-6 rounded-full bg-gradient-to-r from-slate-700 to-slate-900 px-4 py-2.5 text-sm font-semibold text-white opacity-60"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}
