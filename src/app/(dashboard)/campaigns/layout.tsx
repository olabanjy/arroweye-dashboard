import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Campaigns - Arroweye",
  // description: "Create, manage, and track your campaigns on Arroweye.",
  openGraph: {
    title: "Campaigns - Arroweye",
    // description: "Create, manage, and track your campaigns on Arroweye.",
    images: [
      {
        url: "https://res.cloudinary.com/dyueswnzk/image/upload/v1767505937/90.001_a7q3o7.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Campaigns - Arroweye",
    // description: "Create, manage, and track your campaigns on Arroweye.",
    images: [
      "https://res.cloudinary.com/dyueswnzk/image/upload/v1767505937/90.001_a7q3o7.png",
    ],
  },
};

interface LayoutProps {
  children: ReactNode;
}

const CampaignsLayout = ({ children }: LayoutProps) => {
  return children;
};

export default CampaignsLayout;
