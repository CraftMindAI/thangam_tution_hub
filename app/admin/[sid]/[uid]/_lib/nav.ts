import type { ComponentType } from "react";
import {
  LayoutDashboard,
  Calendar,
  CalendarClock,
  ClipboardList,
  Inbox,
  Users,
  Settings,
  Video,
} from "@/app/components/icons";

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
 * The whole panel lives under an encrypted per-admin base
 * (`/admin/{enc(number)}/{enc(userId)}`), so every href is built from it.
 */
export function buildSettingsNav(base: string): NavItem[] {
  return [
    { label: "Profile", href: `${base}/settings/profile`, icon: Settings },
    {
      label: "Meeting Preference",
      href: `${base}/settings/meeting-preference`,
      icon: CalendarClock,
    },
    { label: "Admin Users", href: `${base}/settings/admin-users`, icon: Users },
  ];
}

export function buildEnquiryNav(base: string): NavItem[] {
  return [
    { label: "Student Enquiry", href: `${base}/enquiry`, icon: Inbox },
    { label: "Demo", href: `${base}/enquiry/demo`, icon: Video },
  ];
}

export function buildAdminNav(base: string): NavItem[] {
  return [
    { label: "Dashboard", href: `${base}/dashboard`, icon: LayoutDashboard },
    {
      label: "Upcoming Meetings",
      href: `${base}/upcoming-meetings`,
      icon: CalendarClock,
    },
    {
      label: "Calendar",
      href: `${base}/calendar`,
      icon: Calendar,
      matchPrefix: true,
    },
    { label: "Assign Task", href: `${base}/assign-task`, icon: ClipboardList },
    {
      label: "Enquiry",
      href: `${base}/enquiry`,
      icon: Inbox,
      matchPrefix: true,
      children: buildEnquiryNav(base),
    },
    {
      label: "Student Management",
      href: `${base}/students`,
      icon: Users,
      matchPrefix: true,
    },
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
 * Recover `/admin/{sid}/{uid}` from a pathname inside the panel. Used by
 * Client Components, which cannot read route params of ancestor segments.
 */
export function adminBase(pathname: string): string {
  const [, , sid, uid] = pathname.split("/");
  return `/admin/${sid}/${uid}`;
}
