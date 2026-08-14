import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spins - Arroweye",
};

export default function SpinLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
