import { getRoster } from "@/app/lib/roster";
import StudentManager, { type Student } from "./StudentManager";

export default async function StudentManagementPage() {
  const roster = await getRoster();

  const students: Student[] = roster.map((s) => ({
    id: s.userId,
    name: s.name,
    class: s.class,
    school: s.school,
    location: s.location,
    email: s.email,
    phone: s.phone ?? "",
    parent_email: s.parent_email,
    parent_phone: s.parent_phone,
  }));

  const stats = [
    { label: "Total Students", value: students.length },
    {
      label: "Classes",
      value: new Set(students.map((s) => s.class).filter(Boolean)).size,
    },
    {
      label: "Schools",
      value: new Set(students.map((s) => s.school).filter(Boolean)).size,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-stone-200/70 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-800"
          >
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {s.value}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <StudentManager students={students} />
    </div>
  );
}
