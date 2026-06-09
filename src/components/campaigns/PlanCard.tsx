import { Minus, Plus } from "lucide-react";

export interface PlanCardProps {
  id: number;
  title: string;
  location: string;
  topLocations: string[];
  audienceReach: number;
  djCount: number;
  purchasedCount: number;
  totalTokens: number;
  spinsPerDj: number;
  selected?: boolean;
  onToggle?: () => void;
}

export default function PlanCard({
  title,
  location,
  topLocations,
  audienceReach,
  djCount,
  purchasedCount,
  totalTokens,
  spinsPerDj,
  selected = false,
  onToggle,
}: PlanCardProps) {
  const selectedBorder = selected
    ? "border-[#0B66D3] ring-2 ring-[#0B66D3]"
    : "border-[#D4CECE]";

  return (
    <>
      {/* Desktop */}
      <div
        onClick={onToggle}
        className={`hidden sm:flex justify-between items-center border rounded-2xl bg-white p-10 transition-all cursor-pointer ${selectedBorder}`}
      >
        {/* Left */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-[26px] font-semibold text-[#0B66D3]">
              {title}
            </h2>
          </div>

          <p className="text-[#666] mt-2">{location}</p>

          <p className="text-xl font-semibold mt-3">
            {spinsPerDj * djCount} Spins • {djCount} DJs
          </p>

          <p className="text-[#7A7A7A] mt-3">
            Audience Reach: {audienceReach.toLocaleString()}
          </p>

          <p className="mt-3">
            <span className="font-medium">Top Locations: </span>
            {topLocations.map((location, index) => (
              <span key={location}>
                <a href="#" className="text-[#0B66D3] underline">
                  {location}
                </a>
                {index < topLocations.length - 1 && ", "}
              </span>
            ))}
          </p>

          <p className="mt-3">
            Purchased <strong>{purchasedCount}</strong> times
          </p>

          <p className="mt-4 text-[#F2A000] font-medium">
            {totalTokens} Tokens
          </p>
        </div>

        {/* Right */}
        <div className="w-max border border-black rounded-2xl p-4">
          <p className="text-[11px] uppercase tracking-[2px] font-bold mb-3">
            Spins Per DJ
          </p>
          <div className="flex items-center">
            <div className="w-[116px] h-[54px] border border-black rounded-2xl flex items-center justify-center text-[24px]">
              {spinsPerDj}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div
        onClick={onToggle}
        className={`sm:hidden border rounded-2xl bg-white p-5 transition-all cursor-pointer ${selectedBorder}`}
      >
        <div className="flex justify-between items-start gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#0B66D3]">{title}</h2>
            <p className="text-sm text-[#666] mt-1">{location}</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="border border-black rounded-xl p-3 inline-flex items-end">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest font-bold">
                Spins Per DJ
              </span>
              <span className="text-xl mt-1 text-center">{spinsPerDj}</span>
            </div>
          </div>
        </div>

        <p className="font-bold mt-4">
          {spinsPerDj * djCount} Spins • {djCount} DJs
        </p>

        <p className="text-gray-500 mt-2">
          Audience Reach: {audienceReach.toLocaleString()}
        </p>

        <p className="mt-3 text-sm">
          <span className="font-medium">Top Locations: </span>
          {topLocations.join(", ")}
        </p>

        <p className="mt-2">
          Purchased <strong>{purchasedCount}</strong> times
        </p>

        <p className="mt-3 text-[#F2A000] font-medium">{totalTokens} Tokens</p>
      </div>
    </>
  );
}