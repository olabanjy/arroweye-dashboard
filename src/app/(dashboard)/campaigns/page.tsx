import type { Metadata } from "next";
import CampaignsPageClient from "./campaigns-page-client";

export const metadata: Metadata = {
  title: "Campaigns - Arroweye",
};

export default function CampaignsPage() {
  return <CampaignsPageClient />;
}
