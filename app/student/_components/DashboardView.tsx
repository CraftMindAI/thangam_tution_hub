import Link from "next/link";
import { createClient } from "../../lib/supabase/server";
import { buildStudentPath } from "../../lib/secure-path";
import {
  AdminPageHeader,
  AdminCard,
  AdminBadge,
  AdminButton,
  AdminTableContainer,
  tableClasses,
} from "@/app/admin/_components/ui";
import {
  MessageSquare,
  Plus,
  GraduationCap,
  CalendarClock,
} from "@/app/components/icons";

const roleLabels: Record<string, string> = {
  existing_student: "Offline Student",
  new_student: "Online Student",
  admin: "Admin",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function DashboardView({ userId }: { userId: string }) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, class")
    .eq("id", userId)
    .single();

  const role = profile?.role as string | undefined;

  const [{ data: existing }, { data: newReq }, { data: enquiries }, { data: upcomingMeetings }] =
    await Promise.all([
      supabase
        .from("existing_student_requests")
        .select("student_name")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("new_student_requests")
        .select("student_name")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("student_enquiries")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("calendar_events")
        .select("id, title, starts_at, duration_minutes")
        .gte("starts_at", new Date().toISOString())
        .order("starts_at", { ascending: true })
        .limit(1),
    ]);

  const displayName = existing?.student_name ?? newReq?.student_name ?? profile?.full_name ?? "Student";
  const nextMeeting = upcomingMeetings?.[0];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Welcome, ${displayName}!`}
        subtitle="Here is a quick overview of your enrolled classes, upcoming sessions, and enquiries."
        actions={
          <Link href={buildStudentPath(userId, "/enquiry")}>
            <AdminButton size="sm" icon={Plus}>
              New Enquiry
            </AdminButton>
          </Link>
        }
      />

      {/* KPI Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AdminCard className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-stone-950 shadow-md shadow-yellow-500/20">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-stone-900 dark:text-white">
              {enquiries?.length ?? 0}
            </p>
            <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              Total Enquiries Raised
            </p>
          </div>
        </AdminCard>

        <AdminCard className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-200">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <AdminBadge variant="yellow">
                {role ? roleLabels[role] ?? role : "Student"}
              </AdminBadge>
              {profile?.class && (
                <AdminBadge variant="gray">Class {profile.class}</AdminBadge>
              )}
            </div>
            <p className="mt-1 text-xs font-semibold text-stone-500 dark:text-stone-400">
              Enrollment Status
            </p>
          </div>
        </AdminCard>

        <AdminCard className="p-5 flex items-center gap-4 sm:col-span-2 lg:col-span-1">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-200">
            <CalendarClock className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            {nextMeeting ? (
              <>
                <p className="truncate text-xs font-bold text-stone-900 dark:text-white">
                  {nextMeeting.title}
                </p>
                <p className="text-[11px] font-semibold text-yellow-600 dark:text-yellow-400">
                  {formatDateTime(nextMeeting.starts_at)}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  No upcoming meetings
                </p>
                <p className="text-[11px] text-stone-400">Check back later</p>
              </>
            )}
            <p className="mt-0.5 text-[10px] uppercase tracking-wider font-bold text-stone-400">
              Next Live Session
            </p>
          </div>
        </AdminCard>
      </div>

      {/* Enquiries Section */}
      <section>
        <AdminTableContainer
          header={
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-stone-900 dark:text-white">
                  Your Enquiries ({enquiries?.length ?? 0})
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  History of your submitted queries and doubt-clearing questions.
                </p>
              </div>
              <Link href={buildStudentPath(userId, "/enquiry")}>
                <AdminButton size="sm" variant="outline" icon={Plus}>
                  Ask Doubt
                </AdminButton>
              </Link>
            </div>
          }
        >
          <table className={tableClasses.table}>
            <thead className={tableClasses.thead}>
              <tr>
                <th className={tableClasses.th}>Title & Question</th>
                <th className={tableClasses.th}>Subject</th>
                <th className={`${tableClasses.th} text-right`}>Submitted On</th>
              </tr>
            </thead>
            <tbody className={tableClasses.tbody}>
              {enquiries?.length ? (
                enquiries.map((e) => (
                  <tr key={e.id} className={tableClasses.tr}>
                    <td className={tableClasses.td}>
                      <p className="font-extrabold text-stone-900 dark:text-white">
                        {e.title}
                      </p>
                      {e.description && (
                        <p className="mt-0.5 max-w-lg text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
                          {e.description}
                        </p>
                      )}
                    </td>
                    <td className={tableClasses.td}>
                      <AdminBadge variant="yellow">{e.subject}</AdminBadge>
                    </td>
                    <td className={`${tableClasses.td} whitespace-nowrap text-right text-xs font-semibold text-stone-500 dark:text-stone-400`}>
                      {formatDateTime(e.created_at)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-12 text-center text-xs font-medium text-stone-400"
                  >
                    You haven&apos;t submitted any enquiries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </AdminTableContainer>
      </section>
    </div>
  );
}
