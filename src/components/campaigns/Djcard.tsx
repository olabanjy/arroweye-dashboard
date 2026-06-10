import { useState, useRef, useEffect } from "react";

export interface DJCardProps {
  id: string | number;
  name: string;
  location: string;
  topLocations: { name: string; href: string }[];
  campaignsCompleted: number;
  audienceReach: string;
  rating: number;
  tokensPerSpin: number;
  initialSpins?: number;
  spins: number;
  onSpinsChange: (value: number) => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function InfoTooltip() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-4 h-4 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-500 flex items-center justify-center text-[10px] font-bold transition-colors"
        aria-label="Spin counter help"
      >
        ?
      </button>
      {open && (
        <div className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 w-52 bg-gray-900 text-white text-xs rounded-xl px-3 py-2.5 shadow-lg leading-relaxed">
          <p>
            <span className="text-green-400 font-bold">+</span> adds a spin,{" "}
            <span className="text-red-400 font-bold">−</span> removes one. You
            can also type a number directly in the input box.
          </p>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}

function SpinCounter({
  spins,
  onChange,
}: {
  spins: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="p-4 flex flex-row items-end gap-2 border border-black rounded-xl">
      <div className="flex flex-col">
        <div className="mb-2 flex items-center gap-1">
          <span className="text-[10px] font-bold tracking-widest uppercase">
            Total Spins
          </span>
          <InfoTooltip />
        </div>
        <input
          type="number"
          value={spins}
          min={0}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-16 h-10 rounded-xl border border-black flex items-center justify-center bg-white text-center text-xl font-bold text-gray-800 tabular-nums"
        />
      </div>
      {/* Minus */}
      <button
        onClick={() => onChange(Math.max(0, spins - 1))}
        disabled={spins === 0}
        className="w-9 h-9 rounded-full bg-red-500 hover:bg-red-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white text-xl font-bold transition-all duration-150 select-none"
        aria-label="Decrement spins"
      >
        −
      </button>
      {/* Plus */}
      <button
        onClick={() => onChange(spins + 1)}
        className="w-9 h-9 rounded-full bg-green-500 hover:bg-green-600 active:scale-95 flex items-center justify-center text-white text-xl font-bold transition-all duration-150 select-none"
        aria-label="Increment spins"
      >
        +
      </button>
    </div>
  );
}

function MobileSpinCounter({
  spins,
  onChange,
}: {
  spins: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="p-2 flex flex-row items-end gap-1 border border-black rounded-xl">
      <div className="flex flex-col">
        <div className="mb-1 flex items-center gap-0.5">
          <span className="text-[8px] font-bold tracking-widest uppercase">
            Spins
          </span>
          <InfoTooltip />
        </div>
        <input
          type="number"
          value={spins}
          min={0}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-10 h-8 rounded-xl border border-black flex items-center justify-center bg-white text-center font-bold text-gray-800 tabular-nums"
        />
      </div>
      {/* Minus */}
      <button
        onClick={() => onChange(Math.max(0, spins - 1))}
        disabled={spins === 0}
        className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white font-bold transition-all duration-150 select-none"
        aria-label="Decrement spins"
      >
        −
      </button>
      {/* Plus */}
      <button
        onClick={() => onChange(spins + 1)}
        className="w-6 h-6 rounded-full bg-green-500 hover:bg-green-600 active:scale-95 flex items-center justify-center text-white font-bold transition-all duration-150 select-none"
        aria-label="Increment spins"
      >
        +
      </button>
    </div>
  );
}

export default function DJCard({
  name = "DJ Neptune",
  location = "Lagos - Island",
  topLocations = [
    { name: "Quilox", href: "#" },
    { name: "Vaniti Lagos", href: "#" },
    { name: "Hard Rock Cafe Lagos", href: "#" },
  ],
  campaignsCompleted = 84,
  audienceReach = "120,000",
  rating = 4,
  tokensPerSpin = 10,
  initialSpins = 15,
  spins,
  onSpinsChange,
}: DJCardProps) {
  return (
    <div className="min-h-max min-w-screen flex items-center justify-center font-sans">
      {/* ── Desktop Card ── */}
      <div className="hidden sm:flex w-full bg-white rounded-2xl border border-[#D4CECE] p-6 items-center gap-6">
        {/* Left: Info */}
        <div className="flex-1 min-w-0 space-y-2">
          <h2 className="text-xl font-bold text-blue-600 truncate">{name}</h2>
          <p className="text-sm text-gray-500">{location}</p>

          <p className="text-sm text-gray-800">
            <span className="font-semibold">Top Locations: </span>
            {topLocations.map((loc, i) => (
              <span key={loc.name}>
                <a
                  href={loc.href}
                  className="text-blue-500 hover:underline hover:text-blue-700 transition-colors"
                >
                  {loc.name}
                </a>
                {i < topLocations.length - 1 && (
                  <span className="text-gray-400">, </span>
                )}
              </span>
            ))}
          </p>

          <p className="text-sm text-gray-800">
            Campaigns Completed:{" "}
            <span className="font-bold text-gray-900">
              {campaignsCompleted}
            </span>
          </p>
          <p className="text-sm text-gray-500">
            Audience Reach: {audienceReach}
          </p>

          <StarRating rating={rating} />

          <p className="text-sm font-semibold text-amber-500">
            {tokensPerSpin} Tokens per Spin
          </p>
        </div>

        {/* Divider */}
        <div className="w-px self-stretch bg-gray-100" />

        {/* Right: Spin Counter */}
        <div className="flex-shrink-0">
          <SpinCounter spins={spins} onChange={onSpinsChange} />
        </div>
      </div>

      {/* ── Mobile Card ── */}
      <div className="flex sm:hidden w-full max-w-sm bg-white rounded-2xl border border-[#D4CECE] overflow-hidden">
        {/* Top accent bar */}
        <div
          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-amber-400 rounded-t-2xl"
          style={{ position: "relative" }}
        />

        <div className="w-full p-5 space-y-3">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-blue-600 leading-tight truncate">
                {name}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">{location}</p>
            </div>
            <MobileSpinCounter spins={spins} onChange={onSpinsChange} />
          </div>

          {/* Divider */}
          <hr className="border-gray-100" />

          {/* Top Locations */}
          <div>
            <span className="text-xs font-semibold text-gray-700">
              Top Locations:{" "}
            </span>
            {topLocations.map((loc, i) => (
              <span key={loc.name} className="text-xs">
                <a href={loc.href} className="text-blue-500 hover:underline">
                  {loc.name}
                </a>
                {i < topLocations.length - 1 && (
                  <span className="text-gray-400">, </span>
                )}
              </span>
            ))}
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">
                Campaigns
              </span>
              <span className="text-base font-bold text-gray-800">
                {campaignsCompleted}
              </span>
            </div>
            <div className="w-px h-8 bg-gray-100" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">
                Audience Reach
              </span>
              <span className="text-base font-bold text-gray-800">
                {audienceReach}
              </span>
            </div>
          </div>

          {/* Rating + Tokens */}
          <div className="flex items-center justify-between">
            <StarRating rating={rating} />
            <span className="text-xs font-semibold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
              {tokensPerSpin} Tokens / Spin
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
