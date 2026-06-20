import { PromotionCard } from "./PromotionCard";
import PromotionPlans from "./PromotionPlans";

export interface PromotionGridProps {
  isModalPage?: boolean;
  isOnModal?: boolean; // add this
  data: any[];
  selectedPromotion: any;
  setSelectedPromotion: (promo: any) => void;
  resetPlan?: () => void;
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
  isOnModal, // add this
  data,
  selectedPromotion,
  setSelectedPromotion,
  resetPlan,
  onPlanSelected,
  onAudienceReach,
  onPlanStats,
}) => {
  if (selectedPromotion) {
    return (
      <PromotionPlans
        isModalPage={isModalPage ? true : false}
        isOnModal={isOnModal} // pass it down
        promotion={selectedPromotion}
        onBack={() => {
          setSelectedPromotion(null);
          resetPlan && resetPlan();
        }}
        onPlanSelected={onPlanSelected}
        onAudienceReach={onAudienceReach}
        onPlanStats={onPlanStats}
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
          onClick={() => setSelectedPromotion(promo)}
        />
      ))}
    </div>
  );
};
