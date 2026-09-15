"use client";

import { useActionState, useMemo, useState } from "react";
import {
  addStudent,
  importStudents,
  deleteStudent,
  sendStudentPasswordReset,
} from "@/app/actions/students";
import { Users, X } from "@/app/components/icons";
import {
  STUDENT_CLASSES,
  STUDENT_TYPES,
  STUDENT_TYPE_LABELS,
  type StudentType,
} from "@/app/lib/students";

export type Student = {
  id: string;
  name: string;
  type: StudentType;
  class: string;
  school: string;
  location: string | null;
  email: string;
  phone: string;
  parent_email: string | null;
  parent_phone: string | null;
};

const inputClass =
  "mt-1.5 w-full rounded-lg border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-500/20 dark:border-stone-700 dark:bg-stone-900 dark:text-white";

const TEMPLATE_COLUMNS = [
  "Name",
  "Class",
  "School",
  "Location",
  "Email",
  "Phone",
  "Parent Email",
  "Parent Phone",
];

const templateHref =
  "data:text/csv;charset=utf-8," +
  encodeURIComponent(
    TEMPLATE_COLUMNS.join(",") +
      "\nRavi Kumar,8,St. Mary's School,West Mambalam,ravi@example.com,9876543210,parent@example.com,9876500000\n"
  );

function RowResetPassword({ email, name }: { email: string; name: string }) {
  const [state, formAction, pending] = useActionState(
    sendStudentPasswordReset,
    undefined
  );

  return (
    <form action={formAction} className="inline-flex items-center gap-2">
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="name" value={name} />
      <button
        type="submit"
        disabled={pending || !email}
        className="rounded-full border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-700 transition-colors hover:border-stone-500 hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-600 dark:text-stone-200 dark:hover:border-stone-400 dark:hover:text-white"
      >
        {pending ? "Sending…" : "Reset password"}
      </button>
      {state && "success" in state && (
        <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
          Sent
        </span>
      )}
      {state && "error" in state && (
        <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">
          {state.error}
        </span>
      )}
    </form>
  );
}

