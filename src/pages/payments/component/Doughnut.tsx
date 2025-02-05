import React, { FC } from 'react';
import { FiInfo } from 'react-icons/fi';
import { SelectInput } from '@/components/ui/selectinput';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import { ChartData } from 'chart.js';

interface InsightChartProps {
  title: string;
  value: number | string;
  percentageChange?: string;
  selectOptions?: Array<{ value: string; label: string }[]>;
  selectOptionsBottom?: Array<{ value: string; label: string }[]>;
  chartData?: ChartData<'doughnut', number[], string>;
  valuePlaceholder?: string;
  info?: string;
  placeholder?: string;
}

interface LegendPayload {
  value: string;
  color: string;
  payload: {
    name: string;
    value: number;
    color: string;
    strokeColor: string;
  };
}

const COLORS = {
  TikTok: { fill: '#E6E6FA', stroke: '#9370DB' },
  Twitter: { fill: '#FFE4C4', stroke: '#DEB887' },
  Instagram: { fill: '#FFB6C1', stroke: '#DB7093' },
  Facebook: { fill: '#ADD8E6', stroke: '#4682B4' },
  YouTube: { fill: '#E0FFFF', stroke: '#48D1CC' },
} as const;

const DEFAULT_COLORS = [
  { fill: '#E6E6FA', stroke: '#9370DB' },
  { fill: '#FFE4C4', stroke: '#DEB887' },
  { fill: '#FFB6C1', stroke: '#DB7093' },
  { fill: '#ADD8E6', stroke: '#4682B4' },
  { fill: '#E0FFFF', stroke: '#48D1CC' },
] as const;

const Tooltip = ({ info }: { info: string }) => (
  <div className="relative group">
    <FiInfo className="text-gray-400 hover:text-blue-500 cursor-pointer" />
    <div className="absolute left-full top-0 transform ml-1 hidden w-60 p-2 text-xs font-[400] text-white bg-black rounded-[4px] group-hover:block z-10 shadow-lg font-IBM">
      <div className="absolute left-0 top-[10px] transform -translate-y-1/2 -ml-[6px] border-black border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-black"></div>
      {info}
    </div>
  </div>
);

interface CustomLegendProps {
  payload?: LegendPayload[];
}

const CustomLegend: FC<CustomLegendProps> = ({ payload }) => {
  if (!payload) return null;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '20px',
      }}
    >
      {payload.map((entry, index) => (
        <span key={`item-${index}`} style={{ color: 'black', fontSize: 12 }}>
          <span
            style={{
              display: 'inline-block',
              width: 30,
              height: 10,
              backgroundColor: entry.color,
              marginRight: 5,
              border: `1px solid ${entry.payload.strokeColor}`,
            }}
          ></span>
          {entry.value}
        </span>
      ))}
    </div>
  );
};

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
  strokeColor: string;
}

const DoughnutChart: FC<InsightChartProps> = ({
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
        color: knownColor?.fill || defaultColor.fill,
        strokeColor: knownColor?.stroke || defaultColor.stroke,
      };
    });
  };

  const data = formatDataForRecharts();

  const weeksOptions = [
    { value: 'week1', label: 'Week 1' },
    { value: 'week2', label: 'Week 2' },
    { value: 'week3', label: 'Week 3' },
    { value: 'week4', label: 'Week 4' },
  ] 

  const months = [
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
  ]

  return (
    <div className="space-y-5 font-IBM w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[5px] text-[#7a8081]">
          <p className="!text-[12px] font-[400] tracking-[.1rem]">{title}</p>
          <div>{info && <Tooltip info={info} />}</div>
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

        <div className="flex justify-center">
          <PieChart width={400} height={400}>
            <Legend
              content={<CustomLegend />}
              verticalAlign="top"
              align="center"
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={150}
              paddingAngle={0}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke={entry.strokeColor}
                  strokeWidth={1}
                />
              ))}
            </Pie>
          </PieChart>
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

export default DoughnutChart;
