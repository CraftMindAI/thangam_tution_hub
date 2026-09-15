"use client";

import { useActionState, useMemo, useState } from "react";
import {
  addStudent,
  importStudents,
  deleteStudent,
  sendStudentPasswordReset,
} from "@/app/actions/students";
import { Users, X, Plus, Download, Search } from "@/app/components/icons";
import {
  STUDENT_CLASSES,
  STUDENT_TYPES,
  STUDENT_TYPE_LABELS,
  type StudentType,
} from "@/app/lib/students";
import {
  AdminCard,
  AdminBadge,
  AdminButton,
  AdminTableContainer,
  tableClasses,
} from "../_components/ui";

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
  "mt-1.5 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-xs font-semibold text-stone-900 outline-none placeholder:text-stone-400 focus:border-yellow-400 focus:bg-white dark:border-stone-800 dark:bg-stone-900 dark:text-white dark:focus:border-yellow-400 transition-colors";

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
      <AdminButton
        type="submit"
        variant="outline"
        size="sm"
        loading={pending}
        disabled={!email}
      >
        Reset Pass
      </AdminButton>
      {state && "success" in state && (
        <span className="text-[11px] font-bold text-yellow-600 dark:text-yellow-400">
          Sent
        </span>
      )}
      {state && "error" in state && (
        <span className="text-[11px] font-bold text-red-500">
          {state.error}
        </span>
      )}
    </form>
  );
}

