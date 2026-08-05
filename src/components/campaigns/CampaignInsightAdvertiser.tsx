import React from "react";
import VerifiedSpinsCard from "./VerifiedSpins";
import CostPerReachCard from "./TopLocations";
import DSPCard from "./DSPCard";

const CampaignInsightAdvertiser: React.FC<{ content: any }> = ({ content }) => {
  if (!content) return null;

  const { kpis, top_djs, top_locations, dsp_breakdown } = content;

  return (
    <div className="text-foreground">
      <div className="mb-[80px] mt-[20px]">
        <div className="grid w-full grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-3">
          <VerifiedSpinsCard
            verifiedSpinsDelivered={kpis?.verified_spins_delivered}
            verifiedSpinsTarget={kpis?.verified_spins_target}
            topDJs={top_djs}
          />
          <CostPerReachCard
            costPerReach={kpis?.cost_per_reach_naira}
            topLocations={top_locations}
          />
          <div className="w-full space-y-5 rounded-xl border border-border bg-card p-5 text-card-foreground transition-colors hover:border-green-500 hover:bg-green-500/5">
            <DSPCard dspBreakdown={dsp_breakdown} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignInsightAdvertiser;
