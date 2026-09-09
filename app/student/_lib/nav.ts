import type { ComponentType } from "react";
import { LayoutDashboard, Calendar, MessageSquare } from "../../components/icons";

type IconType = ComponentType<{ className?: string }>;

export type NavItem = {
  label: string;
  href: string;
  icon: IconType;
};

/**
 * The dashboard lives at an encrypted, per-student path, so its href is passed
 * in rather than hard-coded.
 */
export function buildStudentNav(dashboardHref: string): NavItem[] {
  return [
    { label: "Dashboard", href: dashboardHref, icon: LayoutDashboard },
    { label: "Calendar", href: "/student/calendar", icon: Calendar },
    { label: "Enquiry", href: "/student/enquiry", icon: MessageSquare },
  ];
}

export function isActive(pathname: string, item: NavItem) {
  if (item.label === "Dashboard") {
    return pathname === "/student" || pathname.endsWith("/dashboard");
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
