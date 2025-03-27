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
import { formatNumber } from "@/lib/utils";

ChartJS.register(ArcElement, Tooltip, Legend);

interface InsightChartProps {
  title: string;
  value: number | string;
  percentageChange?: string;
  selectOptions?: Array<{ value: string; label: string }[]>;
  selectOptionsBottom?: Array<{ value: string; label: string }[]>;
  chartData?: ChartData<"pie", number[], string>;
  valuePlaceHolder?: string;
  info?: string;
  setFilters?: any;
}

const TooltipComponent = ({ info }: { info: string }) => (
  <div className="relative group">
    <FiInfo className="text-gray-400 hover:text-blue-500 cursor-pointer" />
    <div className="absolute left-full top-0 transform  ml-1 hidden w-60 p-2 text-xs font-[400] text-white bg-black rounded-[4px] group-hover:block z-10 shadow-lg font-IBM">
      <div className="absolute left-0 top-[10px] transform -translate-y-1/2 -ml-[6px] border-black  border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-black"></div>
      {info}
    </div>
  </div>
);

const PieChart: FC<InsightChartProps> = ({
  title,
  value,
  selectOptions,
  selectOptionsBottom,
  chartData,
  info,
  valuePlaceHolder,
  setFilters,
}) => {
  const defaultChartData: ChartData<"pie", number[], string> = chartData || {
    labels: ["Radio", "Cable", "TV", "DJ"],
    datasets: [
      {
        label: "AIRPLAY",
        data: [300, 50, 100, 22],
        backgroundColor: ["#f8e0e1", "#d7ecfb", "#f8f5d8", "#d4f2ed"],
        borderColor: ["#e0a1a2", "#a1c4e8", "#e0d8a1", "#a1e0d8"],
        borderWidth: 3,
      },
    ],
  };

  console.log(defaultChartData);

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
                onChange={(value: any) => {
                  setFilters((prevFilters: any) => ({
                    ...prevFilters,
                    channels: value,
                  }));
                }}
              />
            </div>
          ))}
          <div>
            {!selectOptions && (
              <div className="h-[40px] max-w-[180px] w-full"></div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <p className="text-2xl lg:text-[56px] font-[600] font-IBM">
          {!!value && formatNumber(value)}
        </p>
        {Number(value) > 1000 && (
          <TooltipComponent info={value.toLocaleString()} />
        )}
      </div>
      <div>
        <p className="!text-[12px] font-[400] tracking-[.1rem] text-[#000000] font-IBM">
          {valuePlaceHolder}
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

export default PieChart;
