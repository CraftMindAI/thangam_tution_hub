import NewEnquiryForm from "./NewEnquiryForm";

export default function StudentEnquiry() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        Enquiry
      </h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Raise a question or doubt about your class.
      </p>

      <h2 className="mt-8 text-sm font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
        Submit a New Enquiry
      </h2>
      <div className="mt-3">
        <NewEnquiryForm />
      </div>
    </div>
  );
}
