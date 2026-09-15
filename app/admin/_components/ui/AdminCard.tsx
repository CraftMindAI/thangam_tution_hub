import React from "react";

export type AdminCardVariant = "default" | "yellow" | "glass" | "subtle";

interface AdminCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AdminCardVariant;
  interactive?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function AdminCard({
  variant = "default",
  interactive = false,
  children,
  className = "",
  ...props
}: AdminCardProps) {
  const baseClasses = "rounded-[24px] sm:rounded-[28px] transition-all duration-200";

  const variantClasses: Record<AdminCardVariant, string> = {
    default:
      "bg-white border border-stone-200/90 shadow-sm dark:bg-[#14151b] dark:border-stone-800/80 dark:shadow-stone-950/50 text-stone-900 dark:text-stone-100",
    yellow:
      "bg-yellow-400 text-stone-950 shadow-lg shadow-yellow-400/20 border border-yellow-300 font-medium",
    glass:
      "bg-white/80 backdrop-blur border border-stone-200/80 shadow-sm dark:bg-[#181920]/80 dark:border-stone-800/80 text-stone-900 dark:text-stone-100",
    subtle:
      "bg-stone-50 border border-stone-200/70 dark:bg-[#101116] dark:border-stone-800/60 text-stone-900 dark:text-stone-100",
  };

  const interactiveClasses = interactive
    ? "cursor-pointer hover:border-yellow-400/60 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] dark:hover:border-yellow-500/50"
    : "";

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${interactiveClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

interface AdminPanelProps {
  title: string;
  action?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export function AdminPanel({
  title,
  action,
  icon: Icon,
  children,
  className = "",
  headerClassName = "",
}: AdminPanelProps) {
  return (
    <AdminCard className={`flex flex-col overflow-hidden ${className}`}>
      <div
        className={`flex items-center justify-between gap-3 border-b border-stone-100 px-6 py-4 sm:px-7 dark:border-stone-800/80 ${headerClassName}`}
      >
        <div className="flex items-center gap-2.5">
          {Icon && (
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-yellow-400/15 text-yellow-600 dark:bg-yellow-400/20 dark:text-yellow-400">
              <Icon className="h-4 w-4" />
            </span>
          )}
          <h2 className="text-xs font-bold tracking-wider uppercase text-stone-700 dark:text-yellow-400">
            {title}
          </h2>
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="flex-1 p-6 sm:p-7">{children}</div>
    </AdminCard>
  );
}
