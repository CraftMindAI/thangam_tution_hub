export const iconBadge =
  "bg-gradient-to-br from-yellow-300 to-yellow-400 text-stone-900 shadow-md shadow-yellow-500/20 ring-1 ring-white/60";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-yellow-800 shadow-sm dark:bg-yellow-900/30 dark:text-yellow-300">
      {children}
    </span>
  );
}

export function Blobs({ variant = "default" }: { variant?: "default" | "compact" }) {
  const size = variant === "compact" ? "h-72 w-72" : "h-96 w-96";
  return (
    <>
      <div
        className={`pointer-events-none absolute -top-24 -left-24 ${size} rounded-full bg-yellow-300/30 blur-3xl dark:bg-yellow-500/10`}
      />
      <div
        className={`pointer-events-none absolute top-1/3 -right-24 ${size} rounded-full bg-yellow-200/25 blur-3xl dark:bg-yellow-600/10`}
      />
    </>
  );
}
