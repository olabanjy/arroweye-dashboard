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
  return (
    <>
      {/* Desktop */}
      <div className="hidden sm:flex justify-between items-center border border-[#D4CECE] rounded-2xl bg-white p-10">
        {/* Left */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-[26px] font-semibold text-[#0B66D3]">
              {title}
            </h2>

            {/* <span className="px-4 py-1 rounded-full bg-[#E7C4F5] text-xs font-bold uppercase">
              Popular
            </span> */}
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
        <div className="border border-black rounded-2xl p-4 min-w-[230px]">
          <p className="text-[11px] uppercase tracking-[2px] font-bold mb-3">
            Spins Per DJ
          </p>

          <div className="flex items-center gap-4">
            <div className="w-[116px] h-[54px] border border-black rounded-2xl flex items-center justify-center text-[24px]">
              {spinsPerDj}
            </div>

            <button
              onClick={onToggle}
              className={`w-14 h-14 rounded-full flex items-center justify-center text-white ${
                selected ? "bg-red-500" : "bg-black"
              }`}
            >
              {selected ? <Minus size={28} /> : <Plus size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="sm:hidden border border-[#D4CECE] rounded-2xl bg-white p-5">
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
            <button
                onClick={onToggle}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                  selected ? "bg-red-500" : "bg-black"
                }`}
              >
                {selected ? <Minus size={18} /> : <Plus size={18} />}
              </button>
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
