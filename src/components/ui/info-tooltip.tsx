"use client";

import { FiInfo } from "react-icons/fi";

function InfoTooltip({ info }: { info: string }) {
  return (
    <div className="relative group">
      <FiInfo className="text-gray-400 hover:text-blue-500 cursor-pointer" />
      <div className="absolute left-[25px] top-0 z-10 ml-1 hidden w-60 rounded-[4px] bg-black p-[12px] font-SansFlex text-xs font-[400] text-white shadow-lg group-hover:block">
        <div className="absolute left-0 top-[10px] -ml-[6px] -translate-y-1/2 border-b-8 border-r-8 border-t-8 border-b-transparent border-r-black border-t-transparent" />
        {info}
      </div>
    </div>
  );
}

export { InfoTooltip };
