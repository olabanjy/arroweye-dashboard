import type { Metadata } from "next";
import DashboardLayoutClient from "./dashboard-layout-client";

export const metadata: Metadata = {
  title: "Arroweye Dashboard",
  // description: "Manage your campaigns, drops, and promoters on Arroweye.",
  openGraph: {
    title: "Arroweye Dashboard",
    // description: "Manage your campaigns, drops, and promoters on Arroweye.",
    images: [
      {
        url: "https://res.cloudinary.com/dyueswnzk/image/upload/v1767505937/90.001_a7q3o7.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arroweye Dashboard",
    // description: "Manage your campaigns, drops, and promoters on Arroweye.",
    images: [
      "https://res.cloudinary.com/dyueswnzk/image/upload/v1767505937/90.001_a7q3o7.png",
    ],
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
