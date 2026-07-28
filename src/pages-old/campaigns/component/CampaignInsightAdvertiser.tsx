import React from "react";
import MomentCard from "../public/component/MomentCard";
import MomentCardRewards from "../public/component/MomentCardRewards";
import MomentSliderCard from "../public/component/MomentSliderCard";
import VerifiedSpinsCard from "./VerifiedSpins";
import CostPerReachCard from "./TopLocations";
import DSPCard from "./DSPCard";

const CampaignInsightAdvertiser: React.FC<{ content: any }> = ({ content }) => {
  if (!content) return null;

  const { kpis, top_djs, top_locations, dsp_breakdown } = content;

  return (
    <div>
      <div className="mt-[20px] mb-[80px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px] w-full">
          <VerifiedSpinsCard
            verifiedSpinsDelivered={kpis.verified_spins_delivered}
            verifiedSpinsTarget={kpis.verified_spins_target}
            topDJs={top_djs}
          />
          <CostPerReachCard
            costPerReach={kpis.cost_per_reach_naira}
            topLocations={top_locations}
          />
          <div className="border p-[20px] rounded-[8px] space-y-[20px] hover:bg-green-500 hover:bg-opacity-5 hover:border hover:border-green-500">
            <DSPCard dspBreakdown={dsp_breakdown} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignInsightAdvertiser;
