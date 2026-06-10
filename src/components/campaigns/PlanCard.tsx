import { Info } from "lucide-react";
import { useState } from "react";

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
  const [showTooltip, setShowTooltip] = useState(false);

  const selectedBorder = selected
    ? "border-[#0B66D3] ring-2 ring-[#0B66D3]"
    : "border-[#D4CECE]";

  const TooltipIcon = () => (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowTooltip((prev) => !prev);
        }}
        className="text-[#0B66D3] hover:text-[#0952aa] focus:outline-none"
        aria-label="How to select a plan"
      >
        <Info size={16} />
      </button>

      {showTooltip && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 shadow-lg z-10 text-center pointer-events-none"
        >
          Click on a card to select this plan
          {/* Arrow */}
          <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800" />
        </div>
      )}
    </div>
  );

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
            <h2 className="text-lg font-semibold text-[#0B66D3]">{title}</h2>
            <TooltipIcon />
          </div>

          <p className="text-[#666] mt-2">{location}</p>

          <p className="font-semibold mt-3">
            {spinsPerDj * djCount} Spins • {djCount} DJs
          </p>

          <p className="text-[#7A7A7A] mt-3">
            Audience Reach: {audienceReach.toLocaleString()}
          </p>

          <p className="mt-3">
            <span className="font-medium">Top Locations: </span>
            {topLocations.map((loc, index) => (
              <span key={loc}>
                <a href="#" className="text-[#0B66D3] underline">
                  {loc}
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
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#0B66D3]">{title}</h2>
              <TooltipIcon />
            </div>
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
