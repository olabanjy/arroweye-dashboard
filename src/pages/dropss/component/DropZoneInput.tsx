import { Input } from "@/components/ui/input";
import { LucideLockKeyhole } from "lucide-react";
import React from "react";

interface DropZoneInputProps {
  onUnlock: () => void;
}

const DropZoneInput: React.FC<DropZoneInputProps> = ({ onUnlock }) => {
  return (
    <div className="flex items-end gap-[10px] w-full">
      <div className=" flex-grow ">
        <Input
          label="Unlock Dropzone"
          type="text"
          placeholder="Enter 6-Digit PIN"
          className=" w-full "
          labelClassName=" text-[18px] font-[500] text-[#212529]"
        />
      </div>
      <button
        className="font-[600] text-[16px] gap-[10px] px-4 h-[50px] text-white bg-[#e4055a] rounded-[8px] hover:bg-[#000000] flex items-center"
        onClick={onUnlock}
      >
        Unlock <LucideLockKeyhole size={14} />
      </button>
    </div>
  );
};

export default DropZoneInput;
