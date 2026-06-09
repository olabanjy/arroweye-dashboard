import { PromotionCard } from "./PromotionCard";
import PromotionPlans from "./PromotionPlans";

export interface PromotionGridProps {
  isModalPage?: boolean;
  data: any[];
  selectedPromotion: any;
  setSelectedPromotion: (promo: any) => void;
  onPlanSelected: (payload: {
    accept_terms: boolean;
    aggregator_plan_id: number;
    cluster_ids: number[];
  }) => void;
  onAudienceReach: (reach: number) => void;
  onPlanStats: (stats: { totalTokens: number; totalDJs: number }) => void;
}

export const PromotionGrid: React.FC<PromotionGridProps> = ({
  isModalPage,
  data,
  selectedPromotion,
  setSelectedPromotion,
  onPlanSelected,
  onAudienceReach,
  onPlanStats,
}) => {
  if (selectedPromotion) {
    return (
      <PromotionPlans
        isModalPage={isModalPage ? true : false}
        promotion={selectedPromotion}
        onBack={() => setSelectedPromotion(null)}
      />
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((promo) => (
        <PromotionCard
          key={promo.id}
          name={promo.display_name}
          initials={promo.display_name
            .split(" ")
            .map((word: string) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
          djs={`${promo.managed_djs.length}+ DJs`}
          campaigns={promo.managed_djs.reduce(
            (total: number, dj: any) => total + dj.campaigns_completed,
            0,
          )}
          rating={Math.round(
            promo.managed_djs.reduce(
              (total: number, dj: any) => total + dj.rating,
              0,
            ) / promo.managed_djs.length,
          )}
          onClick={() => {
            setSelectedPromotion(promo);

            const firstPlan = promo.plans[0];
            onPlanSelected({
              accept_terms: true,
              aggregator_plan_id: firstPlan.id,
              cluster_ids: firstPlan.clusters.map((c: any) => c.id),
            });

            const totalReach = promo.plans.reduce(
              (total: number, plan: any) => total + plan.audience_reach,
              0,
            );
            onAudienceReach(totalReach);

            onPlanStats({
              totalTokens: firstPlan.calculated_total_tokens,
              totalDJs: firstPlan.djs.length,
            });
          }}
        />
      ))}
    </div>
  );
};
