import React from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  pill?: boolean;
  loading?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  iconPosition?: "left" | "right";
  children?: React.ReactNode;
}

export function AdminButton({
  variant = "primary",
  size = "md",
  pill = true,
  loading = false,
  disabled,
  icon: Icon,
  iconPosition = "left",
  children,
  className = "",
  ...props
}: AdminButtonProps) {
  const roundedClass = pill ? "rounded-full" : "rounded-2xl";

  const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-3.5 py-1.5 text-xs font-semibold gap-1.5",
    md: "px-5 py-2.5 text-sm font-semibold gap-2",
    lg: "px-6 py-3 text-base font-bold gap-2.5",
  };

  const iconSizes: Record<ButtonSize, string> = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      "bg-yellow-400 text-stone-950 hover:bg-yellow-300 shadow-sm shadow-yellow-500/25 active:scale-[0.98] border border-yellow-300/60 font-bold",
    secondary:
      "bg-stone-900 text-white hover:bg-stone-800 shadow-sm dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700 border border-transparent active:scale-[0.98]",
    outline:
      "bg-transparent border border-stone-300 text-stone-700 hover:border-stone-400 hover:bg-stone-100/60 dark:border-stone-700 dark:text-stone-300 dark:hover:border-stone-600 dark:hover:bg-stone-800/60 active:scale-[0.98]",
    ghost:
      "bg-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100",
    danger:
      "bg-red-500/10 text-red-600 border border-red-500/20 hover:bg-red-500/20 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30",
  };

  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={`inline-flex items-center justify-center transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${roundedClass} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-block animate-spin h-4 w-4 rounded-full border-2 border-current border-t-transparent mr-2" />
      ) : (
        Icon && iconPosition === "left" && <Icon className={iconSizes[size]} />
      )}
      {children}
      {!loading && Icon && iconPosition === "right" && (
        <Icon className={iconSizes[size]} />
      )}
    </button>
  );
}
