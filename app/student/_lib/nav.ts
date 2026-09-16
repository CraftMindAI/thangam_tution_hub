import type { ComponentType } from "react";
import {
  LayoutDashboard,
  Calendar,
  CalendarClock,
  MessageSquare,
  ClipboardList,
  Settings,
} from "../../components/icons";

type IconType = ComponentType<{ className?: string }>;

export type NavItem = {
  label: string;
  href: string;
  icon: IconType;
  /** match child routes as active too */
  matchPrefix?: boolean;
  /** nested links shown under this item in the sidebar */
  children?: NavItem[];
};

/**
 * The whole panel lives under an encrypted per-student base
 * (`/student/{enc(number)}/{enc(userId)}`), so every href is built from it.
 */
export function buildSettingsNav(base: string): NavItem[] {
  return [{ label: "Profile", href: `${base}/settings/profile`, icon: Settings }];
}

export function buildStudentNav(base: string): NavItem[] {
  return [
    { label: "Dashboard", href: `${base}/dashboard`, icon: LayoutDashboard },
    { label: "Meetings", href: `${base}/meetings`, icon: CalendarClock },
    { label: "Calendar", href: `${base}/calendar`, icon: Calendar, matchPrefix: true },
    { label: "View Tasks", href: `${base}/view-tasks`, icon: ClipboardList },
    { label: "Enquiry", href: `${base}/enquiry`, icon: MessageSquare },
    {
      label: "Settings",
      href: `${base}/settings`,
      icon: Settings,
      matchPrefix: true,
      children: buildSettingsNav(base),
    },
  ];
}

export function isActive(pathname: string, item: NavItem) {
  if (item.matchPrefix) {
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }
  return pathname === item.href;
}

/**
 * Recover `/student/{sid}/{uid}` from a pathname inside the panel. Used by
 * Client Components, which cannot read route params of ancestor segments.
 */
export function studentBase(pathname: string): string {
  const [, , sid, uid] = pathname.split("/");
  return `/student/${sid}/${uid}`;
}
