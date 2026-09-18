"use client";

import { useActionState, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createTask } from "@/app/actions/tasks";
import { ClipboardList, Plus, X } from "@/app/components/icons";
import { STUDENT_CLASSES } from "@/app/lib/students";
import { SEND_TO_OPTIONS, TASK_SEND_TO_LABELS } from "@/app/lib/tasks";
import { AdminCard, AdminButton } from "../_components/ui";

const inputClass =
  "mt-1.5 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-xs font-semibold text-stone-900 outline-none placeholder:text-stone-400 focus:border-yellow-400 focus:bg-white dark:border-stone-800 dark:bg-stone-900 dark:text-white dark:focus:border-yellow-400 dark:focus:bg-stone-900 [color-scheme:light] dark:[color-scheme:dark] transition-colors";

export type StudentOption = {
  userId: string;
  name: string;
  class: string;
  email: string;
};

export default function TaskForm({
  students,
  onDone,
}: {
  students: StudentOption[];
  onDone?: () => void;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createTask, undefined);

  // Remount the form (clearing its fields) and pop the results dialog open
  // the render after a new result arrives — no setState-in-effect needed.
  const [formKey, setFormKey] = useState(0);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [handled, setHandled] = useState(state);
  if (state !== handled) {
    setHandled(state);
    if (state && "success" in state) {
      setFormKey((k) => k + 1);
      setResultsOpen(true);
      router.refresh();
    }
  }

  function closeResults() {
    setResultsOpen(false);
    onDone?.();
  }

  const [classFilter, setClassFilter] = useState("");
  const [sendTo, setSendTo] = useState<(typeof SEND_TO_OPTIONS)[number]>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [studentSearch, setStudentSearch] = useState("");

  const classStudents = useMemo(
    () => (classFilter ? students.filter((s) => s.class === classFilter) : students),
    [students, classFilter]
  );

  const filteredStudents = useMemo(() => {
    if (!studentSearch.trim()) return classStudents;
    const q = studentSearch.toLowerCase();
    return classStudents.filter(
      (s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
    );
  }, [classStudents, studentSearch]);

  function toggleStudent(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <AdminCard className="p-6 sm:p-8">
      <form key={formKey} action={formAction}>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-400 text-stone-950 shadow-md">
            <ClipboardList className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-stone-900 dark:text-white">
              Create New Task
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Assign homework or a task to a class of students, or hand-pick who gets it.
            </p>
          </div>
        </div>

        {state && "error" in state && (
          <div className="mt-4 rounded-2xl bg-yellow-400/20 p-3.5 text-xs font-bold text-yellow-800 dark:text-yellow-300 border border-yellow-400/40">
            {state.error}
          </div>
        )}

        <input type="hidden" name="send_to" value={sendTo} />
        {sendTo === "selected" &&
          [...selectedIds].map((id) => (
            <input key={id} type="hidden" name="selected_student_ids" value={id} />
          ))}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Subject
              <input
                name="subject"
                type="text"
                required
                placeholder="e.g. Class 8 Mathematics — Chapter 4 worksheet"
                className={inputClass}
              />
            </label>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Description
              <textarea
                name="description"
                rows={3}
                placeholder="Instructions, topics to cover, references…"
                className={inputClass}
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Document Upload
              <input
                name="document"
                type="file"
                className="mt-1.5 block w-full text-xs text-stone-600 file:mr-3 file:rounded-xl file:border-0 file:bg-yellow-400 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-stone-950 hover:file:bg-yellow-300 dark:text-stone-400 cursor-pointer"
              />
              <span className="mt-0.5 block text-[10px] font-normal text-stone-400">
                Sent as an email attachment only (max 10 MB) — not stored.
              </span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Duration (Days)
              <input
                name="duration_days"
                type="number"
                min={1}
                max={365}
                placeholder="e.g. 7"
                className={inputClass}
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Class
              <select
                name="class_filter"
                value={classFilter}
                onChange={(e) => {
                  setClassFilter(e.target.value);
                  setSelectedIds(new Set());
                }}
                className={inputClass}
              >
                <option value="">All Classes</option>
                {STUDENT_CLASSES.map((c) => (
                  <option key={c} value={c}>
                    Class {c}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="sm:col-span-2 rounded-2xl border border-stone-200/80 bg-stone-50/60 p-4 dark:border-stone-800 dark:bg-stone-900/40">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200">
              Assign To
            </p>
            <div className="mt-1.5 flex flex-wrap gap-4">
              {SEND_TO_OPTIONS.map((opt) => (
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
                  {TASK_SEND_TO_LABELS[opt]}
                </label>
              ))}
            </div>

            {sendTo === "selected" && !classFilter && (
              <p className="mt-3 rounded-xl border border-dashed border-stone-300 bg-stone-50 p-3 text-center text-xs font-semibold text-stone-500 dark:border-stone-700 dark:bg-stone-900/40 dark:text-stone-400">
                Pick a class above to see its existing students.
              </p>
            )}

            {sendTo === "selected" && classFilter && (
              <div className="mt-3 space-y-2">
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search students…"
                  className={`${inputClass} !mt-0`}
                />
                <p className="text-[10px] font-semibold text-stone-400">
                  {selectedIds.size} of {classStudents.length} existing students selected in
                  Class {classFilter}
                </p>
                <div className="max-h-40 space-y-1 overflow-y-auto rounded-xl border border-stone-200/80 bg-white p-1 dark:border-stone-800 dark:bg-stone-900/80 no-scrollbar">
                  {filteredStudents.length === 0 ? (
                    <p className="p-2 text-center text-xs text-stone-400">
                      No matching students
                    </p>
                  ) : (
                    filteredStudents.map((s) => (
                      <label
                        key={s.userId}
                        className="flex cursor-pointer items-center justify-between gap-2 rounded-lg p-1 hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(s.userId)}
                            onChange={() => toggleStudent(s.userId)}
                            className="h-3.5 w-3.5 accent-yellow-400 rounded shrink-0"
                          />
                          <span className="min-w-0 leading-tight">
                            <span className="block text-xs font-semibold text-stone-800 dark:text-stone-200 truncate">
                              {s.name}
                            </span>
                            <span className="block text-[10px] text-stone-400 truncate">
                              {s.email || "No email on file"}
                            </span>
                          </span>
                        </div>
                        <span className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[10px] font-bold text-stone-600 dark:bg-stone-800 dark:text-stone-300 shrink-0">
                          Class {s.class}
                        </span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <AdminButton type="submit" loading={pending} icon={Plus}>
            Assign Task
          </AdminButton>
        </div>
      </form>

      {resultsOpen && state && "success" in state && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={closeResults} />
          <div className="relative w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl dark:border-stone-800 dark:bg-[#14151b]">
            <button
              type="button"
              onClick={closeResults}
              aria-label="Close"
              className="absolute right-3 top-3 rounded-xl p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <p className="text-sm font-bold text-stone-900 dark:text-white">Task assigned</p>
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">{state.message}</p>

            {(() => {
              const failed = state.results.filter((r) => !r.sent);
              return failed.length === 0 ? (
                <p className="mt-3 text-xs font-semibold text-stone-500 dark:text-stone-400">
                  All emails sent successfully.
                </p>
              ) : (
                <div className="mt-3 max-h-52 space-y-1 overflow-y-auto rounded-xl border border-stone-200/80 bg-stone-50 p-2 dark:border-stone-800 dark:bg-stone-900/60 no-scrollbar">
                  <p className="px-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Failed to send
                  </p>
                  {failed.map((r) => (
                    <p
                      key={r.email}
                      className="text-xs font-semibold break-all text-red-600 dark:text-red-400"
                    >
                      {r.email}
                    </p>
                  ))}
                </div>
              );
            })()}

            <AdminButton
              type="button"
              size="sm"
              className="mt-4 w-full justify-center"
              onClick={closeResults}
            >
              OK
            </AdminButton>
          </div>
        </div>
      )}
    </AdminCard>
  );
}
