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
    return "bg-card border-border text-muted-foreground";
  };
  return (
    <div className="w-full space-y-5 rounded-xl border border-border bg-card p-5 text-card-foreground transition-colors hover:border-green-500 hover:bg-green-500/5">
      {/* Header */}
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Verified Spins Delivered
        </p>
        <p className="text-[44px] font-extrabold leading-none text-primary">
          <span className="text-muted-foreground">
            {verifiedSpinsDelivered}
          </span>
          {" / "}
          {verifiedSpinsTarget}
        </p>
      </div>

      {/* Table */}
      <div>
        <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-primary">
          Top DJs
        </p>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="w-8 pb-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                #
              </th>
              <th className="pb-2 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                DJ
              </th>
              <th className="pb-2 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Completion Status
              </th>
            </tr>
          </thead>
          <tbody>
            {topDJs.map((dj, index) => (
              <tr
                key={dj.dj_id}
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
        className="w-full rounded-full bg-primary py-[13px] text-[14px] font-semibold text-primary-foreground transition-colors hover:bg-orange-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Download Data
      </button>
    </div>
  );
};

export default VerifiedSpinsCard;
