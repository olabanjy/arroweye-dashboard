// import React, { FC, useState } from 'react';
// import { FiInfo } from 'react-icons/fi';
// import { SelectInput } from '@/components/ui/selectinput';
// import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
// import { ChartData } from 'chart.js';

// interface InsightChartProps {
//   title: string;
//   value: number | string;
//   percentageChange?: string;
//   selectOptions?: Array<{ value: string; label: string }[]>;
//   selectOptionsBottom?: Array<{ value: string; label: string }[]>;
//   chartData?: ChartData<'doughnut', number[], string>;
//   valuePlaceholder?: string;
//   info?: string;
//   placeholder?: string;
// }

// interface ChartDataItem {
//   name: string;
//   value: number;
//   color: string;
//   strokeColor: string;
//   isHidden?: boolean;
// }

// interface LegendProps {
//   payload?: Array<{
//     value: string;
//     id: string;
//     color: string;
//     payload: {
//       name: string;
//       value: number;
//       color: string;
//       strokeColor: string;
//       isHidden: boolean;
//     };
//   }>;
//   toggleSegment: (name: string) => void;
// }

// const InfoTooltip: FC<{ info: string }> = ({ info }) => (
//   <div className="relative group">
//     <FiInfo className="text-gray-400 hover:text-blue-500 cursor-pointer" />
//     <div className="absolute left-full top-0 transform ml-1 hidden w-60 p-2 text-xs font-[400] text-white bg-black rounded-[4px] group-hover:block z-10 shadow-lg font-IBM">
//       <div className="absolute left-0 top-[10px] transform -translate-y-1/2 -ml-[6px] border-black border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-black"></div>
//       {info}
//     </div>
//   </div>
// );

// const CustomLegend: FC<LegendProps> = ({ payload, toggleSegment }) => {
//   if (!payload) return null;

//   return (
//     <div className="flex justify-center gap-4 mb-4 flex-wrap">
//       {payload.map((entry) => (
//         <span
//           key={entry.value}
//           className="flex items-center cursor-pointer"
//           onClick={() => toggleSegment(entry.payload.name)}
//         >
//           <span
//             className="inline-block w-8 h-2.5 mr-2"
//             style={{
//               backgroundColor: entry.payload.isHidden
//                 ? '#e5e7eb'
//                 : entry.payload.color,
//               border: `1px solid ${entry.payload.isHidden ? '#d1d5db' : entry.payload.strokeColor}`,
//               opacity: entry.payload.isHidden ? 0.5 : 1,
//             }}
//           />
//           <span
//             className={`text-xs text-gray-600 ${
//               entry.payload.isHidden ? 'line-through opacity-50' : ''
//             }`}
//           >
//             {entry.value}
//           </span>
//         </span>
//       ))}
//     </div>
//   );
// };

// const DoughnutChart: FC<InsightChartProps> = ({
//   title,
//   value,
//   selectOptions,
//   selectOptionsBottom,
//   chartData,
//   placeholder,
//   valuePlaceholder,
//   info,
// }) => {
//   const [hiddenSegments, setHiddenSegments] = useState<Set<string>>(new Set());

//   const formatDataForRecharts = (): ChartDataItem[] => {
//     if (!chartData?.labels || !chartData.datasets[0].data) return [];

//     const colors = ['#f8e0e1', '#d7ecfb', '#f8f5d8', '#d4f2ed'];
//     const strokeColors = ['#e0a1a2', '#a1c4e8', '#e0d8a1', '#a1e0d8'];

//     return chartData.labels.map((label, index) => ({
//       name: label,
//       value: chartData.datasets[0].data[index],
//       color: colors[index],
//       strokeColor: strokeColors[index],
//       isHidden: hiddenSegments.has(label),
//     }));
//   };

//   const toggleSegment = (name: string) => {
//     setHiddenSegments((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(name)) {
//         newSet.delete(name);
//       } else {
//         newSet.add(name);
//       }
//       return newSet;
//     });
//   };

//   const allData = formatDataForRecharts();
//   const visibleData = allData.filter((item) => !item.isHidden);

//   const weeksOptions = [
//     { value: 'week1', label: 'Week 1' },
//     { value: 'week2', label: 'Week 2' },
//     { value: 'week3', label: 'Week 3' },
//     { value: 'week4', label: 'Week 4' },
//   ];

//   const months = [
//     { value: 'jan', label: 'January' },
//     { value: 'feb', label: 'February' },
//     { value: 'mar', label: 'March' },
//     { value: 'apr', label: 'April' },
//     { value: 'may', label: 'May' },
//     { value: 'jun', label: 'June' },
//     { value: 'jul', label: 'July' },
//     { value: 'aug', label: 'August' },
//     { value: 'sep', label: 'September' },
//     { value: 'oct', label: 'October' },
//     { value: 'nov', label: 'November' },
//     { value: 'dec', label: 'December' },
//   ];

