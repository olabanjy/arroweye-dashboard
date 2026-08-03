"use client";

import React from "react";
import { Cell, Pie, PieChart } from "recharts";

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
import { formatNumber } from "@/lib/utils";
import { ChartFilterSelect } from "./chart-filter-select";
import { ChartInfoTooltip } from "./chart-info-tooltip";

type ChartFilterState = {
  country?: string;
  weeks?: string;
  lifetime?: string;
};

type DoughnutChartData = {
  labels?: string[];
  datasets: Array<{
    data?: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }>;
};

interface InsightChartProps<TFilters extends ChartFilterState> {
  title: string;
  value: number | string;
  percentageChange?: string;
  selectOptions?: Array<{ value: string; label: string }[]>;
  selectOptionsBottom?: Array<{ value: string; label: string }[]>;
  chartData?: DoughnutChartData;
  valuePlaceholder?: string;
  info?: string;
  placeholder?: string;
  setFilters?: React.Dispatch<React.SetStateAction<TFilters>>;
}

const fallbackColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const getDarkChartColor = (index: number) =>
  `var(--chart-${(index % fallbackColors.length) + 1})`;

const getTranslucentChartColor = (color: string) =>
  `color-mix(in srgb, ${color} 45%, transparent)`;

const getChartColor = (
  backgroundColor: string | string[] | undefined,
  index: number,
) => {
  if (Array.isArray(backgroundColor)) {
    return (
      backgroundColor[index] ?? fallbackColors[index % fallbackColors.length]
    );
  }

  return backgroundColor ?? fallbackColors[index % fallbackColors.length];
};

const getChartKey = (label: string, index: number) => {
  const slug = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${slug || "segment"}-${index}`;
};

const DoughnutChart = <TFilters extends ChartFilterState = ChartFilterState>({
  title,
  value,
  selectOptions,
  selectOptionsBottom,
  chartData,
  placeholder,
  valuePlaceholder,
  info,
  setFilters,
}: InsightChartProps<TFilters>) => {
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

  const labels = chartData?.labels ?? [];
  const dataset = chartData?.datasets[0];
  const values = dataset?.data ?? [];

  const pieChartData = values.map((entryValue, index) => {
    const label = labels[index] ?? `Segment ${index + 1}`;
    const key = getChartKey(label, index);

    return {
      segment: key,
      label,
      value: entryValue,
      color: getChartColor(dataset?.backgroundColor, index),
      darkColor: getDarkChartColor(index),
      fill: `var(--color-${key})`,
      stroke: `var(--color-${key}-border)`,
    };
  });

  const chartConfig = pieChartData.reduce<ChartConfig>(
    (config, item) => ({
      ...config,
      [item.segment]: {
        label: item.label,
        theme: {
          light: getTranslucentChartColor(item.color),
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
    {
      value: {
        label: title,
      },
    },
  );

  return (
    <Card className="flex flex-col border-0 bg-transparent p-0 shadow-none font-SansFlex">
      <CardHeader className="flex-row items-center justify-between space-y-0 p-0">
        <div className="flex items-center gap-[5px] text-[#7a8081]">
          <CardTitle className="!text-[12px] font-[400] tracking-[.1rem]">
            {title}
          </CardTitle>
          {info && <ChartInfoTooltip content={info} />}
        </div>

        <div>
          {selectOptions?.map((options, index) => (
            <div key={index} className="max-w-[180px] w-full">
              <ChartFilterSelect
                options={options}
                placeholder={placeholder}
                onChange={(selectedValue) => {
                  setFilters?.((prevFilters) => ({
                    ...prevFilters,
                    country: String(selectedValue),
                  }));
                }}
              />
            </div>
          ))}
          {!selectOptions && <div className="h-[40px] max-w-[180px] w-full" />}
        </div>
      </CardHeader>

      <CardContent className="space-y-[20px] p-0">
        <div className="flex items-center gap-2">
          <p className="text-2xl lg:text-[56px] font-[600] font-SansFlex">
            {!!value && formatNumber(value)}
          </p>
          {Number(value) > 1000 && (
            <ChartInfoTooltip content={value.toLocaleString()} />
          )}
        </div>

        <div>
          <p className="!text-[12px] font-[400] tracking-[.1rem] text-[#000000]">
            {valuePlaceholder}
          </p>

          {pieChartData.length > 0 && (
            <div className="pt-2">
              <div className="mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[14px] text-[#6f6f6f]">
                {pieChartData.map((item) => (
                  <div key={item.segment} className="flex items-center gap-2">
                    <span
                      className="h-5 w-7 shrink-0 border bg-[var(--chart-legend-bg)] dark:bg-[var(--chart-legend-dark-bg)] border-[var(--chart-legend-border)] dark:border-[var(--chart-legend-dark-border)]"
                      style={
                        {
                          "--chart-legend-bg": getTranslucentChartColor(
                            item.color,
                          ),
                          "--chart-legend-border": item.color,
                          "--chart-legend-dark-bg": item.darkColor,
                          "--chart-legend-dark-border": item.darkColor,
                        } as React.CSSProperties
                      }
                    />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[300px] font-SansFlex"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent hideLabel nameKey="segment" />
                    }
                  />
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="segment"
                    innerRadius={60}
                  >
                    {pieChartData.map((item) => (
                      <Cell
                        key={item.segment}
                        fill={item.fill}
                        stroke={item.stroke}
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="hidden items-center justify-between p-0">
        <div>
          {selectOptionsBottom?.map((options, index) => (
            <div key={index} className="min-w-[80px] max-w-[200px] w-full">
              <ChartFilterSelect
                options={weeksOptions}
                placeholder="Weeks"
                onChange={(selectedValue) => {
                  setFilters?.((prevFilters) => ({
                    ...prevFilters,
                    weeks: String(selectedValue),
                  }));
                }}
              />
            </div>
          ))}
        </div>
        <div>
          {selectOptionsBottom?.map((options, index) => (
            <div key={index} className="max-w-[110px] w-full">
              <ChartFilterSelect
                options={months}
                placeholder="Lifetime"
                onChange={(selectedValue) => {
                  setFilters?.((prevFilters) => ({
                    ...prevFilters,
                    lifetime: String(selectedValue),
                  }));
                }}
              />
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default DoughnutChart;
