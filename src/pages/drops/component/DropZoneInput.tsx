import { Input } from "@/components/ui/input";
import { LucideLockKeyhole } from "lucide-react";
import React from "react";

interface DropZoneInputProps {
  onUnlock: () => void;
}

const DropZoneInput: React.FC<DropZoneInputProps> = ({ onUnlock }) => {
  return (
    <div className="flex items-end gap-[10px]">
      <Input
        label="Unlock Dropzone"
        type="password"
        placeholder="Enter password"
      />
      <button
        className="font-bold gap-[10px] px-4 py-2 text-white bg-[#e4055a] rounded-[8px] hover:bg-[#000000] flex items-center"
        onClick={onUnlock}
      >
        Unlock <LucideLockKeyhole size={14} />
      </button>
    </div>
  );
};

export default DropZoneInput;
