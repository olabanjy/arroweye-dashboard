"use client";

import React, { useMemo, useState } from "react";
import type { ChartData } from "chart.js";
import { Cell, Pie, PieChart as RechartsPieChart } from "recharts";

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
import { ChartFilterSelect } from "@/components/campaigns/chart-filter-select";
import { ChartInfoTooltip } from "@/components/campaigns/chart-info-tooltip";
import { EmptyInsightChartCard } from "@/components/campaigns/EmptyInsightChartCard";
import { formatNumber } from "@/lib/utils";

type ChartFilterState = {
  channels?: string;
  weeks?: string;
  lifetime?: string;
};

interface InsightChartProps<TFilters extends ChartFilterState> {
  title: string;
  value: number | string;
  percentageChange?: string;
  selectOptions?: Array<{ value: string; label: string }[]>;
  selectOptionsBottom?: Array<{ value: string; label: string }[]>;
  chartData?: ChartData<"pie", number[], string>;
  valuePlaceHolder?: string;
  info?: string;
  setFilters?: React.Dispatch<React.SetStateAction<TFilters>>;
}

const fallbackColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const filterSelectClassName = "w-[120px]";

const getColor = (colors: unknown, index: number) => {
  if (Array.isArray(colors) && typeof colors[index] === "string") {
    return colors[index];
  }
  return fallbackColors[index % fallbackColors.length];
};

const getLightChartFillColor = (color: string) =>
  `color-mix(in srgb, ${color} 20%, transparent)`;

