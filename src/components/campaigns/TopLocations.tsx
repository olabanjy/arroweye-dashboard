// components/CostPerReachCard.tsx
import React from "react";

interface Location {
  name: string;
  estimated_reach: number;
}

interface Props {
  costPerReach: number;
  topLocations: Location[];
}

const getStatusColor = (pct: number) => {
  if (pct >= 70) return "text-green-500";
  if (pct >= 40) return "text-orange-400";
  return "text-red-500";
};

const formatReach = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
};

const CostPerReachCard: React.FC<Props> = ({
  costPerReach = 0,
  topLocations = [],
}) => {
  const maxReach =
    topLocations.length > 0
      ? Math.max(...topLocations.map((l) => l.estimated_reach))
      : 1;

  const downloadCSV = (
    filename: string,
    headers: string[],
    rows: (string | number)[][],
  ) => {
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownload = () => {
    downloadCSV(
      "top_locations.csv",
      ["Rank", "Location", "Count", "Estimated Reach"],
      topLocations.map((loc: any, i) => [
        i + 1,
        `"${loc.name}"`,
        loc.count,
        loc.estimated_reach,
      ]),
    );
  };

  const getRankStyle = (index: number) => {
    if (index === 0) return "bg-amber-400 border-amber-400 text-white"; // gold
    if (index === 1) return "bg-gray-400 border-gray-400 text-white"; // silver
    if (index === 2) return "bg-amber-700 border-amber-700 text-white"; // bronze
    return "bg-card border-border text-muted-foreground";
  };

  return (
    <div className="w-full space-y-5 rounded-xl border border-border bg-card p-5 font-SansFlex text-card-foreground transition-colors hover:border-green-500 hover:bg-green-500/5">
      {/* Header */}
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Cost Per Reach
        </p>
        <p className="text-[44px] font-extrabold leading-none text-primary">
          ₦{costPerReach.toFixed(2)}
        </p>
      </div>

      {/* Table */}
      <div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-primary">
          Top Locations
        </p>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="w-8 pb-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                #
              </th>
              <th className="pb-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Location
              </th>
              <th className="pb-2 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Estimated Reach
              </th>
            </tr>
          </thead>
          <tbody>
            {topLocations.map((loc, index) => {
              const pct = Math.round((loc.estimated_reach / maxReach) * 100);
              return (
                <tr
                  key={loc.name}
                  className="border-b border-border/60 last:border-none"
                >
                  <td className="py-[9px]">
                    <span
                      className={`inline-flex h-[26px] w-[26px] items-center justify-center rounded-full border text-[11px] font-bold
  ${getRankStyle(index)}`}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-[9px] text-[13px] text-foreground">
                    {loc.name}
                  </td>
                  <td
                    className={`py-[9px] text-[13px] font-bold text-right ${getStatusColor(pct)}`}
                  >
                    {formatReach(loc.estimated_reach)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleDownload}
        disabled={topLocations.length === 0}
        className="w-full rounded-full bg-primary py-[13px] text-[14px] font-semibold text-primary-foreground transition-colors hover:bg-orange-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Download Data
      </button>
    </div>
  );
};

export default CostPerReachCard;
