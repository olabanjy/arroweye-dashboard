"use client";

import React, { useState } from "react";
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
const CHART_FONT_FAMILY = "SansFLex, sans-serif";

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

const chartConfig = {
  count: {
    label: "Plays",
  },
} satisfies ChartConfig;

const DSPCard: React.FC<Props> = ({ dspBreakdown }) => {
  const [period, setPeriod] = useState("Weeks");
  const [view, setView] = useState("Lifetime");

  const hasData = dspBreakdown && dspBreakdown.length > 0;
  const chartData = hasData ? dspBreakdown : [];

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
    <Card className="flex flex-col justify-between gap-[20px] border-0 bg-transparent p-0 shadow-none font-SansFlex">
      <CardHeader className="p-0">
        <CardTitle className="mb-2 text-[11px] font-semibold tracking-widest text-gray-400 uppercase font-SansFlex">
          DSP
        </CardTitle>
        <p className="text-[44px] leading-none font-extrabold text-gray-900">
          {hasData ? formatNumber(totalCount) : "—"}
        </p>
      </CardHeader>

      <CardContent className="p-0">
        <p className="text-[11px] font-bold tracking-widest text-primary uppercase mb-3">
          Top DSPs
        </p>
        {hasData ? (
          <ChartContainer
            config={chartConfig}
            className="h-[220px] w-full aspect-auto font-SansFlex"
          >
            <BarChart
              data={chartData}
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
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value) => (
                      <div className="flex min-w-28 items-center justify-between gap-4">
                        <span className="text-muted-foreground">Plays</span>
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {formatNumber(Number(value))}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={DSP_COLORS[entry.name] ?? DEFAULT_COLOR}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="h-[220px] flex items-center justify-center text-gray-300 text-[13px]">
            No DSP data available
          </div>
        )}
      </CardContent>

      {/* was told to hide this for now */}
      <CardFooter className="hidden items-center justify-between p-0">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="h-auto w-auto rounded-full border-gray-300 bg-white px-[14px] py-[6px] text-[13px] font-medium text-gray-700 shadow-none focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={view} onValueChange={setView}>
          <SelectTrigger className="h-auto w-auto rounded-full border-gray-300 bg-white px-[14px] py-[6px] text-[13px] font-medium text-gray-700 shadow-none focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardFooter>

      <Button
        onClick={handleDownload}
        disabled={!hasData}
        className="h-auto w-full rounded-full bg-gray-900 py-[13px] text-[14px] font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Download Data
      </Button>
    </Card>
  );
};

export default DSPCard;
