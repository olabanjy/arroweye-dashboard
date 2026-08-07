"use client";

import React, { useMemo, useState } from "react";
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
const CHART_FONT_FAMILY = "SansFlex, sans-serif";

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

  const [hiddenNames, setHiddenNames] = useState<Set<string>>(new Set());

  const toggleName = (name: string) => {
    setHiddenNames((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const visibleChartData = useMemo(
    () => chartData.filter((entry) => !hiddenNames.has(entry.name)),
    [chartData, hiddenNames],
  );

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
    <Card className="flex flex-col justify-between gap-[20px] border-0 bg-transparent p-0 font-SansFlex text-card-foreground shadow-none">
      <CardHeader className="p-0">
        <CardTitle className="mb-2 font-SansFlex text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          DSP
        </CardTitle>
        <p className="text-[44px] font-extrabold leading-none text-foreground">
          {hasData ? formatNumber(totalCount) : "—"}
        </p>
      </CardHeader>

      <CardContent className="p-0">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-primary">
          Top DSPs
        </p>
        {hasData ? (
          <>
            {chartData.length > 0 && (
              <div className="mb-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[13px] leading-none text-[#6f6f6f]">
                {chartData.map((entry) => {
                  const isHidden = hiddenNames.has(entry.name);
                  const color = DSP_COLORS[entry.name] ?? DEFAULT_COLOR;
                  return (
                    <button
                      type="button"
                      key={entry.name}
                      onClick={() => toggleName(entry.name)}
                      className="flex items-center gap-2 transition-opacity"
                      style={{ opacity: isHidden ? 0.4 : 1 }}
                    >
                      <span
                        className="h-[14px] w-4 shrink-0 border"
                        style={{
                          backgroundColor: color,
                          borderColor: color,
                          opacity: 0.5,
                        }}
                      />
                      <span
                        className={
                          isHidden
                            ? "line-through decoration-[#6f6f6f]/60"
                            : ""
                        }
                      >
                        {entry.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <ChartContainer
              config={chartConfig}
              className="h-[220px] w-full aspect-auto font-SansFlex"
            >
              <BarChart
                data={visibleChartData}
                barSize={32}
                margin={{ left: 10, right: 10, top: 4, bottom: 4 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 11,
                    fill: "var(--muted-foreground)",
                    fontFamily: CHART_FONT_FAMILY,
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={formatYAxis}
                  tick={{
                    fontSize: 10,
                    fill: "var(--muted-foreground)",
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
                  {visibleChartData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={DSP_COLORS[entry.name] ?? DEFAULT_COLOR}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </>
        ) : (
          <div className="flex h-[220px] items-center justify-center text-[13px] text-muted-foreground">
            No DSP data available
          </div>
        )}
      </CardContent>

      {/* was told to hide this for now */}
      <CardFooter className="hidden items-center justify-between p-0">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="h-auto w-auto rounded-full border-border bg-card px-[14px] py-[6px] text-[13px] font-medium text-foreground shadow-none focus:ring-0">
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
          <SelectTrigger className="h-auto w-auto rounded-full border-border bg-card px-[14px] py-[6px] text-[13px] font-medium text-foreground shadow-none focus:ring-0">
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
        className="h-auto w-full rounded-full bg-primary py-[13px] text-[14px] font-semibold text-primary-foreground hover:bg-orange-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Download Data
      </Button>
    </Card>
  );
};

export default DSPCard;
