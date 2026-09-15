"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  createCalendarEvent,
  updateCalendarEvent,
} from "@/app/actions/calendar";
import {
  MEETING_TYPES,
  MEETING_TYPE_LABELS,
  SEND_TO_LABELS,
  type MeetingType,
  type SendTo,
} from "@/app/lib/calendar";
import { STUDENT_CLASSES } from "@/app/lib/students";
import { ArrowRight } from "@/app/components/icons";
import { adminBase } from "../_lib/nav";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-500/20 dark:border-stone-700 dark:bg-stone-900 dark:text-white";

export type EditableEvent = {
  id: string;
  title: string;
  description: string | null;
  meeting_type: MeetingType;
  starts_at: string;
  duration_minutes: number;
  class_filter: string | null;
  enquiry_user_id: string | null;
  attachment_name: string | null;
  send_to: SendTo;
};

export type EnquiryOption = {
  userId: string;
  name: string;
  latestTitle: string;
};

export type StudentOption = {
  userId: string;
  name: string;
  class: string;
  type?: string;
};

type Props = (
  | { mode: "create"; defaultDate: string; defaultTime: string }
  | { mode: "edit"; event: EditableEvent }
) & {
  /** Students who have raised an enquiry — offered when type is "inquiry". */
  enquiryStudents: EnquiryOption[];
  /** All offline students — shown when send_to is "selected". */
  allStudents: StudentOption[];
  /** Pre-selected student IDs (edit mode with send_to = 'selected'). */
  defaultSelectedStudentIds?: string[];
  /** When set, the form is shown inside a modal: on success it calls this
   *  and refreshes instead of navigating to the calendar page. */
  onDone?: () => void;
};

