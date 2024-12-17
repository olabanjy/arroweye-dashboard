import React from "react";
import { MdOutlineFileDownload } from "react-icons/md";

interface MomentCardProps {
  videoUrl: string;
  videoTitle: string;
  watchButtonText?: string;
  downloadButtonText?: string;
  radioButtonText?: string;
  downloadIcon?: boolean;
}

const MomentCard: React.FC<MomentCardProps> = ({
  videoUrl,
  videoTitle,
  watchButtonText,
  downloadButtonText = "Download Data",
  radioButtonText,
  downloadIcon = true,
}) => {
  return (
    <div className="max-w-[300px] w-full p-[16px] h-[600px] rounded border">
      <p className="text-[#6f6f6f] text-[14px]">MOMENTS</p>
      <div className="mt-[20px]">
        <div className="h-[300px] rounded overflow-hidden">
          <iframe
            className="w-full h-full"
            src={videoUrl}
            title={videoTitle}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
        <div className="space-y-[20px] flex flex-col items-center justify-center">
          {watchButtonText && (
            <p className="p-[8px] w-full rounded bg-[#000] text-[#fff] text-center">
              {watchButtonText}
            </p>
          )}
          {downloadIcon && (
            <div className="bg-[#000] text-[#ffffff] p-[10px] rounded inline-flex">
              <MdOutlineFileDownload />
            </div>
          )}
          <p className="p-[8px] w-full rounded bg-[#000] text-[#fff] text-center">
            {downloadButtonText}
          </p>
          {radioButtonText && (
            <p className="p-[8px] w-full rounded bg-[#000] text-[#fff] text-center">
              {radioButtonText}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MomentCard;
