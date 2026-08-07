import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ReactNode } from "react";

async function getCampaignTitle(id: string): Promise<string | null> {
  const base = process.env.NEXT_PUBLIC_APP_SERVER_DOMAIN;
  if (!base) return null;
  const token = (await cookies()).get("auth_token")?.value;
  if (!token) return null;

  const headers = { Authorization: `Bearer ${token}` };
  const endpoints = [
    `${base}/api/v1/projects/${id}/`,
    `${base}/api/v1/campaigns/${id}/dashboard/`,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, { headers, next: { revalidate: 0 } });
      if (!res.ok) continue;
      const data = await res.json();
      return data?.title || data?.campaign?.song_title || null;
    } catch {
      continue;
    }
  }

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const title = await getCampaignTitle(id);
  const formatted = title
    ? `${title} - Arroweye`
    : "Campaign Details - Arroweye";

  return {
    title: formatted,
    openGraph: { title: formatted },
    twitter: { title: formatted },
  };
}

interface LayoutProps {
  children: ReactNode;
}

const CampaignDetailLayout = ({ children }: LayoutProps) => {
  return children;
};

export default CampaignDetailLayout;