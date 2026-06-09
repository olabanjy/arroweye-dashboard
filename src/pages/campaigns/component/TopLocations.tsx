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
    return "bg-white border-gray-200 text-gray-500";
  };

  return (
    <div className="border p-[20px] w-full rounded-[8px] space-y-[20px] hover:bg-green-500 hover:bg-opacity-5 hover:border hover:border-green-500">
      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase mb-2">
          Cost Per Reach
        </p>
        <p className="text-[44px] font-extrabold text-gray-900 leading-none">
          ₦{costPerReach.toFixed(2)}
        </p>
      </div>

      {/* Table */}
      <div>
        <p className="text-[11px] font-bold tracking-widest text-gray-900 uppercase mb-2">
          Top Locations
        </p>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-left pb-2 w-8">
                #
              </th>
              <th className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-left pb-2">
                Location
              </th>
              <th className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right pb-2">
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
                  className="border-b border-gray-50 last:border-none"
                >
                  <td className="py-[9px]">
                    <span
                      className={`w-[26px] h-[26px] rounded-full border inline-flex items-center justify-center text-[11px] font-bold
  ${getRankStyle(index)}`}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-[9px] text-[13px] text-gray-800">
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
        className="w-full py-[13px] bg-gray-900 text-white rounded-full text-[14px] font-semibold hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Download Data
      </button>
    </div>
  );
};

export default CostPerReachCard;
