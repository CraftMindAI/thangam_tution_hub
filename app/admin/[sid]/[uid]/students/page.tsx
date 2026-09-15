import { getRoster } from "@/app/lib/roster";
import StudentManager, { type Student } from "./StudentManager";

export default async function StudentManagementPage() {
  const roster = await getRoster();

  const students: Student[] = roster.map((s) => ({
    id: s.userId,
    name: s.name,
    type: s.type,
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
      label: "Online Students",
      value: students.filter((s) => s.type === "new_student").length,
    },
    {
      label: "Offline Students",
      value: students.filter((s) => s.type === "existing_student").length,
    },
    {
      label: "Classes",
      value: new Set(students.map((s) => s.class).filter(Boolean)).size,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-stone-200/70 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-800"
          >
            <p className="text-2xl font-bold text-stone-900 dark:text-white">
              {s.value}
            </p>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <StudentManager students={students} />
    </div>
  );
}
