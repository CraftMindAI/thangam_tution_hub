import type { StudentEnquiry } from "@/app/lib/enquiries";
import EnquiryCard from "./EnquiryCard";

export default function EnquiryTracker({
  enquiries,
}: {
  enquiries: StudentEnquiry[];
}) {
  if (!enquiries.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-extrabold uppercase tracking-wider text-stone-900 dark:text-stone-200">
        Your Enquiries
      </h2>

      <div className="space-y-4">
        {enquiries.map((e) => (
          <EnquiryCard key={e.id} enquiry={e} />
        ))}
      </div>
    </div>
  );
}