function TypeBadge({ type }: { type: StudentType }) {
  const isNew = type === "new_student";
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
        isNew
          ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
          : "bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300"
      }`}
    >
      {STUDENT_TYPE_LABELS[type]}
    </span>
  );
}

export default function StudentManager({ students }: { students: Student[] }) {
  const [mode, setMode] = useState<"manual" | "excel" | null>(null);

  const [nameQuery, setNameQuery] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<StudentType | "">("");

  // `students` arrives sorted (new students first, then alphabetical), and
  // filtering preserves that order.
  const visible = useMemo(() => {
    const q = nameQuery.trim().toLowerCase();
    return students.filter(
      (s) =>
        (!q || s.name.toLowerCase().includes(q)) &&
        (!classFilter || s.class === classFilter) &&
        (!typeFilter || s.type === typeFilter)
    );
  }, [students, nameQuery, classFilter, typeFilter]);

  const filtersOn = Boolean(nameQuery || classFilter || typeFilter);

  const [addState, addAction, addPending] = useActionState(addStudent, undefined);
  const [importState, importAction, importPending] = useActionState(
    importStudents,
    undefined
  );

  const [pendingDelete, setPendingDelete] = useState<Student | null>(null);

  // Remount each form (clearing its fields) after a successful submit.
  const [manualKey, setManualKey] = useState(0);
  const [excelKey, setExcelKey] = useState(0);

  const [handledAdd, setHandledAdd] = useState(addState);
  if (addState !== handledAdd) {
    setHandledAdd(addState);
    if (addState && "success" in addState) {
      setManualKey((k) => k + 1);
      setMode(null);
    }
  }
  const [handledImport, setHandledImport] = useState(importState);
  if (importState !== handledImport) {
    setHandledImport(importState);
    if (importState && "success" in importState) setExcelKey((k) => k + 1);
  }

  const modeBtn = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
      active
        ? "bg-gradient-to-r from-stone-700 to-stone-900 text-white shadow-md shadow-stone-900/20"
        : "border border-stone-300 text-stone-700 hover:border-stone-500 hover:text-stone-900 dark:border-stone-600 dark:text-stone-200 dark:hover:border-stone-400 dark:hover:text-white"
    }`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={() => setMode(mode === "manual" ? null : "manual")}
          className={modeBtn(mode === "manual")}
        >
          + Add Student
        </button>
        <button
          type="button"
          onClick={() => setMode(mode === "excel" ? null : "excel")}
          className={modeBtn(mode === "excel")}
        >
          Import from Excel
        </button>
      </div>

      {mode && (
        <div className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-800">
          {mode === "manual" ? (
            <form key={manualKey} action={addAction}>
            {addState && "error" in addState && (
              <p className="mb-3 rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                {addState.error}
              </p>
            )}
            {addState && "success" in addState && (
              <p className="mb-3 rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                {addState.message}
              </p>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
                Name
                <input name="name" required className={inputClass} />
              </label>
              <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
                Class
                <select name="class" required defaultValue="" className={inputClass}>
                  <option value="" disabled>
                    Select class
                  </option>
                  {STUDENT_CLASSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
                School
                <input name="school" required className={inputClass} />
              </label>
              <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
                Location
                <input
                  name="location"
                  required
                  placeholder="Area / locality"
                  className={inputClass}
                />
              </label>
              <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
                Email
                <input
                  name="email"
                  type="email"
                  required
                  className={inputClass}
                />
              </label>
              <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
                Phone
                <input name="phone" type="tel" required className={inputClass} />
              </label>
              <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
                Parent email{" "}
                <span className="font-normal text-stone-400">(optional)</span>
                <input name="parent_email" type="email" className={inputClass} />
              </label>
              <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
                Parent phone
                <input
                  name="parent_phone"
                  type="tel"
                  required
                  className={inputClass}
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={addPending}
              className="mt-5 rounded-full bg-gradient-to-r from-stone-700 to-stone-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-stone-900/20 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {addPending ? "Saving…" : "Save Student"}
            </button>
          </form>
        ) : (
          <form key={excelKey} action={importAction}>
            {importState && "error" in importState && (
              <p className="mb-3 rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                {importState.error}
              </p>
            )}
            {importState && "success" in importState && (
              <p className="mb-3 rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                {importState.message}
              </p>
            )}

            <p className="text-sm text-stone-600 dark:text-stone-400">
              Upload a <code>.xlsx</code>, <code>.xls</code> or <code>.csv</code>{" "}
              file. First row must be headers:
            </p>
            <p className="mt-1 text-sm font-medium text-stone-700 dark:text-stone-200">
              {TEMPLATE_COLUMNS.join(" · ")}
            </p>
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
              Class must be LKG, UKG or 1–10.
            </p>
            <a
              href={templateHref}
              download="students-template.csv"
              className="mt-1 inline-block text-sm font-semibold text-yellow-700 hover:underline dark:text-yellow-400"
            >
              Download template
            </a>

            <input
              name="file"
              type="file"
              required
              accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
              className="mt-4 block w-full text-sm text-stone-600 file:mr-3 file:rounded-full file:border-0 file:bg-stone-800 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-stone-700 dark:text-stone-400"
            />

            <button
              type="submit"
              disabled={importPending}
              className="mt-5 rounded-full bg-gradient-to-r from-stone-700 to-stone-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-stone-900/20 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {importPending ? "Importing…" : "Import Students"}
            </button>
          </form>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-stone-200/70 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-800">
        <label className="min-w-[200px] flex-1 text-sm font-medium text-stone-700 dark:text-stone-200">
          Search by name
          <input
            type="search"
            value={nameQuery}
            onChange={(e) => setNameQuery(e.target.value)}
            placeholder="Student name"
            className={inputClass}
          />
        </label>

        <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
          Class
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
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

        <label className="text-sm font-medium text-stone-700 dark:text-stone-200">
          Student type
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as StudentType | "")}
            className={inputClass}
          >
            <option value="">All types</option>
            {STUDENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {STUDENT_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-3 pb-0.5">
          <span className="text-sm text-stone-500 dark:text-stone-400">
            Showing {visible.length} of {students.length}
          </span>
          {filtersOn && (
            <button
              type="button"
              onClick={() => {
                setNameQuery("");
                setClassFilter("");
                setTypeFilter("");
              }}
              className="rounded-full border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-700 transition-colors hover:border-stone-500 hover:text-stone-900 dark:border-stone-600 dark:text-stone-200 dark:hover:border-stone-400 dark:hover:text-white"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-stone-200/70 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-800">
        <table className="w-full min-w-[1240px] text-left text-sm">
          <thead className="border-b border-stone-200/70 text-xs uppercase tracking-wider text-stone-500 dark:border-stone-700 dark:text-stone-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Class</th>
              <th className="px-4 py-3">School</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Parent Email</th>
              <th className="px-4 py-3">Parent Phone</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-700">
            {visible.length ? (
              visible.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3 font-medium text-stone-800 dark:text-stone-200">
                    {s.name}
                  </td>
                  <td className="px-4 py-3">
                    <TypeBadge type={s.type} />
                  </td>
                  <td className="px-4 py-3 text-stone-600 dark:text-stone-400">
                    {s.class || "—"}
                  </td>
                  <td className="px-4 py-3 text-stone-600 dark:text-stone-400">
                    {s.school || "—"}
                  </td>
                  <td className="px-4 py-3 text-stone-600 dark:text-stone-400">
                    {s.location ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-stone-600 dark:text-stone-400">
                    {s.email}
                  </td>
                  <td className="px-4 py-3 text-stone-600 dark:text-stone-400">
                    {s.phone}
                  </td>
                  <td className="px-4 py-3 text-stone-600 dark:text-stone-400">
                    {s.parent_email ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-stone-600 dark:text-stone-400">
                    {s.parent_phone ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <RowResetPassword email={s.email} name={s.name} />
                      <button
                        type="button"
                        onClick={() => setPendingDelete(s)}
                        aria-label={`Remove ${s.name}`}
                        className="rounded-lg p-1.5 text-stone-400 hover:bg-yellow-50 hover:text-yellow-700 dark:hover:bg-yellow-900/30"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="px-4 py-10 text-center text-stone-500 dark:text-stone-400"
                >
                  <Users className="mx-auto h-6 w-6 opacity-50" />
                  <p className="mt-2">
                    {filtersOn
                      ? "No students match these filters."
                      : "No students yet. Add one above."}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
            onClick={() => setPendingDelete(null)}
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-stone-200/70 bg-white p-6 shadow-xl dark:border-stone-800 dark:bg-stone-800">
            <h3 className="font-semibold text-stone-900 dark:text-white">
              Delete student?
            </h3>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
              This will permanently remove{" "}
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                {pendingDelete.name}
              </span>{" "}
              from the roster.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="rounded-full border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-500 hover:text-stone-900 dark:border-stone-600 dark:text-stone-200 dark:hover:border-stone-400 dark:hover:text-white"
              >
                Cancel
              </button>
              <form
                action={deleteStudent}
                onSubmit={() => setPendingDelete(null)}
              >
                <input type="hidden" name="id" value={pendingDelete.id} />
                <button
                  type="submit"
                  className="rounded-full bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-stone-900 shadow-md shadow-yellow-500/20 transition-transform hover:scale-[1.02] hover:bg-yellow-300"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
