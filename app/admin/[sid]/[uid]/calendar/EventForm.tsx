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
import { ArrowRight, CalendarClock } from "@/app/components/icons";
import { adminBase } from "../_lib/nav";
import { AdminButton } from "../_components/ui";

const inputClass =
  "mt-1 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs font-semibold text-stone-900 outline-none placeholder:text-stone-400 focus:border-yellow-400 focus:bg-white dark:border-stone-800 dark:bg-stone-900 dark:text-white dark:placeholder:text-stone-500 dark:focus:border-yellow-400 dark:focus:bg-stone-900 dark:[&>option]:bg-stone-900 dark:[&>option]:text-white [&>option]:bg-white [&>option]:text-stone-900 [color-scheme:light] dark:[color-scheme:dark] transition-colors";

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

export type DemoRequestOption = {
  id: string;
  name: string;
  email: string;
};

type Props = (
  | { mode: "create"; defaultDate: string; defaultTime: string }
  | { mode: "edit"; event: EditableEvent }
) & {
  enquiryStudents: EnquiryOption[];
  allStudents: StudentOption[];
  demoRequests: DemoRequestOption[];
  defaultSelectedStudentIds?: string[];
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
  const isDemo = meetingType === "demo";
  const [sendTo, setSendTo] = useState<SendTo>(
    props.mode === "edit" ? props.event.send_to : "all"
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(props.defaultSelectedStudentIds ?? [])
  );
  const [studentSearch, setStudentSearch] = useState("");

  // A common shape for the "selected" checklist, whichever source it's drawn
  // from — the student roster (by class) or pending demo requests (by email).
  const selectableOptions = useMemo(
    () =>
      isDemo
        ? props.demoRequests.map((d) => ({ id: d.id, name: d.name, sublabel: d.email }))
        : props.allStudents.map((s) => ({ id: s.userId, name: s.name, sublabel: `Class ${s.class}` })),
    [isDemo, props.demoRequests, props.allStudents]
  );

  const filteredOptions = useMemo(() => {
    if (!studentSearch.trim()) return selectableOptions;
    const q = studentSearch.toLowerCase();
    return selectableOptions.filter(
      (s) => s.name.toLowerCase().includes(q) || s.sublabel.toLowerCase().includes(q)
    );
  }, [selectableOptions, studentSearch]);

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
    setSelectedIds(new Set(selectableOptions.map((s) => s.id)));
  }

  function deselectAll() {
    setSelectedIds(new Set());
  }

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-stone-200/90 bg-white p-4 sm:p-6 shadow-xl dark:border-stone-800/80 dark:bg-[#14151b]"
    >
      {!inModal && (
        <Link
          href={`${base}/calendar`}
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
        >
          <ArrowRight className="h-3.5 w-3.5 rotate-180" />
          Back to calendar
        </Link>
      )}

      <div className="flex items-center gap-3 mb-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-400 text-stone-950 shadow-sm">
          <CalendarClock className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-stone-900 dark:text-white leading-snug">
            {isEdit ? "Edit Scheduled Meeting" : "Schedule New Session"}
          </h2>
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            Configure meeting parameters and student invitations.
          </p>
        </div>
      </div>

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
        <div className="mb-4 rounded-xl bg-yellow-400/20 p-2.5 text-xs font-bold text-yellow-800 dark:text-yellow-300 border border-yellow-400/40">
          {state.error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2 items-start">
        {/* Left Column: Meeting Details */}
        <div className="space-y-2.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Meeting Title
            <input
              name="title"
              required
              defaultValue={ev?.title ?? ""}
              placeholder="e.g. Class 8 Mathematics & Science Session"
              className={inputClass}
            />
          </label>

          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Session Description & Agenda
            <textarea
              name="description"
              rows={2}
              defaultValue={ev?.description ?? ""}
              placeholder="Topics to cover, practice worksheets, etc."
              className={inputClass}
            />
          </label>

          <div className="grid gap-2.5 grid-cols-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Meeting Type
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

            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Target Class
              <select
                name="class_filter"
                defaultValue={ev?.class_filter ?? ""}
                disabled={isInquiry || isDemo}
                className={`${inputClass} disabled:opacity-50`}
              >
                <option value="">All Classes</option>
                {STUDENT_CLASSES.map((c) => (
                  <option key={c} value={c}>
                    Class {c}
                  </option>
                ))}
              </select>
              <span className="mt-0.5 block text-[10px] font-normal text-stone-400">
                {isInquiry
                  ? "Not applicable for inquiry."
                  : isDemo
                  ? "Not applicable — invited by demo request email."
                  : "Invited by class email."}
              </span>
            </label>

            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Session Date
              <input
                name="date"
                type="date"
                required
                defaultValue={defaultDate}
                className={inputClass}
              />
            </label>

            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Start Time
              <input
                name="time"
                type="time"
                required
                defaultValue={defaultTime}
                className={inputClass}
              />
            </label>

            <label
              className={`block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 ${
                isInquiry ? "" : "col-span-2"
              }`}
            >
              Duration (Minutes)
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
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Select Enquiry Student
                <select
                  name="enquiry_user_id"
                  required
                  defaultValue={ev?.enquiry_user_id ?? ""}
                  className={inputClass}
                >
                  <option value="" disabled>
                    {props.enquiryStudents.length
                      ? "Select student"
                      : "No enquiries"}
                  </option>
                  {props.enquiryStudents.map((s) => (
                    <option key={s.userId} value={s.userId}>
                      {s.name} — {s.latestTitle}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
        </div>

        {/* Right Column: Invitations, Schedule & Materials */}
        <div className="space-y-2.5">
          {/* Send Invites Selector */}
          {!isInquiry && (
            <div className="rounded-xl border border-stone-200/80 bg-stone-50/60 p-3 dark:border-stone-800 dark:bg-stone-900/40">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200">
                Send Invites To
              </p>
              {isDemo && (
                <p className="mt-0.5 text-[10px] font-normal text-stone-400">
                  Targets pending demo requests by email, not enrolled students.
                </p>
              )}
              <div className="mt-1.5 flex flex-wrap gap-4">
                {(["all", "selected"] as const).map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 cursor-pointer"
                  >
                    <input
                      type="radio"
                      checked={sendTo === opt}
                      onChange={() => setSendTo(opt)}
                      className="h-3.5 w-3.5 accent-yellow-400"
                    />
                    {SEND_TO_LABELS[opt]}
                  </label>
                ))}
              </div>

              {sendTo === "selected" && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        placeholder={isDemo ? "Search demo requests…" : "Search students…"}
                        className={`${inputClass} !mt-0`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={selectAll}
                      className="shrink-0 rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700 transition-colors"
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={deselectAll}
                      className="shrink-0 rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700 transition-colors"
                    >
                      Clear
                    </button>
                  </div>

                  <p className="text-[10px] font-semibold text-stone-400">
                    {selectedIds.size} of {selectableOptions.length}{" "}
                    {isDemo ? "demo requests" : "students"} selected
                  </p>

                  <div className="max-h-28 space-y-1 overflow-y-auto rounded-xl border border-stone-200/80 bg-white p-1 dark:border-stone-800 dark:bg-stone-900/80 no-scrollbar">
                    {filteredOptions.length === 0 ? (
                      <p className="p-2 text-center text-xs text-stone-400">
                        {isDemo ? "No matching demo requests" : "No matching students"}
                      </p>
                    ) : (
                      filteredOptions.map((s) => (
                        <label
                          key={s.id}
                          className="flex cursor-pointer items-center justify-between gap-2 rounded-lg p-1 hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <input
                              type="checkbox"
                              checked={selectedIds.has(s.id)}
                              onChange={() => toggleStudent(s.id)}
                              className="h-3.5 w-3.5 accent-yellow-400 rounded shrink-0"
                            />
                            <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 truncate">
                              {s.name}
                            </span>
                          </div>
                          <span className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] font-bold text-stone-600 dark:bg-stone-800 dark:text-stone-300 shrink-0">
                            {s.sublabel}
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Repeat schedule options (create mode) */}
          {props.mode === "create" && (
            <div className="rounded-xl border border-stone-200/80 bg-stone-50/60 p-3 dark:border-stone-800 dark:bg-stone-900/40 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200">
                Recurring Schedule
              </p>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 cursor-pointer">
                  <input
                    name="repeat_weekdays"
                    type="checkbox"
                    className="h-3.5 w-3.5 accent-yellow-400"
                  />
                  Weekdays (Mon–Fri)
                </label>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 cursor-pointer">
                  <input
                    name="repeat_weekends"
                    type="checkbox"
                    className="h-3.5 w-3.5 accent-yellow-400"
                  />
                  Weekends (Sat–Sun)
                </label>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Repeat Until
                  <input
                    name="repeat_until"
                    type="date"
                    className={inputClass}
                  />
                </label>
              </div>
            </div>
          )}

          {/* Attachments */}
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Session Resource Material (PDF / Homework)
            <input
              name="attachment"
              type="file"
              className="mt-1 block w-full text-xs text-stone-600 file:mr-3 file:rounded-xl file:border-0 file:bg-yellow-400 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-stone-950 hover:file:bg-yellow-300 dark:text-stone-400 cursor-pointer"
            />
            <span className="mt-0.5 block text-[10px] font-normal text-stone-400">
              {ev?.attachment_name
                ? `Current file: ${ev.attachment_name}`
                : "Optional attachment (max 10 MB)."}
            </span>
          </label>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2.5 pt-2.5 border-t border-stone-100 dark:border-stone-800">
        {inModal ? (
          <AdminButton
            type="button"
            variant="outline"
            size="sm"
            onClick={props.onDone}
          >
            Cancel
          </AdminButton>
        ) : (
          <Link href={`${base}/calendar`}>
            <AdminButton type="button" variant="outline" size="sm">
              Cancel
            </AdminButton>
          </Link>
        )}

        <AdminButton
          type="submit"
          size="sm"
          loading={pending}
        >
          {isEdit ? "Save Changes & Notify" : "Schedule & Send Invites"}
        </AdminButton>
      </div>
    </form>
  );
}
