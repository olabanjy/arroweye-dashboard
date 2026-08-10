import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Campaigns - Arroweye",
};

export default function CustomCampaignLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
