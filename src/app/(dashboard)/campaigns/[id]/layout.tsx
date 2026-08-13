import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ id: string }>;
}

interface CampaignTitleResponse {
  title?: string | null;
  song_title?: string | null;
  campaign?: {
    song_title?: string | null;
  } | null;
}

const getCampaignTitle = async (
  endpoint: string,
  token: string,
): Promise<string | null> => {
  try {
    const response = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) return null;

    const campaign = (await response.json()) as CampaignTitleResponse;
    return (
      campaign.title?.trim() ||
      campaign.song_title?.trim() ||
      campaign.campaign?.song_title?.trim() ||
      null
    );
  } catch {
    return null;
  }
};

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { id } = await params;
  const token = (await cookies()).get("auth_token")?.value;
  const apiBaseUrl = process.env.NEXT_PUBLIC_APP_SERVER_DOMAIN?.replace(
    /\/$/,
    "",
  );

  if (!token || !apiBaseUrl) {
    return { title: "Campaign - Arroweye" };
  }

  const projectTitle = await getCampaignTitle(
    `${apiBaseUrl}/api/v1/projects/${id}/`,
    token,
  );
  const campaignTitle =
    projectTitle ||
    (await getCampaignTitle(
      `${apiBaseUrl}/api/v1/campaigns/${id}/dashboard/`,
      token,
    ));

  return {
    title: campaignTitle
      ? `${campaignTitle} - Arroweye`
      : "Campaign - Arroweye",
  };
}

const CampaignDetailLayout = ({ children }: LayoutProps) => {
  return children;
};

export default CampaignDetailLayout;
