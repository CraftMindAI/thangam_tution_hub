import React from "react";
import Link from "next/link";
import { AdminCard } from "./AdminCard";

interface AdminStatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  href?: string;
  variant?: "default" | "yellow";
  miniChart?: number[]; // Values 0 to 100 for mini vertical bar graph
  trend?: string;
  className?: string;
}

export function AdminStatCard({
  label,
  value,
  subtitle,
  icon: Icon,
  href,
  variant = "default",
  miniChart,
  trend,
  className = "",
}: AdminStatCardProps) {
  const content = (
    <div className="flex flex-col justify-between h-full">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span
            className={`text-xs font-semibold tracking-wide uppercase ${
              variant === "yellow"
                ? "text-stone-900/80"
                : "text-stone-500 dark:text-stone-400"
            }`}
          >
            {label}
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                variant === "yellow"
                  ? "text-stone-950 font-black"
                  : "text-stone-900 dark:text-yellow-400"
              }`}
            >
              {value}
            </span>
            {trend && (
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  variant === "yellow"
                    ? "bg-black/10 text-stone-900"
                    : "bg-yellow-400/20 text-yellow-700 dark:text-yellow-300"
                }`}
              >
                {trend}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-105 ${
              variant === "yellow"
                ? "bg-stone-950 text-yellow-400 shadow-md shadow-stone-950/20"
                : "bg-yellow-50 text-yellow-600 dark:bg-stone-800/90 dark:text-yellow-400 dark:border dark:border-stone-700/60"
            }`}
          >
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>

      {miniChart && miniChart.length > 0 && (
        <div className="mt-5 flex items-end gap-1.5 h-10 pt-2 border-t border-black/10 dark:border-white/10">
          {miniChart.map((val, idx) => (
            <div
              key={idx}
              className="flex-1 rounded-full overflow-hidden flex flex-col justify-end h-full bg-black/5 dark:bg-white/5"
            >
              <div
                className={`rounded-full transition-all duration-300 ${
                  variant === "yellow"
                    ? "bg-stone-950"
                    : "bg-yellow-400 dark:bg-yellow-400"
                }`}
                style={{ height: `${Math.max(15, Math.min(100, val))}%` }}
              />
            </div>
          ))}
        </div>
      )}

      {subtitle && (
        <p
          className={`mt-3 text-xs ${
            variant === "yellow"
              ? "text-stone-800 font-medium"
              : "text-stone-500 dark:text-stone-400"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group block focus:outline-none">
        <AdminCard
          variant={variant}
          interactive
          className={`p-6 sm:p-7 ${className}`}
        >
          {content}
        </AdminCard>
      </Link>
    );
  }

  return (
    <AdminCard variant={variant} className={`p-6 sm:p-7 ${className}`}>
      {content}
    </AdminCard>
  );
}
