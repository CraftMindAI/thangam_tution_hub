import type { ComponentType } from "react";
import {
  LayoutDashboard,
  Calendar,
  CalendarClock,
  ClipboardList,
  Inbox,
  Users,
  Settings,
} from "../../../components/icons";

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

export const settingsNav: NavItem[] = [
  { label: "Profile", href: "/admin/settings/profile", icon: Settings },
  {
    label: "Meeting Preference",
    href: "/admin/settings/meeting-preference",
    icon: CalendarClock,
  },
  { label: "Admin Users", href: "/admin/settings/admin-users", icon: Users },
];

export const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    label: "Upcoming Meetings",
    href: "/admin/upcoming-meetings",
    icon: CalendarClock,
  },
  {
    label: "Calendar",
    href: "/admin/calendar",
    icon: Calendar,
    matchPrefix: true,
  },
  { label: "Assign Task", href: "/admin/assign-task", icon: ClipboardList },
  { label: "Enquiry", href: "/admin/enquiry", icon: Inbox },
  {
    label: "Student Management",
    href: "/admin/students",
    icon: Users,
    matchPrefix: true,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    matchPrefix: true,
    children: settingsNav,
  },
];

export function isActive(pathname: string, item: NavItem) {
  if (item.matchPrefix) {
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }
  return pathname === item.href;
}
