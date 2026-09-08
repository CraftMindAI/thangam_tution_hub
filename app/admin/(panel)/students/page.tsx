import { createClient } from "../../../lib/supabase/server";
import StudentManager, { type Student } from "./StudentManager";

export default async function StudentManagementPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("students")
    .select(
      "id, name, class, school, location, email, phone, parent_email, parent_phone"
    )
    .order("created_at", { ascending: false });

  const students = (data ?? []) as Student[];

  const stats = [
    { label: "Total Students", value: students.length },
    {
      label: "Classes",
      value: new Set(students.map((s) => s.class)).size,
    },
    {
      label: "Schools",
      value: new Set(students.map((s) => s.school)).size,
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
