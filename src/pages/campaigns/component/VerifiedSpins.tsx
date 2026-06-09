// components/VerifiedSpinsCard.tsx
import React from "react";

interface DJ {
  dj_id: number;
  dj_name: string;
  completion_status: number;
}

interface Props {
  verifiedSpinsDelivered: number;
  verifiedSpinsTarget: number;
  topDJs: DJ[];
}

const getStatusColor = (pct: number) => {
  if (pct >= 70) return "text-green-500";
  if (pct >= 40) return "text-orange-400";
  return "text-red-500";
};

const VerifiedSpinsCard: React.FC<Props> = ({
  verifiedSpinsDelivered = 0,
  verifiedSpinsTarget = 0,
  topDJs = [],
}) => {
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
      "top_djs.csv",
      [
        "Rank",
        "DJ Name",
        "Spins Allocated",
        "Spins Completed",
        "Completion Status (%)",
      ],
      topDJs.map((dj: any, i) => [
        i + 1,
        dj.dj_name,
        dj.spins_allocated,
        dj.spins_completed,
        dj.completion_status,
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
          Verified Spins Delivered
        </p>
        <p className="text-[44px] font-extrabold text-gray-900 leading-none">
          <span className="text-gray-300">{verifiedSpinsDelivered}</span>
          {" / "}
          {verifiedSpinsTarget}
        </p>
      </div>

      {/* Table */}
      <div>
        <p className="text-[11px] font-bold tracking-widest text-gray-900 uppercase mb-2">
          Top DJs
        </p>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-left pb-2 w-8">
                #
              </th>
              <th className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-left pb-2">
                DJ
              </th>
              <th className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right pb-2">
                Completion Status
              </th>
            </tr>
          </thead>
          <tbody>
            {topDJs.map((dj, index) => (
              <tr
                key={dj.dj_id}
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
                  {dj.dj_name}
                </td>
                <td
                  className={`py-[9px] text-[13px] font-bold text-right ${getStatusColor(dj.completion_status)}`}
                >
                  {dj.completion_status}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleDownload}
        disabled={topDJs.length === 0}
        className="w-full py-[13px] bg-gray-900 text-white rounded-full text-[14px] font-semibold hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Download Data
      </button>
    </div>
  );
};

export default VerifiedSpinsCard;
