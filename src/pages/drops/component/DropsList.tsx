import React, { useState } from "react";
import DropZoneInput from "./DropZoneInput";
import AssetsNotificationCard from "@/pages/dashboard/component/AssetsNotificationCard";
import DropForm from "./DropForm";

const DropsList = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleDownload = () => {
    console.log("Download triggered");
  };

  const handleShare = () => {
    console.log("Share triggered");
  };

  const handleUnlock = () => {
    setIsUnlocked(true);
  };

  return (
    <div className="mt-[50px] grid lg:grid-cols-2 items-start gap-[20px]">
      <div className="border border-[#f4f0f0] max-h-[800px] h-full">
        <div className="border-b border-[#f4f0f0]">
          <p className="border px-[16px] py-[8px] bg-[#f4faff] text-[16px] text-[#212529] font-[900]">
            Drops
          </p>
        </div>
        <div className="h-[600px] overflow-y-auto scrollbar-hide scrollbar-hide::-webkit-scrollbar">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="p-[20px]">
              <AssetsNotificationCard
                timeAgo="2 DAYS AGO"
                message="Relive the moments! Highlights for Run This Town by Alor G have been uploaded"
                onDownload={handleDownload}
                onShare={handleShare}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="max-h-[800px] h-full overflow-y-auto scrollbar-hide scrollbar-hide::-webkit-scrollbar border rounded-[8px] border-[#f4f0f0] p-[20px] hover:bg-green-500 hover:bg-opacity-5 hover:border hover:border-green-500">
        {isUnlocked === false ? (
          <DropZoneInput onUnlock={handleUnlock} />
        ) : (
          <DropForm />
        )}
      </div>
    </div>
  );
};

export default DropsList;
