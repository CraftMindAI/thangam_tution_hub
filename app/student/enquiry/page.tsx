import { createClient } from "../../lib/supabase/server";
import NewEnquiryForm from "./NewEnquiryForm";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function StudentEnquiry() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: enquiries } = await supabase
    .from("student_enquiries")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        Enquiry
      </h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Raise a question or doubt, and view what you&apos;ve submitted before.
      </p>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
        Submit a New Enquiry
      </h2>
      <div className="mt-3">
        <NewEnquiryForm />
      </div>

      {enquiries && enquiries.length > 0 && (
        <>
          <h2 className="mt-10 text-sm font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            Your Submitted Enquiries
          </h2>
          <div className="mt-3 space-y-3">
            {enquiries.map((e) => (
              <div
                key={e.id}
                className="rounded-2xl border border-stone-200/70 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-800"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{e.title}</h3>
                  <span className="shrink-0 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
                    {e.subject}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {e.description}
                </p>
                <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                  Submitted {formatDateTime(e.created_at)}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
