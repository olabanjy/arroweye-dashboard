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
}

const Tooltip = ({ info }: { info: string }) => (
  <div className="relative group">
    <FiInfo className="text-gray-400 hover:text-blue-500 cursor-pointer" />
    <div className="font-[500] absolute left-full top-1/2 transform -translate-y-1/2 ml-2 hidden w-[230px] p-2 text-xs text-white bg-black bg-opacity-90 rounded-lg group-hover:block z-10 shadow-lg">
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
}) => {
  return (
    <div
      className={`relative border px-[20px] py-[34px] rounded-[8px] space-y-[40px] w-full hover:bg-green-500 hover:bg-opacity-5 hover:border hover:border-green-500 ${extraClass}`}
      // style={{ height }}
    >
      <div className="flex items-center gap-[5px] text-[#7a8081]">
        <p className="text-[12px] font-[400] tracking-[.1rem]">{title}</p>
        {info && <Tooltip info={info} />}
      </div>

      <p className="text-2xl lg:text-[56px] font-[600]">{value}</p>

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
