import { BadgeCheck } from "lucide-react";

type PromotionCardProps = {
  name: string;
  initials: string;
  djs: string;
  campaigns: number;
  rating: number;
  onClick?: () => void;
};

export function PromotionCard({
  name,
  initials,
  djs,
  campaigns,
  rating,
  onClick,
}: PromotionCardProps) {
  return (
    <div
      onClick={onClick}
      className="rounded-xl border bg-white overflow-hidden shadow-sm cursor-pointer"
    >
      {/* Top gradient */}
      <div className="h-32 bg-gradient-to-b from-black to-gray-500 flex items-center justify-center">
        <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-lg font-semibold">
          {initials}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 font-semibold text-lg">
          {name}
          <BadgeCheck className="text-white fill-blue-500" />
        </div>

        <p className="mt-2 font-medium">{djs}</p>
        <p className="text-sm text-gray-600">
          Campaigns Completed:{" "}
          <span className="font-semibold">{campaigns}</span>
        </p>

        {/* Rating */}
        <div className="flex mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={i < rating ? "text-yellow-500" : "text-gray-300"}
            >
              ★
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
