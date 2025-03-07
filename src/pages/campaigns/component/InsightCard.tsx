import { SelectInput } from "@/components/ui/selectinput";
import React, { FC } from "react";
import { FiInfo } from "react-icons/fi";

interface InsightCardProps {
  title: string;
  value: number | string;
  percentageChange?: string;
  percentageColor?: string;
  selectOptions?: Array<{ value: string; label: string }[]>;
  maxWidth?: string;
  height?: string;
  info?: string;
  extraClass?: string;
  maxValue?: number | string;
  currency?: any;
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

const InsightCard: FC<InsightCardProps> = ({
  title,
  value,
  percentageChange,
  percentageColor = "#11cc48",
  selectOptions,
  info,
  // height = "220px",
  extraClass = "",
  maxValue,
  currency,
}) => {
  return (
    <div
      className={`relative h-max border px-[20px] pt-[34px] rounded-[8px] space-y-[20px] w-full hover:bg-green-500 hover:bg-opacity-5 hover:border hover:border-green-500 ${extraClass}`}
      // style={{ height }}
    >
      <div className="flex items-center gap-[5px] text-[#7a8081]">
        <p className="text-[12px] font-[400] tracking-[.1rem]">{title}</p>
        {info && <Tooltip info={info} />}
      </div>

      <div className="flex flex-row items-center h-[6rem] overflow-x-auto overflow-y-hidden">
        <p className="text-2xl lg:text-[56px] font-[600]">
          {currency}
          {value}
        </p>
        {maxValue && (
          <>
            <p className="mx-4">—</p>
            <p className="text-2xl lg:text-[56px] font-[600]">
              {currency}
              {maxValue}
            </p>
          </>
        )}
      </div>

      {percentageChange && (
        <p
          className="text-[14px] lg:text-[16px] font-[500]"
          style={{ color: percentageColor }}
        >
          {percentageChange}
        </p>
      )}

      <div className="grid md:flex items-center gap-[10px]">
        {selectOptions?.map((options, index) => (
          <div key={index} className="sm:max-w-[125px] w-full">
            <SelectInput options={options} rounded={true} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightCard;
