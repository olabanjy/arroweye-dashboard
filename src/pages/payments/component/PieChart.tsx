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
  info?: string;
}

const TooltipComponent = ({ info }: { info: string }) => (
  <div className="relative group">
    <FiInfo className="text-gray-400 hover:text-blue-500 cursor-pointer" />
    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 hidden w-52 p-2 text-xs font-[400] text-white bg-black rounded-lg group-hover:block z-10 shadow-lg font-IBM">
      {info}
    </div>
  </div>
);

const PieChart: FC<InsightChartProps> = ({
  title,
  value,
  selectOptions,
  chartData,
  info,
}) => {
  const defaultChartData: ChartData<"pie", number[], string> = chartData || {
    labels: ["Radio", "Cable", "TV", "DJ"],
    datasets: [
      {
        label: "AIRPLAY",
        data: [300, 50, 100, 22],
        backgroundColor: ["#f8e0e1", "#d7ecfb", "#f8f5d8", "#d4f2ed"],
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 1)",
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
    <div className="space-y-[20px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[5px] text-[#7a8081]">
          <p className="!text-[12px] font-[400] tracking-[.1rem]">{title}</p>
          {info && <TooltipComponent info={info} />}
        </div>
        <div>
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
      <div>
        <p className="!text-[12px] font-[400] tracking-[.1rem] text-[#000000] font-IBM">
          TOP CHANNELS
        </p>

        {defaultChartData && (
          <div className="w-full h-[300px] font-IBM">
            <Pie
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
                  tooltip: {
                    enabled: true,
                    callbacks: {
                      label: function (tooltipItem) {
                        const dataset =
                          defaultChartData.datasets[tooltipItem.datasetIndex];
                        const currentValue =
                          dataset.data[tooltipItem.dataIndex];
                        const label = defaultChartData.labels
                          ? defaultChartData.labels[tooltipItem.dataIndex]
                          : "";
                        return `${label}: ${currentValue}`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div>
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
        <div>
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

export default PieChart;