//   return (
//     <div className="space-y-5 font-IBM w-full">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-[5px] text-[#7a8081]">
//           <p className="!text-[12px] font-[400] tracking-[.1rem]">{title}</p>
//           <div>{info && <InfoTooltip info={info} />}</div>
//         </div>
//         <div>
//           {selectOptions?.map((options, index) => (
//             <div key={index} className="max-w-[180px] w-full">
//               <SelectInput
//                 rounded={true}
//                 options={options}
//                 placeholder={placeholder}
//               />
//             </div>
//           ))}
//           <div>
//             {!selectOptions && (
//               <div className="h-10 max-w-[180px] w-full"></div>
//             )}
//           </div>
//         </div>
//       </div>

//       <p className="text-2xl lg:text-[56px] font-[600] font-IBM">{value}</p>
//       <div>
//         <p className="!text-[12px] font-[400] tracking-[.1rem] text-black">
//           {valuePlaceholder}
//         </p>

//         <div className="w-full h-full flex justify-center items-center">
//           <div className="w-[313px] h-[313px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Legend
//                   content={
//                     <CustomLegend
//                       payload={allData.map((item) => ({
//                         value: item.name,
//                         id: item.name,
//                         color: item.color,
//                         payload: item,
//                       }))}
//                       toggleSegment={toggleSegment}
//                     />
//                   }
//                   verticalAlign="top"
//                   align="center"
//                 />
//                 <Pie
//                   data={visibleData}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={80}
//                   outerRadius={130}
//                   paddingAngle={0}
//                   dataKey="value"
//                 >
//                   {visibleData.map((entry, index) => (
//                     <Cell
//                       key={`cell-${index}`}
//                       fill={entry.color}
//                       stroke={entry.strokeColor}
//                       strokeWidth={1}
//                     />
//                   ))}
//                 </Pie>
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       <div className="flex items-center justify-between">
//         <div>
//           {selectOptionsBottom?.map((options, index) => (
//             <div key={index} className="max-w-[200px] w-full">
//               <SelectInput
//                 rounded={true}
//                 options={weeksOptions}
//                 placeholder="Weeks"
//               />
//             </div>
//           ))}
//         </div>
//         <div>
//           {selectOptionsBottom?.map((options, index) => (
//             <div key={index} className="max-w-[110px] w-full">
//               <SelectInput
//                 rounded={true}
//                 options={months}
//                 placeholder="Lifetime"
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DoughnutChart;

import React, { FC } from "react";
import { FiInfo } from "react-icons/fi";
import { SelectInput } from "@/components/ui/selectinput";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  ChartData,
} from "chart.js";

ChartJS.register(ArcElement, ChartTooltip, Legend);

interface InsightChartProps {
  title: string;
  value: number | string;
  percentageChange?: string;
  selectOptions?: Array<{ value: string; label: string }[]>;
  selectOptionsBottom?: Array<{ value: string; label: string }[]>;
  chartData?: ChartData<"doughnut", number[], string>;
  // maxWidth?: string;
  valuePlaceholder?: string;
  info?: string;
  placeholder?: string;
  setFilters?: any;
}

const Tooltip = ({ info }: { info: string }) => (
  <div className="relative group">
    <FiInfo className="text-gray-400 hover:text-blue-500 cursor-pointer" />
    <div className="absolute left-full top-0 transform  ml-1 hidden w-60 p-2 text-xs font-[400] text-white bg-black rounded-[4px] group-hover:block z-10 shadow-lg font-IBM">
      <div className="absolute left-0 top-[10px] transform -translate-y-1/2 -ml-[6px] border-black  border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-black"></div>
      {info}
    </div>
  </div>
);

const DoughnutChart: FC<InsightChartProps> = ({
  title,
  value,
  selectOptions,
  selectOptionsBottom,
  chartData,
  placeholder,
  valuePlaceholder,
  // maxWidth = "400px",
  info,
  setFilters,
}) => {
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
    <div
      className={`space-y-[20px] font-IBM w-full`}
      // style={{ maxWidth, width: "100%" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[5px] text-[#7a8081]">
          <p className="!text-[12px] font-[400] tracking-[.1rem]">{title}</p>
          <div className="">{info && <Tooltip info={info} />}</div>
        </div>
        <div className=" ">
          {selectOptions?.map((options, index) => (
            <div key={index} className="max-w-[180px] w-full">
              <SelectInput
                rounded={true}
                options={options}
                placeholder={placeholder}
                onChange={(value: any) => {
                  setFilters((prevFilters: any) => ({
                    ...prevFilters,
                    country: value,
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

      <p className="text-2xl lg:text-[56px] font-[600] font-IBM">{value}</p>
      <div className="">
        <p className="!text-[12px] font-[400] tracking-[.1rem] text-[#000000]">
          {valuePlaceholder}
        </p>

        {chartData && (
          <div className="w-full h-[300px] font-IBM">
            <Doughnut
              data={chartData}
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
                    callbacks: {
                      label: function (context) {
                        const label = context.label || "";
                        const value = context.raw || 0;
                        return `${label}: ${value}`;
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
        <div className="">
          {selectOptionsBottom?.map((options, index) => (
            <div key={index} className="min-w-[80px] max-w-[200px] w-full">
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
        <div className="">
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

export default DoughnutChart;
