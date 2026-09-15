import React from "react";

export type BadgeVariant =
  | "yellow"
  | "dark"
  | "gray"
  | "success"
  | "warning"
  | "live"
  | "outline";

interface AdminBadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  pulse?: boolean;
  className?: string;
}

export function AdminBadge({
  variant = "yellow",
  children,
  icon: Icon,
  pulse = false,
  className = "",
}: AdminBadgeProps) {
  const variantClasses: Record<BadgeVariant, string> = {
    yellow:
      "bg-yellow-400 text-stone-950 font-bold border border-yellow-300 shadow-sm shadow-yellow-500/10",
    dark:
      "bg-stone-900 text-yellow-400 dark:bg-stone-800 dark:text-yellow-300 border border-stone-800 dark:border-stone-700 font-semibold",
    gray:
      "bg-stone-100 text-stone-700 dark:bg-stone-800/80 dark:text-stone-300 border border-stone-200/60 dark:border-stone-700/60 font-medium",
    success:
      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-semibold",
    warning:
      "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-semibold",
    live:
      "bg-emerald-500 text-white font-bold shadow-md shadow-emerald-500/20",
    outline:
      "border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-medium",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs whitespace-nowrap transition-colors ${variantClasses[variant]} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </span>
  );
}
