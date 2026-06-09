import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import PlanCard from "./PlanCard";

interface PromotionPlansProps {
  isModalPage: boolean;
  promotion: any;
  onBack: () => void;
  onPlanSelected: (payload: {
    accept_terms: boolean;
    aggregator_plan_id: number;
    cluster_ids: number[];
  }) => void;
  onAudienceReach: (reach: number) => void;
  onPlanStats: (stats: { totalTokens: number; totalDJs: number }) => void;
}

export default function PromotionPlans({
  isModalPage,
  promotion,
  onBack,
  onPlanSelected,
  onAudienceReach,
  onPlanStats,
}: PromotionPlansProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  const handlePlanSelect = (plan: any) => {
    setSelectedPlanId(plan.id);

    onPlanSelected({
      accept_terms: true,
      aggregator_plan_id: plan.id,
      cluster_ids: plan.clusters.map((c: any) => c.id),
    });

    const audienceReach = plan.djs.reduce(
      (total: number, dj: any) => total + dj.audience_reach,
      0,
    );
    onAudienceReach(audienceReach);

    onPlanStats({
      totalTokens: plan.calculated_total_tokens,
      totalDJs: plan.djs.length,
    });
  };

  return (
    <div className="space-y-6">
      {!isModalPage && (
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            <span className="text-[#8A8A8A]">{promotion.display_name}</span> /
            Plans
          </h1>
          <button onClick={onBack} className="flex items-center gap-2 text-xl">
            <ArrowLeft size={20} />
            Back
          </button>
        </div>
      )}

      {promotion.plans.map((plan: any) => {
        const audienceReach = plan.djs.reduce(
          (total: number, dj: any) => total + dj.audience_reach,
          0,
        );
        const purchasedCount = plan.djs.reduce(
          (total: number, dj: any) => total + dj.campaigns_completed,
          0,
        );
        const topLocations: any = [
          ...new Set(plan.djs.flatMap((dj: any) => dj.top_locations)),
        ];

        return (
          <PlanCard
            key={plan.id}
            id={plan.id}
            title={plan.title}
            location={`${plan.clusters[0]?.city ?? ""} - ${plan.clusters[0]?.country ?? ""}`}
            audienceReach={audienceReach}
            djCount={plan.djs.length}
            purchasedCount={purchasedCount}
            totalTokens={plan.calculated_total_tokens}
            spinsPerDj={plan.calculated_spins_per_dj}
            topLocations={topLocations}
            selected={selectedPlanId === plan.id}
            onToggle={() => handlePlanSelect(plan)}
          />
        );
      })}
    </div>
  );
}