const getKey = (label: string, index: number) => {
  const slug = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug || "segment"}-${index}`;
};

const weeksOptions = [
  { value: "", label: "Weeks" },
  { value: "1", label: "Week 1" },
  { value: "2", label: "Week 2" },
  { value: "3", label: "Week 3" },
  { value: "4", label: "Week 4" },
];

const months = [
  { value: "", label: "Lifetime" },
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const CampaignPieChart = <
  TFilters extends ChartFilterState = ChartFilterState,
>({
  title,
  value,
  selectOptions,
  selectOptionsBottom,
  chartData,
  info,
  valuePlaceHolder,
  setFilters,
}: InsightChartProps<TFilters>) => {
  const labels = chartData?.labels ?? [];
  const dataset = chartData?.datasets[0];
  const values = dataset?.data ?? [];

  const pieData = values.map((entryValue, index) => {
    const label = labels[index] ?? `Segment ${index + 1}`;
    const segment = getKey(label, index);
    const color = getColor(dataset?.backgroundColor, index);
    const darkColor = `var(--chart-${(index % fallbackColors.length) + 1})`;

    return {
      segment,
      label,
      value: entryValue,
      color,
      darkColor,
      fill: `var(--color-${segment})`,
      stroke: `var(--color-${segment}-border)`,
    };
  }).filter((item) => Number(item.value) > 0);
  const hasChartData = pieData.length > 0;

  const [hiddenSegments, setHiddenSegments] = useState<Set<string>>(new Set());

  const toggleSegment = (segment: string) => {
    setHiddenSegments((prev) => {
      const next = new Set(prev);
      if (next.has(segment)) {
        next.delete(segment);
      } else {
        next.add(segment);
      }
      return next;
    });
  };

  const visiblePieData = useMemo(
    () => pieData.filter((item) => !hiddenSegments.has(item.segment)),
    [pieData, hiddenSegments],
  );

  const chartConfig = pieData.reduce<ChartConfig>(
    (config, item) => ({
      ...config,
      [item.segment]: {
        label: item.label,
        theme: {
          light: getLightChartFillColor(item.color),
          dark: item.darkColor,
        },
      },
      [`${item.segment}-border`]: {
        theme: {
          light: item.color,
          dark: item.darkColor,
        },
      },
    }),
    { value: { label: title } },
  );

  if (!hasChartData) {
    return <EmptyInsightChartCard />;
  }

  return (
    <Card className="flex flex-col !gap-5 border-0 bg-transparent p-0 shadow-none">
      <CardHeader className="!flex items-center justify-between space-y-0 p-0">
        <div className="flex items-center gap-1 text-muted-foreground">
          <CardTitle className="text-xs font-normal uppercase tracking-[.1rem]">
            {title}
          </CardTitle>
          {info && <ChartInfoTooltip content={info} />}
        </div>

        {selectOptions && (
          <div className="shrink-0">
            {selectOptions.map((options, index) => (
              <ChartFilterSelect
                key={index}
                options={options}
                placeholder="Channels"
                className={filterSelectClassName}
                onChange={(selectedValue) => {
                  setFilters?.((previous) => ({
                    ...previous,
                    channels: selectedValue,
                  }));
                }}
              />
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-5 p-0">
        <div className="flex items-center gap-2">
          <p className="text-2xl font-semibold lg:text-[56px]">
            {!!value && formatNumber(value)}
          </p>
          {Number(value) > 1000 && (
            <ChartInfoTooltip content={value.toLocaleString()} />
          )}
        </div>

        <p className="text-xs uppercase text-muted-foreground">
          {valuePlaceHolder}
        </p>

        {pieData.length > 0 && (
          <div className="pt-2">
            <div className="mb-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[13px] leading-none text-[#6f6f6f]">
              {pieData.map((item) => {
                const isHidden = hiddenSegments.has(item.segment);
                return (
                  <button
                    type="button"
                    key={item.segment}
                    onClick={() => toggleSegment(item.segment)}
                    className="flex items-center gap-2 transition-opacity"
                    style={{ opacity: isHidden ? 0.4 : 1 }}
                  >
                    <span
                      className="h-[14px] w-7 shrink-0 border bg-[var(--chart-legend-bg)] dark:bg-[var(--chart-legend-dark-bg)] border-[var(--chart-legend-border)] dark:border-[var(--chart-legend-dark-border)]"
                      style={
                        {
                          "--chart-legend-bg": getLightChartFillColor(item.color),
                          "--chart-legend-border": item.color,
                          "--chart-legend-dark-bg": item.darkColor,
                          "--chart-legend-dark-border": item.darkColor,
                        } as React.CSSProperties
                      }
                    />
                    <span
                      className={
                        isHidden
                          ? "line-through decoration-[#6f6f6f]/60"
                          : ""
                      }
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {visiblePieData.length > 0 ? (
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square w-full max-w-[350px]"
              >
                <RechartsPieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel nameKey="segment" />}
                  />
                  <Pie
                    data={visiblePieData}
                    dataKey="value"
                    nameKey="segment"
                    outerRadius="88%"
                  >
                    {visiblePieData.map((item) => (
                      <Cell
                        key={item.segment}
                        fill={item.fill}
                        stroke={item.stroke}
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                </RechartsPieChart>
              </ChartContainer>
            ) : (
              <div className="mx-auto flex aspect-square w-full max-w-[350px] items-center justify-center text-[13px] text-[#6f6f6f]">
                All segments hidden
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="hidden items-center justify-between p-0">
        {selectOptionsBottom?.map((_, index) => (
          <ChartFilterSelect
            key={`week-${index}`}
            options={weeksOptions}
            placeholder="Weeks"
            onChange={(selectedValue) => {
              setFilters?.((previous) => ({
                ...previous,
                weeks: selectedValue,
              }));
            }}
          />
        ))}
        {selectOptionsBottom?.map((_, index) => (
          <ChartFilterSelect
            key={`month-${index}`}
            options={months}
            placeholder="Lifetime"
            onChange={(selectedValue) => {
              setFilters?.((previous) => ({
                ...previous,
                lifetime: selectedValue,
              }));
            }}
          />
        ))}
      </CardFooter>
    </Card>
  );
};

export default CampaignPieChart;
