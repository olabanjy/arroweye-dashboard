import { InputDrops } from "@/components/ui/inputdrops";
import { LucideLockKeyhole } from "lucide-react";
import React, { useState, useEffect } from "react";

interface DropZoneInputProps {
  onUnlock: () => void;
  pin: string;
  setIsUnlocked: (value: boolean) => void;
}

const DropZoneInput: React.FC<DropZoneInputProps> = ({
  onUnlock,
  pin,
  setIsUnlocked,
}) => {
  const [inputPin, setInputPin] = useState("");
  const [isValid, setIsValid] = useState(false);

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputPin(value);
    setIsValid(value === pin);
  };

  const handleUnlock = () => {
    if (isValid) {
      setIsUnlocked(true);
      onUnlock();
    }
  };

  return (
    <div className="flex items-end gap-[10px] w-full">
      <div className="flex-grow">
        <InputDrops
          label="Unlock Dropzone"
          type="text"
          value={inputPin}
          onChange={handlePinChange}
          placeholder="Enter 6-Digit PIN"
          className="w-full"
          labelClassName="text-[18px] font-[500] text-[#212529]"
        />
      </div>
      <button
        className={`font-[600] text-[16px] gap-[10px] px-4 h-[50px] text-white 
          ${isValid ? "bg-[#e4055a] hover:bg-[#000000]" : "bg-gray-400"} 
          rounded-full flex items-center`}
        onClick={handleUnlock}
        disabled={!isValid}
      >
        Unlock <LucideLockKeyhole size={14} />
      </button>
    </div>
  );
};

export default DropZoneInput;
