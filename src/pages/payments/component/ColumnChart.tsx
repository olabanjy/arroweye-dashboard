import React, { FC } from "react";
import { FiInfo } from "react-icons/fi";
import { SelectInput } from "@/components/ui/selectinput";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts";
import { ChartData } from "chart.js";

interface InsightChartProps {
  title: string;
  value: number | string;
  percentageChange?: string;
  selectOptions?: Array<{ value: string; label: string }[]>;
  selectOptionsBottom?: Array<{ value: string; label: string }[]>;
  chartData?: ChartData<"bar", number[], string>;
  valuePlaceholder?: string;
  info?: string;
  placeholder?: string;
  setFilters?: any;
}

interface ChartDataItem {
  name: string;
  value: number;
  fill: string;
  stroke: string;
}

const Tooltip = ({ info }: { info: string }) => (
  <div className="relative group">
    <FiInfo className="text-gray-400 hover:text-blue-500 cursor-pointer" />
    <div className="absolute left-[25px] top-0 transform ml-1 hidden w-60 p-[12px] text-xs font-[400] text-white bg-black rounded-[4px] group-hover:block z-10 shadow-lg font-IBM">
      <div className="absolute left-0 top-[10px] transform -translate-y-1/2 -ml-[6px] border-black border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-black"></div>
      {info}
    </div>
  </div>
);

const generateDynamicColor = (index: number) => {
  const hue = (index * 137.5) % 360;
  return `hsl(${hue}, 70%, 70%)`;
};

const ColumnChart: FC<InsightChartProps> = ({
  title,
  value,
  selectOptions,
  selectOptionsBottom,
  chartData,
  placeholder,
  valuePlaceholder,
  info,
  setFilters,
}) => {
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

  const weeksOptions = [
    { value: "", label: "All Weeks" },
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
    <div className="space-y-5 font-IBM w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[5px] text-[#7a8081]">
          <p className="!text-[12px] font-[400] tracking-[.1rem]">{title}</p>
          {info && <Tooltip info={info} />}
        </div>
        <div>
          {selectOptions?.map((options, index) => (
            <div key={index} className="max-w-[180px] w-full">
              <SelectInput
                rounded={true}
                options={options}
                placeholder={placeholder}
              />
            </div>
          ))}
          {!selectOptions && <div className="h-10 max-w-[180px] w-full"></div>}
        </div>
      </div>

      <p className="text-2xl lg:text-[56px] font-[600] font-IBM">{value}</p>
      <div>
        <p className="!text-[12px] font-[400] tracking-[.1rem] text-black">
          {valuePlaceholder}
        </p>

        <div className="w-full h-full flex justify-center items-center">
          <div className="w-[313px] h-[313px]">
            <ResponsiveContainer width="100%" height="100%">
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
                  stroke="#E5E5E5"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#666" }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#666" }}
                />
                <RechartsTooltip
                  wrapperStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "4px",
                    padding: "10px",
                    fontSize: "12px",
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="tooltip-content">
                          <p>{`${payload[0].payload.name}: ${payload[0].value}`}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
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
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          {selectOptionsBottom?.map((options, index) => (
            <div key={index} className="max-w-[200px] w-full">
              <SelectInput
                rounded={true}
                options={weeksOptions}
                placeholder="Weeks"
                onChange={(value: any) => {
                  setFilters((prevFilters: any) => ({
                    ...prevFilters,
                    weeks: value,
                  }));
                }}
              />
            </div>
          ))}
        </div>
        <div>
          {selectOptionsBottom?.map((options, index) => (
            <div key={index} className="max-w-[110px] w-full">
              <SelectInput
                rounded={true}
                options={months}
                placeholder="Lifetime"
                onChange={(value: any) => {
                  setFilters((prevFilters: any) => ({
                    ...prevFilters,
                    lifetime: value,
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
