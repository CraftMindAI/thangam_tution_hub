import Link from "next/link";
import { ChevronRight } from "@/app/components/icons";

export function AdminPagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-stone-200/80 px-4 py-3 dark:border-stone-800">
      <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        {page > 1 ? (
          <Link
            href={buildHref(page - 1)}
            className="rounded-full border border-stone-300 px-3.5 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800 transition-colors"
          >
            Previous
          </Link>
        ) : (
          <span className="rounded-full border border-stone-200 px-3.5 py-1.5 text-xs font-bold text-stone-300 dark:border-stone-800 dark:text-stone-600">
            Previous
          </span>
        )}
        {page < totalPages ? (
          <Link
            href={buildHref(page + 1)}
            className="inline-flex items-center gap-1 rounded-full border border-stone-300 px-3.5 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800 transition-colors"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-stone-200 px-3.5 py-1.5 text-xs font-bold text-stone-300 dark:border-stone-800 dark:text-stone-600">
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
    </div>
  );
}
