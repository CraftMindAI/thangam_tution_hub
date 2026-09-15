import { getRoster } from "@/app/lib/roster";
import { Users, BookOpen, Inbox, GraduationCap } from "@/app/components/icons";
import StudentManager, { type Student } from "./StudentManager";
import { AdminPageHeader, AdminStatCard } from "../_components/ui";

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

  const onlineCount = students.filter((s) => s.type === "new_student").length;
  const offlineCount = students.filter((s) => s.type === "existing_student").length;
  const classCount = new Set(students.map((s) => s.class).filter(Boolean)).size;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Student Management"
        subtitle="Roster database, student registrations, batch allocations, and credential resets."
      />

      {/* Stat Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Total Students"
          value={students.length}
          subtitle="Enrolled student accounts"
          icon={Users}
          variant="yellow"
          trend="Active Roster"
          miniChart={[45, 60, 55, 80, 70, 90, 100]}
        />
        <AdminStatCard
          label="Offline Students"
          value={offlineCount}
          subtitle="In-person classroom attendees"
          icon={BookOpen}
          miniChart={[50, 65, 45, 75, 60, 85, 80]}
        />
        <AdminStatCard
          label="Online Students"
          value={onlineCount}
          subtitle="Remote live stream participants"
          icon={Inbox}
          miniChart={[25, 40, 60, 50, 75, 65, 90]}
        />
        <AdminStatCard
          label="Active Grades"
          value={classCount}
          subtitle="Distinct class levels configured"
          icon={GraduationCap}
          miniChart={[30, 45, 60, 70, 50, 80, 75]}
        />
      </div>

      <StudentManager students={students} />
    </div>
  );
}
