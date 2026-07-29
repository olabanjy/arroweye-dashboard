import React, { FC, useEffect, useMemo, useState } from "react";
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
  Legend,
);

const darkChartColors = ["#03a835", "#17954c", "#31bc86", "#73d79c", "#b6efc9"];

const darkChartBorders = [
  "#02842a",
  "#126f39",
  "#209668",
  "#4ebc79",
  "#7fdba2",
];

const useIsDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const updateMode = () => setIsDarkMode(root.classList.contains("dark"));

    updateMode();

    const observer = new MutationObserver(updateMode);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return isDarkMode;
};

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
  const isDarkMode = useIsDarkMode();
  const resolvedChartData = useMemo<
    ChartData<"bar", number[], string> | undefined
  >(() => {
    if (!chartData || !isDarkMode) return chartData;

    return {
      ...chartData,
      datasets: chartData.datasets.map((dataset) => ({
        ...dataset,
        backgroundColor: dataset.data.map(
          (_, index) => darkChartColors[index % darkChartColors.length],
        ),
        borderColor: dataset.data.map(
          (_, index) => darkChartBorders[index % darkChartBorders.length],
        ),
      })),
    };
  }, [chartData, isDarkMode]);

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

      {resolvedChartData && (
        <div className="w-full h-[150px]">
          <Bar
            data={resolvedChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
              },
              scales: {
                x: {
                  grid: { display: false },
                  ticks: { color: "var(--muted-foreground)" },
                },
                y: {
                  grid: { display: false },
                  ticks: { color: "var(--muted-foreground)" },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default BarChart;
