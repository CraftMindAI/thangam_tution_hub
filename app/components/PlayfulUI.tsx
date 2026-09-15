export const tilts = [
  "rotate-2",
  "-rotate-2",
  "rotate-1",
  "-rotate-1",
  "rotate-3",
  "-rotate-3",
];

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex -rotate-2 items-center gap-1.5 rounded-full border-2 border-dashed border-yellow-400 bg-yellow-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-yellow-700 shadow-[2px_2px_0_0_rgba(202,138,4,0.25)] dark:border-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
      {children}
    </span>
  );
}

export function Wave({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none ${className}`} aria-hidden>
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="h-10 w-full sm:h-16"
      >
        <path
          fill="currentColor"
          d="M0,50 C240,90 480,10 720,40 C960,70 1200,90 1440,50 L1440,100 L0,100 Z"
        />
      </svg>
    </div>
  );
}
