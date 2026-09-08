import { createClient } from "../../lib/supabase/server";
import { MessageSquare } from "../../components/icons";

const feedbackLabels: Record<string, string> = {
  not_satisfied: "Not Satisfied",
  somewhat_good: "Some What Good",
  excellent: "Excellent",
};

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4">
      <dt>{label}</dt>
      <dd className="font-medium text-slate-800 dark:text-slate-200">{value}</dd>
    </div>
  );
}

export default async function StudentEnquiry() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: existing }, { data: newReq }] = await Promise.all([
    supabase
      .from("existing_student_requests")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("new_student_requests")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const enquiry = newReq ?? existing;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        Enquiry
      </h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        The details you submitted when signing up.
      </p>

      <div className="mt-6 rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
          <MessageSquare className="h-5 w-5" />
        </span>
        <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">Details</h2>

        {enquiry ? (
          <dl className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
            <Row label="Student Name" value={enquiry.student_name} />
            <Row label="Standard" value={enquiry.standard} />
            {newReq && (
              <>
                <Row label="School" value={newReq.school_name} />
                <Row label="Parent Name" value={newReq.parent_name} />
                <Row label="Parent Phone" value={newReq.parent_phone} />
              </>
            )}
            {existing && (
              <>
                <Row label="Subject" value={existing.subject} />
                <Row label="Chapter / Unit" value={existing.chapter_unit} />
                <Row label="Parent Name" value={existing.parent_name} />
                <Row label="Parent Contact" value={existing.parent_contact} />
                <Row
                  label="Feedback"
                  value={
                    existing.feedback_rating
                      ? feedbackLabels[existing.feedback_rating] ?? existing.feedback_rating
                      : undefined
                  }
                />
              </>
            )}
          </dl>
        ) : (
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            No enquiry details found yet.
          </p>
        )}
      </div>
    </div>
  );
}
