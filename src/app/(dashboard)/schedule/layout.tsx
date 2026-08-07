import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schedules - Arroweye",
};

export default function ScheduleLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
