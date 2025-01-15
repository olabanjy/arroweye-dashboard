import React, { FC } from "react";
import { FiInfo } from "react-icons/fi";
import { SelectInput } from "@/components/ui/selectinput";
import { Doughnut } from "react-chartjs-2";
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
  chartData?: ChartData<"doughnut", number[], string>;
  maxWidth?: string;
}

const DoughnutChart: FC<InsightChartProps> = ({
  title,
  value,
  selectOptions,
  chartData,
  maxWidth = "400px",
}) => {
  const defaultChartData: ChartData<"doughnut", number[], string> =
    chartData || {
      labels: ["Radio", "Cable", "Tv", "Dj"],
      datasets: [
        {
          label: "AIRPLAY",
          data: [300, 50, 100, 22],
          backgroundColor: ["#f8e0e1", "#d7ecfb", "#f8f5d8", "#d4f2ed"],
          borderColor: ["#f8e0e1", "#d7ecfb", "#f8f5d8", "#d4f2ed"],
          borderWidth: 12,
        },
      ],
    };

  const weeksOptions = [
    { value: "week1", label: "Week 1" },
    { value: "week2", label: "Week 2" },
    { value: "week3", label: "Week 3" },
    { value: "week4", label: "Week 4" },
    { value: "week5", label: "Week 5" },
  ];

  const months = [
    { value: "jan", label: "January" },
    { value: "feb", label: "February" },
    { value: "mar", label: "March" },
    { value: "apr", label: "April" },
    { value: "may", label: "May" },
    { value: "jun", label: "June" },
    { value: "jul", label: "July" },
    { value: "aug", label: "August" },
    { value: "sep", label: "September" },
    { value: "oct", label: "October" },
    { value: "nov", label: "November" },
    { value: "dec", label: "December" },
  ];

  return (
    <div className={`space-y-[20px]`} style={{ maxWidth, width: "100%" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[5px] text-[#7a8081]">
          <p className="!text-[12px] font-[400]">{title}</p>
          <FiInfo className="text-gray-400 hover:text-blue-500" />
        </div>
        <div className="">
          {selectOptions?.map((options, index) => (
            <div key={index} className="max-w-[180px] w-full">
              <SelectInput
                rounded={true}
                options={options}
                placeholder="Channels"
              />
            </div>
          ))}
        </div>
      </div>

      <p className="text-2xl lg:text-[56px] font-[600] font-IBM">{value}</p>
      <div className="">
        <p className="text-[12px] font-[400] text-[#000000]">Top Channels</p>

        {defaultChartData && (
          <div className="w-full h-[300px]">
            <Doughnut
              data={defaultChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
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

      <div className="flex items-center justify-between">
        <div className="">
          {selectOptions?.map((options, index) => (
            <div key={index} className="max-w-[110px] w-full">
              <SelectInput
                rounded={true}
                options={weeksOptions}
                placeholder="Weeks"
              />
            </div>
          ))}
        </div>
        <div className="">
          {selectOptions?.map((options, index) => (
            <div key={index} className="max-w-[110px] w-full">
              <SelectInput
                rounded={true}
                options={months}
                placeholder="Lifetime"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoughnutChart;
