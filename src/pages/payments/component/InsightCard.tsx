import { SelectInput } from "@/components/ui/selectinput";
import React, { FC } from "react";
import { FiInfo } from "react-icons/fi";

interface InsightCardProps {
  title: string;
  value: number | string;
  percentageChange?: string;
  percentageColor?: string;
  selectOptions: Array<{ value: string; label: string }[]>;
  maxWidth?: string;
}

const InsightCard: FC<InsightCardProps> = ({
  title,
  value,
  percentageChange,
  percentageColor = "#11cc48",
  selectOptions,
  // maxWidth = "400px",
}) => {
  return (
    <div
      className={`border p-[20px] rounded-[8px] space-y-[20px] w-full hover:bg-green-500 hover:bg-opacity-5 hover:border hover:border-green-500`}
      // style={{ maxWidth }}
    >
      <div className="flex items-center gap-[5px] text-[#7a8081]">
        <p className="text-[14px] tracking-[.1rem]">{title}</p>
        <FiInfo className="text-gray-400 hover:text-blue-500" />
      </div>

      <p className="text-2xl lg:text-4xl font-bold">{value}</p>

      {percentageChange && (
        <p
          className="text-[14px] lg:text-[16px] font-bold"
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
