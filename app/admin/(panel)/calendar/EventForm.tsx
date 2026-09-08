"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createCalendarEvent,
  updateCalendarEvent,
} from "../../../actions/calendar";
import {
  MEETING_TYPES,
  MEETING_TYPE_LABELS,
  type MeetingType,
} from "../../../lib/calendar";
import { STUDENT_CLASSES } from "../../../lib/students";
import { ArrowRight } from "../../../components/icons";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white";

export type EditableEvent = {
  id: string;
  title: string;
  description: string | null;
  meeting_type: MeetingType;
  starts_at: string;
  duration_minutes: number;
  class_filter: string | null;
  attachment_name: string | null;
};

type Props = (
  | { mode: "create"; defaultDate: string; defaultTime: string }
  | { mode: "edit"; event: EditableEvent }
) & {
  /** When set, the form is shown inside a modal: on success it calls this
   *  and refreshes instead of navigating to the calendar page. */
  onDone?: () => void;
};

export default function EventForm(props: Props) {
  const router = useRouter();
  const isEdit = props.mode === "edit";
  const inModal = typeof props.onDone === "function";
  const [state, formAction, pending] = useActionState(
    isEdit ? updateCalendarEvent : createCalendarEvent,
    undefined
  );

  useEffect(() => {
    if (state && "success" in state) {
      if (props.onDone) {
        props.onDone();
        router.refresh();
      } else {
        router.push("/admin/calendar");
      }
    }
  }, [state, router, props]);

  const ev = props.mode === "edit" ? props.event : null;
  let defaultDate: string;
  let defaultTime: string;
  if (props.mode === "edit") {
    const start = new Date(props.event.starts_at);
    defaultDate = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`;
    defaultTime = `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`;
  } else {
    defaultDate = props.defaultDate;
    defaultTime = props.defaultTime;
  }

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800"
    >
      {!inModal && (
        <Link
          href="/admin/calendar"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          Back to calendar
        </Link>
      )}

      {isEdit && <input type="hidden" name="id" value={ev!.id} />}

      {state && "error" in state && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {state.error}
        </p>
      )}

      <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
        Meeting title
        <input
          name="title"
          required
          defaultValue={ev?.title ?? ""}
          placeholder="e.g. Class 8 daily session"
          className={inputClass}
        />
      </label>

      <label className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-200">
        Description
        <textarea
          name="description"
          rows={3}
          defaultValue={ev?.description ?? ""}
          placeholder="Agenda, what to prepare, etc."
          className={inputClass}
        />
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Meeting type
          <select
            name="meeting_type"
            required
            defaultValue={ev?.meeting_type ?? "daily"}
            className={inputClass}
          >
            {MEETING_TYPES.map((t) => (
              <option key={t} value={t}>
                {MEETING_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Class
          <select
            name="class_filter"
            defaultValue={ev?.class_filter ?? ""}
            className={inputClass}
          >
            <option value="">All classes</option>
            {STUDENT_CLASSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Date
          <input
            name="date"
            type="date"
            required
            defaultValue={defaultDate}
            className={inputClass}
          />
        </label>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Time
          <input
            name="time"
            type="time"
            required
            defaultValue={defaultTime}
            className={inputClass}
          />
        </label>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Duration (minutes)
          <input
            name="duration_minutes"
            type="number"
            min={5}
            max={600}
            required
            defaultValue={ev?.duration_minutes ?? 30}
            className={inputClass}
          />
        </label>
      </div>

      {props.mode === "create" && (
        <div className="mt-4 rounded-xl border border-stone-200/70 bg-stone-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Repeat
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            Creates a separate meeting for each day — cancel or edit one without
            touching the others.
          </p>
          <div className="mt-3 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
              <input
                name="repeat_weekdays"
                type="checkbox"
                className="h-4 w-4 accent-slate-800 dark:accent-teal-500"
              />
              Weekdays (Mon–Fri)
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
              <input
                name="repeat_weekends"
                type="checkbox"
                className="h-4 w-4 accent-slate-800 dark:accent-teal-500"
              />
              Weekends (Sat–Sun)
            </label>
          </div>
          <label className="mt-3 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Repeat until
            <input
              name="repeat_until"
              type="date"
              className={inputClass}
            />
            <span className="mt-1 block text-xs text-slate-400">
              Optional. Defaults to 4 weeks when a repeat option is selected.
            </span>
          </label>
        </div>
      )}

      <label className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-200">
        Attachment
        <input
          name="attachment"
          type="file"
          className="mt-1.5 block w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-slate-800 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-700 dark:text-slate-400"
        />
        <span className="mt-1 block text-xs text-slate-400">
          {ev?.attachment_name
            ? `Current: ${ev.attachment_name}. Choose a file to replace it.`
            : "Optional. Sent with the invite email (max 10 MB)."}
        </span>
      </label>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-gradient-to-r from-slate-700 to-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
        >
          {pending
            ? "Saving…"
            : isEdit
              ? "Save & notify students"
              : "Schedule & send invites"}
        </button>
        {inModal ? (
          <button
            type="button"
            onClick={props.onDone}
            className="rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-500 hover:text-slate-900 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-400 dark:hover:text-white"
          >
            Cancel
          </button>
        ) : (
          <Link
            href="/admin/calendar"
            className="rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-500 hover:text-slate-900 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-400 dark:hover:text-white"
          >
            Cancel
          </Link>
        )}
      </div>
    </form>
  );
}
