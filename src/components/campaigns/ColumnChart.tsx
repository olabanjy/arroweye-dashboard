import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { ChartData } from "chart.js";
import { formatNumber } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { ChartFilterSelect } from "./chart-filter-select";
import { ChartInfoTooltip } from "./chart-info-tooltip";

const CHART_FONT_FAMILY = "Google Sans Flex, sans-serif";

type ChartFilterState = {
  weeks?: string;
  lifetime?: string;
};

interface InsightChartProps<TFilters extends ChartFilterState> {
  title: string;
  value: number | string;
  percentageChange?: string;
  selectOptions?: Array<{ value: string; label: string }[]>;
  selectOptionsBottom?: Array<{ value: string; label: string }[]>;
  chartData?: ChartData<"bar", number[], string>;
  valuePlaceholder?: string;
  info?: string;
  placeholder?: string;
  setFilters?: React.Dispatch<React.SetStateAction<TFilters>>;
}

interface ChartDataItem {
  name: string;
  value: number;
  fill: string;
  stroke: string;
}

const generateDynamicColor = (index: number) => {
  return `var(--chart-${(index % 5) + 1})`;
};

const ColumnChart = <TFilters extends ChartFilterState = ChartFilterState>({
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
  const formatDataForRecharts = (): ChartDataItem[] => {
    if (!chartData?.labels || !chartData.datasets[0].data) return [];

    // Filter out entries with zero values
    return chartData.labels
      .map((label, index) => ({
        name: label,
        value: chartData.datasets[0].data[index],
        fill: generateDynamicColor(index),
        stroke: generateDynamicColor(index),
      }))
      .filter((item) => item.value > 0); // Only include items with values greater than 0
  };

  const data = formatDataForRecharts();
  const chartConfig = {
    value: { label: title, color: "var(--chart-1)" },
  } satisfies ChartConfig;

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

  return (
    <div className="space-y-5 font-SansFlex w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[5px] text-[#7a8081]">
          <p className="!text-[12px] font-[400] tracking-[.1rem]">{title}</p>
          {info && <ChartInfoTooltip content={info} />}
        </div>
        <div>
          {selectOptions?.map((options, index) => (
            <div key={index} className="max-w-[180px] w-full">
              <ChartFilterSelect options={options} placeholder={placeholder} />
            </div>
          ))}
          {!selectOptions && <div className="h-10 max-w-[180px] w-full"></div>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <p className="text-2xl lg:text-[56px] font-[600] font-SansFlex">
          {!!value && formatNumber(value)}
        </p>
        {Number(value) > 1000 && (
          <ChartInfoTooltip content={value.toLocaleString()} />
        )}
      </div>
      <div>
        <p className="!text-[12px] font-[400] tracking-[.1rem] text-black">
          {valuePlaceholder}
        </p>

        <div className="w-full h-full flex justify-center items-center">
          <ChartContainer
            config={chartConfig}
            className="h-[313px] w-full max-w-[313px] aspect-auto"
          >
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              barSize={30}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal
                vertical={false}
                stroke="var(--border)"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: "var(--muted-foreground)",
                  fontFamily: CHART_FONT_FAMILY,
                }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: "var(--muted-foreground)",
                  fontFamily: CHART_FONT_FAMILY,
                }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent labelKey="name" />}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    stroke={entry.stroke}
                    strokeWidth={1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </div>
      {/* told to also hide this */}
      <div className="hidden items-center justify-between">
        <div>
          {selectOptionsBottom?.map((options, index) => (
            <div key={index} className="max-w-[200px] w-full">
              <ChartFilterSelect
                options={weeksOptions}
                placeholder="Weeks"
                onChange={(value) => {
                  setFilters?.((prevFilters) => ({
                    ...prevFilters,
                    weeks: String(value),
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
                onChange={(value) => {
                  setFilters?.((prevFilters) => ({
                    ...prevFilters,
                    lifetime: String(value),
                  }));
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColumnChart;
