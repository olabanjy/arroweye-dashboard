import React, { FC } from "react";
import { FiInfo } from "react-icons/fi";
import { SelectInput } from "@/components/ui/selectinput";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface InsightChartProps {
  title: string;
  value: number | string;
  percentageChange?: string;
  selectOptions: Array<{ value: string; label: string }[]>;
  chartData?: ChartData<"pie", number[], string>;
  maxWidth?: string;
}

const PieChart: FC<InsightChartProps> = ({
  title,
  value,
  selectOptions,
  chartData,
  maxWidth = "400px",
}) => {
  const topChannels = chartData?.labels || [];
  const chartColors = chartData?.datasets?.[0]?.backgroundColor as string[];

  return (
    <div
      className={`border p-[20px] rounded-[8px] space-y-[20px] w-full hover:bg-green-500 hover:bg-opacity-5 hover:border hover:border-green-500`}
      style={{ maxWidth, width: "100%" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[5px] text-[#7a8081]">
          <p className="text-[14px]">{title}</p>
          <FiInfo className="text-gray-400 hover:text-blue-500" />
        </div>
        <div className="">
          {selectOptions?.map((options, index) => (
            <div key={index} className="max-w-[180px] w-full">
              <SelectInput rounded={true} options={options} />
            </div>
          ))}
        </div>
      </div>

      <p className="text-2xl lg:text-4xl font-bold">{value}</p>
      <div className="space-y-[10px]">
        <p className="text-[16px] font-semibold">Top Channels</p>
        <ul className="grid grid-cols-3 gap-[3px]">
          {topChannels.map((channel, index) => (
            <li key={index} className="flex items-center gap-[8px]">
              <span
                className="inline-block w-[12px] h-[12px] rounded-full"
                style={{ backgroundColor: chartColors[index] }}
              ></span>
              <p className="text-[14px] text-gray-700">{channel}</p>
            </li>
          ))}
        </ul>
      </div>

      {chartData && (
        <div className="w-full h-[300px]">
          <Pie
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    boxWidth: 15,
                    font: { size: 12 },
                  },
                },
                tooltip: { enabled: true },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PieChart;