export default function StudentManager({ students }: { students: Student[] }) {
  const [mode, setMode] = useState<"manual" | "excel" | null>(null);

  const [nameQuery, setNameQuery] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<StudentType | "">("");

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

  return (
    <div className="space-y-6">
      {/* Top Action Toggle Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Actions:
          </span>
          <AdminButton
            variant={mode === "manual" ? "primary" : "outline"}
            size="sm"
            onClick={() => setMode(mode === "manual" ? null : "manual")}
            icon={Plus}
          >
            Add Student
          </AdminButton>
          <AdminButton
            variant={mode === "excel" ? "primary" : "outline"}
            size="sm"
            onClick={() => setMode(mode === "excel" ? null : "excel")}
            icon={Download}
          >
            Import Excel
          </AdminButton>
        </div>

        <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
          Total in Roster: <strong className="text-stone-900 dark:text-white">{students.length}</strong>
        </span>
      </div>

      {/* Manual or Excel Form Panels */}
      {mode && (
        <AdminCard className="p-6 sm:p-8 animate-in fade-in slide-in-from-top-3 duration-200">
          {mode === "manual" ? (
            <form key={manualKey} action={addAction}>
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <h3 className="text-base font-extrabold text-stone-900 dark:text-white">
                    Add Single Student
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Register a new student directly into the active roster.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMode(null)}
                  className="rounded-xl p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {addState && "error" in addState && (
                <div className="mb-4 rounded-2xl bg-yellow-400/20 p-3.5 text-xs font-bold text-yellow-800 dark:text-yellow-300 border border-yellow-400/40">
                  {addState.error}
                </div>
              )}
              {addState && "success" in addState && (
                <div className="mb-4 rounded-2xl bg-emerald-500/15 p-3.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  {addState.message}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Full Name
                    <input name="name" required className={inputClass} placeholder="Student full name" />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Class / Grade
                    <select name="class" required defaultValue="" className={inputClass}>
                      <option value="" disabled>
                        Select Class
                      </option>
                      {STUDENT_CLASSES.map((c) => (
                        <option key={c} value={c}>
                          Class {c}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    School Name
                    <input name="school" required className={inputClass} placeholder="School name" />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Location / Area
                    <input
                      name="location"
                      required
                      placeholder="e.g. West Mambalam"
                      className={inputClass}
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Student Email
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="student@example.com"
                      className={inputClass}
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Student Phone
                    <input name="phone" type="tel" required placeholder="10-digit mobile" className={inputClass} />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Parent Email <span className="font-normal text-stone-400">(optional)</span>
                    <input name="parent_email" type="email" placeholder="parent@example.com" className={inputClass} />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Parent Phone
                    <input
                      name="parent_phone"
                      type="tel"
                      required
                      placeholder="10-digit parent mobile"
                      className={inputClass}
                    />
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <AdminButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setMode(null)}
                >
                  Cancel
                </AdminButton>
                <AdminButton
                  type="submit"
                  size="sm"
                  loading={addPending}
                >
                  Save Student
                </AdminButton>
              </div>
            </form>
          ) : (
            <form key={excelKey} action={importAction}>
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-base font-extrabold text-stone-900 dark:text-white">
                    Bulk Import Students (Excel / CSV)
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Upload a spreadsheet with student records to import multiple entries at once.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMode(null)}
                  className="rounded-xl p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {importState && "error" in importState && (
                <div className="mb-4 rounded-2xl bg-yellow-400/20 p-3.5 text-xs font-bold text-yellow-800 dark:text-yellow-300 border border-yellow-400/40">
                  {importState.error}
                </div>
              )}
              {importState && "success" in importState && (
                <div className="mb-4 rounded-2xl bg-emerald-500/15 p-3.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  {importState.message}
                </div>
              )}

              <div className="rounded-2xl bg-stone-50 p-4 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-800/80">
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  Required columns in the first row:
                </p>
                <p className="mt-1 font-mono text-[11px] font-bold text-yellow-700 dark:text-yellow-400">
                  {TEMPLATE_COLUMNS.join(" · ")}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    Supported formats: .xlsx, .xls, .csv
                  </span>
                  <a
                    href={templateHref}
                    download="students-template.csv"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-700 dark:text-yellow-400 hover:underline"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download CSV Template
                  </a>
                </div>
              </div>

              <div className="mt-4">
                <input
                  name="file"
                  type="file"
                  required
                  accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
                  className="block w-full text-xs text-stone-600 file:mr-3 file:rounded-full file:border-0 file:bg-yellow-400 file:px-4 file:py-2.5 file:text-xs file:font-bold file:text-stone-950 hover:file:bg-yellow-300 dark:text-stone-400 cursor-pointer"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <AdminButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setMode(null)}
                >
                  Cancel
                </AdminButton>
                <AdminButton
                  type="submit"
                  size="sm"
                  loading={importPending}
                >
                  Import Students
                </AdminButton>
              </div>
            </form>
          )}
        </AdminCard>
      )}

      {/* Filter Toolbar Card */}
      <AdminCard className="p-5 sm:p-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[220px] flex-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Search By Name
              <div className="relative mt-1.5">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  type="search"
                  value={nameQuery}
                  onChange={(e) => setNameQuery(e.target.value)}
                  placeholder="Search student name…"
                  className={`${inputClass} !mt-0 pl-10`}
                />
              </div>
            </label>
          </div>

          <div className="min-w-[140px]">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Grade / Class
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
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

          <div className="min-w-[140px]">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Batch Type
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as StudentType | "")}
                className={inputClass}
              >
                <option value="">All Types</option>
                {STUDENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {STUDENT_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex items-center gap-2 pt-2 sm:pt-0">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              Showing {visible.length} of {students.length}
            </span>
            {filtersOn && (
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => {
                  setNameQuery("");
                  setClassFilter("");
                  setTypeFilter("");
                }}
              >
                Reset
              </AdminButton>
            )}
          </div>
        </div>
      </AdminCard>

      {/* Student Roster Table */}
      <AdminTableContainer
        header={
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-stone-900 dark:text-yellow-400">
              Student Directory ({visible.length})
            </h2>
          </div>
        }
      >
        <table className={tableClasses.table}>
          <thead className={tableClasses.thead}>
            <tr>
              <th className={tableClasses.th}>Student Name</th>
              <th className={tableClasses.th}>Batch</th>
              <th className={tableClasses.th}>Grade</th>
              <th className={tableClasses.th}>School</th>
              <th className={tableClasses.th}>Location</th>
              <th className={tableClasses.th}>Contact Email & Phone</th>
              <th className={tableClasses.th}>Parent Contact</th>
              <th className={`${tableClasses.th} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody className={tableClasses.tbody}>
            {visible.length ? (
              visible.map((s) => (
                <tr key={s.id} className={tableClasses.tr}>
                  <td className={tableClasses.td}>
                    <p className="font-extrabold text-stone-900 dark:text-white">
                      {s.name}
                    </p>
                  </td>
                  <td className={tableClasses.td}>
                    <AdminBadge variant={s.type === "new_student" ? "yellow" : "dark"}>
                      {STUDENT_TYPE_LABELS[s.type]}
                    </AdminBadge>
                  </td>
                  <td className={tableClasses.td}>
                    <span className="font-bold text-xs text-stone-700 dark:text-stone-300">
                      {s.class || "—"}
                    </span>
                  </td>
                  <td className={tableClasses.td}>
                    <span className="text-xs text-stone-600 dark:text-stone-300">
                      {s.school || "—"}
                    </span>
                  </td>
                  <td className={tableClasses.td}>
                    <span className="text-xs text-stone-500 dark:text-stone-400">
                      {s.location ?? "—"}
                    </span>
                  </td>
                  <td className={tableClasses.td}>
                    <p className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                      {s.email}
                    </p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      {s.phone}
                    </p>
                  </td>
                  <td className={tableClasses.td}>
                    <p className="text-xs text-stone-700 dark:text-stone-300">
                      {s.parent_phone || s.parent_email || "—"}
                    </p>
                  </td>
                  <td className={`${tableClasses.td} text-right`}>
                    <div className="flex items-center justify-end gap-2">
                      <RowResetPassword email={s.email} name={s.name} />
                      <button
                        type="button"
                        onClick={() => setPendingDelete(s)}
                        aria-label={`Remove ${s.name}`}
                        className="rounded-xl p-2 text-stone-400 hover:bg-red-500/10 hover:text-red-600 transition-colors"
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
                  colSpan={8}
                  className="py-14 text-center text-stone-500 dark:text-stone-400"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-400">
                    <Users className="h-6 w-6" />
                  </div>
                  <p className="mt-3 text-sm font-bold text-stone-800 dark:text-stone-200">
                    {filtersOn
                      ? "No students match the current filters"
                      : "No students currently in the directory"}
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Add a student or import via Excel above.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </AdminTableContainer>

      {/* Delete Confirmation Modal */}
      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setPendingDelete(null)}
          />
          <div className="relative w-full max-w-sm rounded-[28px] border border-stone-200/90 bg-white p-6 shadow-2xl dark:border-stone-800 dark:bg-[#14151b]">
            <h3 className="text-lg font-extrabold text-stone-900 dark:text-white">
              Delete Student?
            </h3>
            <p className="mt-2 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              This will permanently remove{" "}
              <strong className="text-stone-900 dark:text-white">
                {pendingDelete.name}
              </strong>{" "}
              from the active roster and revoke portal access.
            </p>
            <div className="mt-6 flex justify-end gap-2.5">
              <AdminButton
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPendingDelete(null)}
              >
                Cancel
              </AdminButton>
              <form
                action={deleteStudent}
                onSubmit={() => setPendingDelete(null)}
              >
                <input type="hidden" name="id" value={pendingDelete.id} />
                <AdminButton
                  type="submit"
                  variant="danger"
                  size="sm"
                >
                  Delete Student
                </AdminButton>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
