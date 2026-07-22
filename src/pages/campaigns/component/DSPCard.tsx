import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface DSPEntry {
  name: string;
  count: number;
}

interface Props {
  dspBreakdown: DSPEntry[];
}

const DSP_COLORS: Record<string, string> = {
  "Apple Music": "#c084fc",
  Spotify: "#22c55e",
  YouTube: "#ef4444",
};

const DEFAULT_COLOR = "#a3a3a3";
const CHART_FONT_FAMILY = "IBM Plex Sans, sans-serif";

const formatNumber = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
};

const formatYAxis = (value: number) => {
  if (value >= 1_000_000) return `${value / 1_000_000}M`;
  if (value >= 1_000) return `${value / 1_000}K`;
  return String(value);
};

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

const PERIOD_OPTIONS = ["Days", "Weeks", "Months", "Lifetime"];

const DSPCard: React.FC<Props> = ({ dspBreakdown }) => {
  const [period, setPeriod] = useState("Weeks");
  const [view, setView] = useState("Lifetime");

  const hasData = dspBreakdown && dspBreakdown.length > 0;

  const totalCount = hasData
    ? dspBreakdown.reduce((sum, d) => sum + d.count, 0)
    : 0;

  const handleDownload = () => {
    downloadCSV(
      "dsp_breakdown.csv",
      ["Platform", "Plays"],
      dspBreakdown.map((d) => [d.name, d.count]),
    );
  };

  return (
    <div className="space-y-[20px] flex flex-col justify-between font-SansFlex">
      <div>
        <p className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase font-SansFlex mb-2">
          DSP
        </p>
        <p className="text-[44px] font-extrabold text-gray-900 leading-none">
          {hasData ? formatNumber(totalCount) : "—"}
        </p>
      </div>

      <div>
        <p className="text-[11px] font-bold tracking-widest text-gray-900 uppercase mb-3 font-SansFlex">
          Top DSPs
        </p>
        {hasData ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={dspBreakdown}
              barSize={32}
              margin={{ left: 10, right: 10, top: 4, bottom: 4 }}
            >
              <XAxis
                dataKey="name"
                tick={{
                  fontSize: 11,
                  fill: "#999",
                  fontFamily: CHART_FONT_FAMILY,
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatYAxis}
                tick={{
                  fontSize: 10,
                  fill: "#bbb",
                  fontFamily: CHART_FONT_FAMILY,
                }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip
                formatter={(value: number) => [formatNumber(value), "Plays"]}
                contentStyle={{
                  borderRadius: 8,
                  fontSize: 12,
                  fontFamily: CHART_FONT_FAMILY,
                  border: "1px solid #eee",
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {dspBreakdown.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={DSP_COLORS[entry.name] ?? DEFAULT_COLOR}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[220px] flex items-center justify-center text-gray-300 text-[13px]">
            No DSP data available
          </div>
        )}
      </div>

      {/* was told to hide this for now */}
      <div className="items-center hidden justify-between">
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border border-gray-300 rounded-full px-[14px] py-[6px] text-[13px] font-medium text-gray-700 bg-white appearance-none cursor-pointer focus:outline-none focus:border-gray-400"
        >
          {PERIOD_OPTIONS.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>

        <select
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="border border-gray-300 rounded-full px-[14px] py-[6px] text-[13px] font-medium text-gray-700 bg-white appearance-none cursor-pointer focus:outline-none focus:border-gray-400"
        >
          {PERIOD_OPTIONS.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleDownload}
        disabled={!hasData}
        className="w-full py-[13px] bg-gray-900 text-white rounded-full text-[14px] font-semibold hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Download Data
      </button>
    </div>
  );
};

export default DSPCard;
