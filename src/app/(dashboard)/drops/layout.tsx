import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Drops - Arroweye",
};

export default function DropsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
