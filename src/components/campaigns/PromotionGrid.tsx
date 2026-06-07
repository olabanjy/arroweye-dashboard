import { useState } from "react";
import { PromotionCard } from "./PromotionCard";
import PromotionPlans from "./PromotionPlans";

export interface PromotionGridProps {
  data: any[];
}

export const PromotionGrid: React.FC<PromotionGridProps> = ({ data }) => {
  const [selectedPromotion, setSelectedPromotion] = useState<any>(null);

  if (selectedPromotion) {
    return (
      <PromotionPlans
        promotion={selectedPromotion}
        onBack={() => setSelectedPromotion(null)}
      />
    );
  }

  return (
    <div
      className="grid gap-6
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-3"
    >
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
