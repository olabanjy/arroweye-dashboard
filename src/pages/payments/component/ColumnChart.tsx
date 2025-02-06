import React, { FC } from 'react';
import { FiInfo } from 'react-icons/fi';
import { SelectInput } from '@/components/ui/selectinput';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ChartData } from 'chart.js';

interface InsightChartProps {
  title: string;
  value: number | string;
  percentageChange?: string;
  selectOptions?: Array<{ value: string; label: string }[]>;
  selectOptionsBottom?: Array<{ value: string; label: string }[]>;
  chartData?: ChartData<'bar', number[], string>;
  valuePlaceholder?: string;
  info?: string;
  placeholder?: string;
}

const COLORS = {
  'Apple Music': { fill: '#FFE4E6', stroke: '#DB7093' },
  Youtube: { fill: '#E1F0FF', stroke: '#9370DB' },
  Spotify: { fill: '#FFF7E6', stroke: '#DEB887' },
  others: { fill: '#E6F4F1', stroke: '#48D1CC' },
};

const DEFAULT_COLORS = [
  { fill: '#FFE4E6', stroke: '#FFC7CB' },
  { fill: '#E1F0FF', stroke: '#B3D7FF' },
  { fill: '#FFF7E6', stroke: '#FFE4B3' },
  { fill: '#E6F4F1', stroke: '#B3E3D9' },
];

const Tooltip = ({ info }: { info: string }) => (
  <div className="relative group">
    <FiInfo className="text-gray-400 hover:text-blue-500 cursor-pointer" />
    <div className="absolute left-[25px] top-0 transform ml-1 hidden w-60 p-[12px] text-xs font-[400] text-white bg-black rounded-[4px] group-hover:block z-10 shadow-lg font-IBM">
      <div className="absolute left-0 top-[10px] transform -translate-y-1/2 -ml-[6px] border-black border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-black"></div>
      {info}
    </div>
  </div>
);

interface ChartDataItem {
  name: string;
  value: number;
  fill: string;
  stroke: string;
}

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
  const formatDataForRecharts = (): ChartDataItem[] => {
    if (!chartData?.labels || !chartData.datasets[0].data) return [];

    return chartData.labels.map((label, index) => {
      const knownColor = COLORS[label as keyof typeof COLORS];
      const defaultColor = DEFAULT_COLORS[index % DEFAULT_COLORS.length];

      return {
        name: label,
        value: chartData.datasets[0].data[index],
        fill: knownColor?.fill || defaultColor.fill,
        stroke: knownColor?.stroke || defaultColor.stroke,
      };
    });
  };

  const data = formatDataForRecharts();

  const weeksOptions: Array<{ value: string; label: string }> = [
    { value: 'week1', label: 'Week 1' },
    { value: 'week2', label: 'Week 2' },
    { value: 'week3', label: 'Week 3' },
    { value: 'week4', label: 'Week 4' },
  ];

  const months: Array<{ value: string; label: string }> = [
    { value: 'jan', label: 'January' },
    { value: 'feb', label: 'February' },
    { value: 'mar', label: 'March' },
    { value: 'apr', label: 'April' },
    { value: 'may', label: 'May' },
    { value: 'jun', label: 'June' },
    { value: 'jul', label: 'July' },
    { value: 'aug', label: 'August' },
    { value: 'sep', label: 'September' },
    { value: 'oct', label: 'October' },
    { value: 'nov', label: 'November' },
    { value: 'dec', label: 'December' },
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
          <div>
            {!selectOptions && (
              <div className="h-10 max-w-[180px] w-full"></div>
            )}
          </div>
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
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
                stroke="#E5E5E5"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
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
