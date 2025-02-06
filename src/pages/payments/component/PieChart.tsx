import React, { FC } from 'react';
import { FiInfo } from 'react-icons/fi';
import { SelectInput } from '@/components/ui/selectinput';
import {
  PieChart as RechartsChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartData } from 'chart.js';

interface InsightChartProps {
  title: string;
  value: number | string;
  percentageChange?: string;
  selectOptions?: Array<{ value: string; label: string }[]>;
  selectOptionsBottom?: Array<{ value: string; label: string }[]>;
  chartData?: ChartData<'pie', number[], string>;
  valuePlaceHolder?: string;
  info?: string;
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
      }}
    >
      {payload.map((entry, index) => (
        <span
          key={`item-${index}`}
          className="flex items-center flex-wrap"
          style={{ color: 'black', fontSize: 12 }}
        >
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

const TooltipComponent = ({ info }: { info: string }) => (
  <div className="relative group">
    <FiInfo className="text-gray-400 hover:text-blue-500 cursor-pointer" />
    <div className="absolute left-full top-0 transform ml-1 hidden w-60 p-2 text-xs font-[400] text-white bg-black rounded-[4px] group-hover:block z-10 shadow-lg font-IBM">
      <div className="absolute left-0 top-[10px] transform -translate-y-1/2 -ml-[6px] border-black border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-black"></div>
      {info}
    </div>
  </div>
);

const COLORS = {
  TikTok: { fill: '#E6E6FA', stroke: '#9370DB' },
  Twitter: { fill: '#FFE4C4', stroke: '#DEB887' },
  Instagram: { fill: '#FFB6C1', stroke: '#DB7093' },
  Facebook: { fill: '#ADD8E6', stroke: '#4682B4' },
  YouTube: { fill: '#E0FFFF', stroke: '#48D1CC' },
};

const PieChart: FC<InsightChartProps> = ({
  title,
  value,
  selectOptions,
  selectOptionsBottom,
  chartData,
  info,
  valuePlaceHolder,
}) => {
  // Convert Chart.js data format to Recharts format
  const rechartsData =
    chartData?.labels?.map((label, index) => {
      const backgroundColor = Array.isArray(
        chartData.datasets[0].backgroundColor
      )
        ? chartData.datasets[0].backgroundColor[index]
        : undefined;
      const borderColor = Array.isArray(chartData.datasets[0].borderColor)
        ? chartData.datasets[0].borderColor[index]
        : undefined;

      return {
        name: label,
        value: chartData.datasets[0].data[index],
        fill: COLORS[label as keyof typeof COLORS]?.fill || backgroundColor,
        stroke: COLORS[label as keyof typeof COLORS]?.stroke || borderColor,
      };
    }) || [];

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: { name: string; value: number }[];
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-lg rounded">
          <p className="text-sm">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const renderColorfulLegendText = (value: string) => {
    return <span className="text-xs text-gray-600">{value}</span>;
  };

  return (
    <div className="space-y-5">
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
          <div>
            {!selectOptions && (
              <div className="h-10 max-w-[180px] w-full"></div>
            )}
          </div>
        </div>
      </div>

      <p className="text-2xl lg:text-[56px] font-[600] font-IBM">{value}</p>
      <div>
        <p className="!text-[12px] font-[400] tracking-[.1rem] text-black font-IBM">
          {valuePlaceHolder}
        </p>

        <div className="w-full h-full flex justify-center items-center">
          <div className="w-[313px] h-[313px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsChart>
                <Legend
                  content={<CustomLegend />}
                  verticalAlign="top"
                  align="center"
                  formatter={renderColorfulLegendText}
                />
                <Pie
                  data={rechartsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={130}
                  paddingAngle={0}
                  dataKey="value"
                  strokeWidth={2}
                >
                  {rechartsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.fill}
                      stroke={entry.stroke}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                {/* <Legend
                  content={<CustomLegend />}
                  layout="horizontal"
                  align="center"
                  verticalAlign="top"
                  iconType="square"
                  iconSize={15}
                  
                 
                /> */}
              </RechartsChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {selectOptionsBottom && (
          <>
            <div>
              {selectOptionsBottom.map((options, index) => (
                <div key={index} className="max-w-[110px] w-full">
                  <SelectInput
                    rounded={true}
                    options={options}
                    placeholder="Weeks"
                  />
                </div>
              ))}
            </div>
            <div>
              {selectOptionsBottom.map((options, index) => (
                <div key={index} className="max-w-[110px] w-full">
                  <SelectInput
                    rounded={true}
                    options={options}
                    placeholder="Lifetime"
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PieChart;
