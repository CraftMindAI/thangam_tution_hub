import type { ComponentType } from "react";
import { LayoutDashboard, Calendar, MessageSquare } from "../../components/icons";

type IconType = ComponentType<{ className?: string }>;

export type NavItem = {
  label: string;
  href: string;
  icon: IconType;
};

export const studentNav: NavItem[] = [
  { label: "Dashboard", href: "/student", icon: LayoutDashboard },
  { label: "Calendar", href: "/student/calendar", icon: Calendar },
  { label: "Enquiry", href: "/student/enquiry", icon: MessageSquare },
];

export function isActive(pathname: string, item: NavItem) {
  if (item.href === "/student") return pathname === "/student";
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
