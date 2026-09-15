import { getEnquiryStudents, getMeetingInvitees } from "@/app/lib/roster";
import EventForm from "../EventForm";

function todayYmd() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export default async function AddEventPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; hrs?: string }>;
}) {
  const { date, hrs } = await searchParams;
  const [enquiryStudents, allOffline] = await Promise.all([
    getEnquiryStudents(),
    getMeetingInvitees(null),
  ]);

  const allStudents = allOffline.map((s) => ({
    userId: s.userId,
    name: s.name,
    class: s.class,
    type: s.type,
  }));

  const defaultDate =
    date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : todayYmd();

  const hourNum = Number(hrs);
  const defaultTime =
    Number.isInteger(hourNum) && hourNum >= 0 && hourNum <= 23
      ? `${String(hourNum).padStart(2, "0")}:00`
      : "09:00";

  return (
    <div className="mx-auto max-w-4xl">
      <h2 className="mb-2 text-base font-bold tracking-tight text-stone-900 dark:text-white">
        New Meeting
      </h2>
      <EventForm
        mode="create"
        defaultDate={defaultDate}
        defaultTime={defaultTime}
        enquiryStudents={enquiryStudents}
        allStudents={allStudents}
      />
    </div>
  );
}
