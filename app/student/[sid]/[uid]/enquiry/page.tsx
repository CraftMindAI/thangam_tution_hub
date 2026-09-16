import { AdminPageHeader } from "@/app/admin/_components/ui";
import NewEnquiryForm from "./NewEnquiryForm";

export default function StudentEnquiry() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Enquiry"
        subtitle="Raise a question, subject doubt, or query with your tutors."
      />

      <div className="max-w-2xl">
        <NewEnquiryForm />
      </div>
    </div>
  );
}
