type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function GraduationCap({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2 9.5 12 5l10 4.5-10 4.5L2 9.5Z" />
      <path d="M6 11.5V17c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5.5" />
      <path d="M20.5 10v5" />
    </svg>
  );
}

export function BookOpen({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 6.5c-1.4-1.1-3.6-1.7-6-1.7-.6 0-1 .4-1 1v11c0 .6.4 1 1 1 2.4 0 4.6.6 6 1.7 1.4-1.1 3.6-1.7 6-1.7.6 0 1-.4 1-1v-11c0-.6-.4-1-1-1-2.4 0-4.6.6-6 1.7Z" />
      <path d="M12 6.5v13" />
    </svg>
  );
}

export function Clock({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function Phone({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 4.5 7.5 4c.5 0 .9.3 1 .8l1 3.6c.1.4 0 .8-.3 1.1L7.7 11c1 2.2 2.7 4 4.9 5l1.5-1.5c.3-.3.7-.4 1.1-.3l3.6 1c.5.1.8.5.8 1v3.5c0 .6-.5 1-1 1C10 21 3 14 3 5.5c0-.5.4-1 1-1Z" />
    </svg>
  );
}

export function Mail({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 6.5 8 6 8-6" />
    </svg>
  );
}

export function MapPin({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 21s7-6.4 7-11.5A7 7 0 0 0 5 9.5C5 14.6 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export function Users({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.8 19c.7-3 3-5 6.2-5s5.5 2 6.2 5" />
      <path d="M16.3 5.2c1.4.4 2.4 1.6 2.4 3.1 0 1.5-1 2.7-2.4 3.1" />
      <path d="M18 14.3c2.3.5 4 2.2 4.6 4.7" />
    </svg>
  );
}

export function Award({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="8.5" r="5.5" />
      <path d="m8.2 13.2-1.7 7.3L12 18l5.5 2.5-1.7-7.3" />
    </svg>
  );
}

export function Sparkles({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M11 3v3M11 15v3M4.5 11h3M15.5 11h3M6.5 6.5l2 2M13.5 13.5l2 2M6.5 15.5l2-2M13.5 8.5l2-2" />
      <circle cx="11" cy="11" r="2.2" />
    </svg>
  );
}

export function CheckCircle({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.3 2.3 2.3 4.7-5.2" />
    </svg>
  );
}

export function Menu({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function X({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function User({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="8" r="3.8" />
      <path d="M4.5 20c1-3.8 4-6 7.5-6s6.5 2.2 7.5 6" />
    </svg>
  );
}

export function Eye({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  );
}

export function EyeOff({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 3l18 18" />
      <path d="M10.6 5.6A10.6 10.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a13.7 13.7 0 0 1-3.2 4M6.6 6.9C4.1 8.6 2.5 12 2.5 12S6 18.5 12 18.5c1.3 0 2.5-.3 3.6-.8" />
      <path d="M9.9 9.9a2.8 2.8 0 0 0 3.9 3.9" />
    </svg>
  );
}

export function Calendar({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" />
    </svg>
  );
}

export function LayoutDashboard({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3.5" y="3.5" width="7.5" height="9" rx="1.3" />
      <rect x="13" y="3.5" width="7.5" height="5.5" rx="1.3" />
      <rect x="13" y="11" width="7.5" height="9.5" rx="1.3" />
      <rect x="3.5" y="15" width="7.5" height="5.5" rx="1.3" />
    </svg>
  );
}

export function MessageSquare({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 5.5h16v11H9l-4 3.5v-3.5H4Z" />
    </svg>
  );
}

export function ArrowRight({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function HeartHandshake({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M9 12.5 6.5 15a2 2 0 0 1-2.8 0l-.7-.7a2 2 0 0 1 0-2.8L7 7.5a3 3 0 0 1 2.1-.9h3.5c.6 0 1.2.2 1.7.6l1.2 1" />
      <path d="m15 11 2.3-2.3a2 2 0 0 1 2.8 0l.7.7a2 2 0 0 1 0 2.8L17 16" />
      <path d="M9 12.5 12 15.5 15 12.5" />
    </svg>
  );
}
