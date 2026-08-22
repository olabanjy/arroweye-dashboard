import type { Metadata } from "next";
import { Suspense } from "react";

import SetupContent from "../setup-content";

export const metadata: Metadata = {
  title: "Set Campaign Budget - Arroweye",
};

export default function CampaignBudgetPage() {
  return (
    <Suspense fallback={null}>
      <SetupContent />
    </Suspense>
  );
}
