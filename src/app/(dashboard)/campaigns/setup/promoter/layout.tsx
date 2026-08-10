import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Promoter Campaigns - Arroweye",
};

export default function PromoterCampaignLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
