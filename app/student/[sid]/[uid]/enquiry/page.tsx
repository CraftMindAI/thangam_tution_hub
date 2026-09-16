import NewEnquiryForm from "./NewEnquiryForm";

export default function StudentEnquiry() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-stone-600 dark:text-stone-400">
        Raise a question or doubt about your class.
      </p>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-yellow-700 dark:text-yellow-400">
          Submit a New Enquiry
        </h2>
        <div className="mt-3">
          <NewEnquiryForm />
        </div>
      </div>
    </div>
  );
}
