import React from "react";

interface AdminTableContainerProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function AdminTableContainer({
  children,
  header,
  footer,
  className = "",
}: AdminTableContainerProps) {
  return (
    <div
      className={`overflow-hidden rounded-[24px] sm:rounded-[28px] border border-stone-200/90 bg-white shadow-sm dark:border-stone-800/80 dark:bg-[#14151b] ${className}`}
    >
      {header && (
        <div className="border-b border-stone-100 px-6 py-4 dark:border-stone-800/80">
          {header}
        </div>
      )}
      <div className="overflow-x-auto">{children}</div>
      {footer && (
        <div className="border-t border-stone-100 px-6 py-3.5 bg-stone-50/50 dark:border-stone-800/80 dark:bg-stone-900/30">
          {footer}
        </div>
      )}
    </div>
  );
}

export const tableClasses = {
  table: "w-full text-left text-sm",
  thead:
    "border-b border-stone-100 bg-stone-50/70 text-xs font-bold uppercase tracking-wider text-stone-500 dark:border-stone-800 dark:bg-stone-900/60 dark:text-stone-400",
  th: "px-6 py-3.5",
  tr: "transition-colors hover:bg-yellow-50/40 dark:hover:bg-yellow-400/[0.04]",
  td: "px-6 py-4 text-stone-700 dark:text-stone-300",
  tbody: "divide-y divide-stone-100 dark:divide-stone-800/70",
};
