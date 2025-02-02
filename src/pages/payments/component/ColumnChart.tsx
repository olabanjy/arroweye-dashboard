import React, { FC } from "react";
import { FiInfo } from "react-icons/fi";
import { SelectInput } from "@/components/ui/selectinput";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  CategoryScale,
  ChartData,
} from "chart.js";

ChartJS.register(
  BarElement,
  PointElement,
  LinearScale,
  Title,
  ChartTooltip,
  Legend,
  CategoryScale
);

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
}

const Tooltip = ({ info }: { info: string }) => (
  <div className="relative group">
    <FiInfo className="text-gray-400 hover:text-blue-500 cursor-pointer" />
    <div className="absolute left-[25px] top-0 transform  ml-1 hidden w-60 p-[12px] text-xs font-[400] text-white bg-black rounded-[4px] group-hover:block z-10 shadow-lg font-IBM">
      <div className="absolute left-0 top-[10px] transform -translate-y-1/2 -ml-[6px] border-black  border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-black"></div>
      {info}
    </div>
  </div>
);

const ColumnChart: FC<InsightChartProps> = ({
  title,
  value,
  selectOptions,
  selectOptionsBottom,
  chartData,
  placeholder,
  valuePlaceholder,
  info,
}) => {
  const defaultChartData: ChartData<"bar", number[], string> = chartData || {
    labels: ["January", "February", "March", "April"],
    datasets: [
      {
        label: "SOCIAL MEDIA",
        data: [65, 59, 80, 81],
        borderColor: "#42A5F5",
        backgroundColor: "rgba(66, 165, 245, 0.2)",
      },
    ],
  };

  const weeksOptions = [
    { value: "week1", label: "Week 1" },
    { value: "week2", label: "Week 2" },
    { value: "week3", label: "Week 3" },
    { value: "week4", label: "Week 4" },
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
    <div className={`space-y-[20px] font-IBM w-full`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[5px] text-[#7a8081]">
          <p className="!text-[12px] font-[400] tracking-[.1rem]">{title}</p>
          {info && <Tooltip info={info} />}
        </div>
        <div className=" ">
          {selectOptions?.map((options, index) => (
            <div key={index} className="max-w-[180px] w-full">
              <SelectInput
                rounded={true}
                options={options}
                placeholder={placeholder}
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

      <p className="text-2xl lg:text-[56px] font-[600] font-IBM">{value}</p>
      <div className="">
        <p className="!text-[12px] font-[400] tracking-[.1rem] text-[#000000]">
          {valuePlaceholder}
        </p>

        {defaultChartData && (
          <div className="w-full h-[300px] font-IBM">
            <Bar
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
                scales: {
                  x: {
                    type: "category",
                    labels: defaultChartData.labels,
                  },
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="">
          {selectOptionsBottom?.map((options, index) => (
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
          {selectOptionsBottom?.map((options, index) => (
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

export default ColumnChart;