export default function EventForm(props: Props) {
  const router = useRouter();
  const base = adminBase(usePathname());
  const isEdit = props.mode === "edit";
  const inModal = typeof props.onDone === "function";
  const [meetingType, setMeetingType] = useState<MeetingType>(
    props.mode === "edit" ? props.event.meeting_type : "daily"
  );
  const isInquiry = meetingType === "inquiry";
  const [sendTo, setSendTo] = useState<SendTo>(
    props.mode === "edit" ? props.event.send_to : "all"
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(props.defaultSelectedStudentIds ?? [])
  );
  const [studentSearch, setStudentSearch] = useState("");

  const filteredStudents = useMemo(() => {
    if (!studentSearch.trim()) return props.allStudents;
    const q = studentSearch.toLowerCase();
    return props.allStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(q) || s.class.toLowerCase().includes(q)
    );
  }, [props.allStudents, studentSearch]);

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
        router.push(`${base}/calendar`);
      }
    }
  }, [state, router, props, base]);

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

  function toggleStudent(uid: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(uid)) next.delete(uid);
      else next.add(uid);
      return next;
    });
  }

  function selectAll() {
    setSelectedIds(new Set(props.allStudents.map((s) => s.userId)));
  }

  function deselectAll() {
    setSelectedIds(new Set());
  }

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-800"
    >
      {!inModal && (
        <Link
          href={`${base}/calendar`}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          Back to calendar
        </Link>
      )}

      {isEdit && <input type="hidden" name="id" value={ev!.id} />}
      <input type="hidden" name="send_to" value={sendTo} />
      {sendTo === "selected" &&
        [...selectedIds].map((uid) => (
          <input
            key={uid}
            type="hidden"
            name="selected_student_ids"
            value={uid}
          />
        ))}

      {state && "error" in state && (
        <p className="mb-4 rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
          {state.error}
        </p>
      )}

      <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
        Meeting title
        <input
          name="title"
          required
          defaultValue={ev?.title ?? ""}
          placeholder="e.g. Class 8 daily session"
          className={inputClass}
        />
      </label>

      <label className="mt-4 block text-sm font-medium text-stone-700 dark:text-stone-200">
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
        <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
          Meeting type
          <select
            name="meeting_type"
            required
            value={meetingType}
            onChange={(e) => setMeetingType(e.target.value as MeetingType)}
            className={inputClass}
          >
            {MEETING_TYPES.map((t) => (
              <option key={t} value={t}>
                {MEETING_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
          Class
          <select
            name="class_filter"
            defaultValue={ev?.class_filter ?? ""}
            disabled={isInquiry}
            className={`${inputClass} disabled:opacity-50`}
          >
            <option value="">All classes</option>
            {STUDENT_CLASSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-xs font-normal text-stone-500 dark:text-stone-400">
            {isInquiry
              ? "Not used for an inquiry — only the chosen student is invited."
              : "Students with registered emails in this class will be invited."}
          </span>
        </label>
        <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
          Date
          <input
            name="date"
            type="date"
            required
            defaultValue={defaultDate}
            className={inputClass}
          />
        </label>
        <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
          Time
          <input
            name="time"
            type="time"
            required
            defaultValue={defaultTime}
            className={inputClass}
          />
        </label>
        <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
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

        {isInquiry && (
          <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
            Student
            <select
              name="enquiry_user_id"
              required
              defaultValue={ev?.enquiry_user_id ?? ""}
              className={inputClass}
            >
              <option value="" disabled>
                {props.enquiryStudents.length
                  ? "Select a student"
                  : "No enquiries yet"}
              </option>
              {props.enquiryStudents.map((s) => (
                <option key={s.userId} value={s.userId}>
                  {s.name} — {s.latestTitle}
                </option>
              ))}
            </select>
            <span className="mt-1 block text-xs font-normal text-stone-500 dark:text-stone-400">
              Students who have raised an enquiry. Only this student is invited.
            </span>
          </label>
        )}
      </div>

      {/* Send invite to — selector */}
      {!isInquiry && (
        <div className="mt-4 rounded-xl border border-stone-200/70 bg-stone-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Send invite to
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            Meeting link email will also be sent to admin.
          </p>
          <div className="mt-3 flex flex-wrap gap-4">
            {(["all", "selected"] as const).map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200"
              >
                <input
                  type="radio"
                  checked={sendTo === opt}
                  onChange={() => setSendTo(opt)}
                  className="h-4 w-4 accent-slate-800 dark:accent-teal-500"
                />
                {SEND_TO_LABELS[opt]}
              </label>
            ))}
          </div>

          {sendTo === "selected" && (
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search students…"
                  className={`${inputClass} !mt-0`}
                />
                <button
                  type="button"
                  onClick={selectAll}
                  className="shrink-0 rounded-lg border border-slate-300 px-2.5 py-2 text-xs font-semibold text-slate-600 hover:border-slate-500 hover:text-slate-900 dark:border-slate-600 dark:text-slate-300 dark:hover:text-white"
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={deselectAll}
                  className="shrink-0 rounded-lg border border-slate-300 px-2.5 py-2 text-xs font-semibold text-slate-600 hover:border-slate-500 hover:text-slate-900 dark:border-slate-600 dark:text-slate-300 dark:hover:text-white"
                >
                  None
                </button>
              </div>
              <p className="mt-1.5 text-xs text-slate-400">
                {selectedIds.size} of {props.allStudents.length} selected
              </p>
              <div className="mt-2 max-h-48 space-y-1 overflow-y-auto rounded-lg border border-stone-200/70 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
                {filteredStudents.length === 0 && (
                  <p className="px-2 py-3 text-center text-xs text-slate-400">
                    No students found.
                  </p>
                )}
                {filteredStudents.map((s) => (
                  <label
                    key={s.userId}
                    className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-slate-700 transition-colors hover:bg-stone-50 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.has(s.userId)}
                      onChange={() => toggleStudent(s.userId)}
                      className="h-4 w-4 shrink-0 accent-slate-800 dark:accent-teal-500"
                    />
                    <span className="truncate">{s.name}</span>
                    <div className="ml-auto flex shrink-0 items-center gap-1.5">
                      {s.type && (
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                            s.type === "new_student"
                              ? "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
                              : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                          }`}
                        >
                          {s.type === "new_student" ? "Online" : "Offline"}
                        </span>
                      )}
                      {s.class && (
                        <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          Class {s.class}
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {props.mode === "create" && (
        <div className="mt-4 rounded-xl border border-stone-200/70 bg-stone-50 p-4 dark:border-stone-700 dark:bg-stone-900/40">
          <p className="text-sm font-medium text-stone-700 dark:text-stone-200">
            Repeat
          </p>
          <p className="mt-0.5 text-xs text-stone-400">
            Creates a separate meeting for each day — cancel or edit one without
            touching the others.
          </p>
          <div className="mt-3 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-200">
              <input
                name="repeat_weekdays"
                type="checkbox"
                className="h-4 w-4 accent-stone-800 dark:accent-yellow-500"
              />
              Weekdays (Mon–Fri)
            </label>
            <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-200">
              <input
                name="repeat_weekends"
                type="checkbox"
                className="h-4 w-4 accent-stone-800 dark:accent-yellow-500"
              />
              Weekends (Sat–Sun)
            </label>
          </div>
          <label className="mt-3 block text-sm font-medium text-stone-700 dark:text-stone-200">
            Repeat until
            <input
              name="repeat_until"
              type="date"
              className={inputClass}
            />
            <span className="mt-1 block text-xs text-stone-400">
              Optional. Defaults to 4 weeks when a repeat option is selected.
            </span>
          </label>
        </div>
      )}

      <label className="mt-4 block text-sm font-medium text-stone-700 dark:text-stone-200">
        Attachment
        <input
          name="attachment"
          type="file"
          className="mt-1.5 block w-full text-sm text-stone-600 file:mr-3 file:rounded-full file:border-0 file:bg-stone-800 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-stone-700 dark:text-stone-400"
        />
        <span className="mt-1 block text-xs text-stone-400">
          {ev?.attachment_name
            ? `Current: ${ev.attachment_name}. Choose a file to replace it.`
            : "Optional. Sent with the invite email (max 10 MB)."}
        </span>
      </label>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-gradient-to-r from-stone-700 to-stone-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-stone-900/20 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
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
            className="rounded-full border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-500 hover:text-stone-900 dark:border-stone-600 dark:text-stone-200 dark:hover:border-stone-400 dark:hover:text-white"
          >
            Cancel
          </button>
        ) : (
          <Link
            href={`${base}/calendar`}
            className="rounded-full border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-500 hover:text-stone-900 dark:border-stone-600 dark:text-stone-200 dark:hover:border-stone-400 dark:hover:text-white"
          >
            Cancel
          </Link>
        )}
      </div>
    </form>
  );
}
