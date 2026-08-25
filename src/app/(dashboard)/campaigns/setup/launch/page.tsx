import type { Metadata } from "next";

import AddCampaign from "@/components/campaigns/AddCampaign";

export const metadata: Metadata = {
  title: "Launch Campaign - Arroweye",
};

export default function LaunchCampaignPage() {
  return <AddCampaign />;
}
