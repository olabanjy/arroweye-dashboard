"use client";

import React from "react";
import type { ChartData } from "chart.js";
import { Pie, PieChart as RechartsPieChart } from "recharts";

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

const defaultData: ChartData<"pie", number[], string> = {
  labels: ["Radio", "Cable", "TV", "DJ"],
  datasets: [
    {
      label: "Airplay",
      data: [300, 50, 100, 22],
      backgroundColor: ["#f8e0e1", "#d7ecfb", "#f8f5d8", "#d4f2ed"],
    },
  ],
};

const getColor = (colors: unknown, index: number) => {
  if (Array.isArray(colors) && typeof colors[index] === "string") {
    return colors[index];
  }
  return fallbackColors[index % fallbackColors.length];
};

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
  const sourceData = chartData || defaultData;
  const labels = sourceData.labels ?? [];
  const dataset = sourceData.datasets[0];
  const values = dataset?.data ?? [];

  const pieData = values.map((entryValue, index) => {
    const label = labels[index] ?? `Segment ${index + 1}`;
    const segment = getKey(label, index);

    return {
      segment,
      label,
      value: entryValue,
      fill: `var(--color-${segment})`,
    };
  });

  const chartConfig = pieData.reduce<ChartConfig>(
    (config, item, index) => ({
      ...config,
      [item.segment]: {
        label: item.label,
        theme: {
          light: getColor(dataset?.backgroundColor, index),
          dark: `var(--chart-${(index % fallbackColors.length) + 1})`,
        },
      },
    }),
    { value: { label: title } },
  );

  return (
    <Card className="flex flex-col border-0 bg-transparent p-0 shadow-none">
      <CardHeader className="flex-row items-center justify-between space-y-0 p-0">
        <div className="flex items-center gap-1 text-muted-foreground">
          <CardTitle className="text-xs font-normal uppercase">
            {title}
          </CardTitle>
          {info && <ChartInfoTooltip content={info} />}
        </div>
        <div>
          {selectOptions?.map((options, index) => (
            <ChartFilterSelect
              key={index}
              options={options}
              placeholder="Channels"
              className="w-[180px]"
              onChange={(selectedValue) => {
                setFilters?.((previous) => ({
                  ...previous,
                  channels: selectedValue,
                }));
              }}
            />
          ))}
          {!selectOptions && <div className="h-10 w-[180px]" />}
        </div>
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
          <ChartContainer
            config={chartConfig}
            className="mx-auto h-[300px] w-full aspect-auto"
          >
            <RechartsPieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel nameKey="segment" />}
              />
              <Pie data={pieData} dataKey="value" nameKey="segment" />
            </RechartsPieChart>
          </ChartContainer>
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
