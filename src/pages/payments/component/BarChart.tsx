import React, { FC } from "react";
import { FiInfo } from "react-icons/fi";
import { SelectInput } from "@/components/ui/selectinput";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface InsightChartProps {
  title: string;
  value: number | string;
  percentageChange?: string;
  selectOptions: Array<{ value: string; label: string }[]>;
  chartData?: ChartData<"bar", number[], string>;
  maxWidth?: string;
}

const BarChart: FC<InsightChartProps> = ({
  title,
  value,
  selectOptions,
  chartData,
  maxWidth = "400px",
}) => {
  return (
    <div
      className={`border p-[20px] rounded-[8px] space-y-[20px] w-full hover:bg-green-500 hover:bg-opacity-5 hover:border hover:border-green-500`}
      style={{ maxWidth }}
    >
      <div className="flex items-center gap-[5px] text-[#7a8081]">
        <p className="text-[14px]">{title}</p>
        <FiInfo className="text-gray-400 hover:text-blue-500" />
      </div>

      <p className="text-2xl lg:text-4xl font-bold">{value}</p>

      <div className="grid grid-cols-3 gap-[10px]">
        {selectOptions?.map((options, index) => (
          <div key={index} className="max-w-[100px] w-full">
            <SelectInput options={options} />
          </div>
        ))}
      </div>

      {chartData && (
        <div className="w-full h-[150px]">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
              },
              scales: {
                x: { grid: { display: false } },
                y: { grid: { display: false } },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default BarChart;
