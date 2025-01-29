import React from "react";
import { MdOutlineFileDownload } from "react-icons/md";

interface MomentCardProps {
  videoUrl: string;
  videoTitle: string;
  watchButtonText?: string;
  downloadButtonText?: string;
  radioButtonText?: string;
  downloadIcon?: boolean;
  outline?: boolean;
  subText?: string;
  MomentsTitle?: string;
  assetsButton?: string;
}

const MomentCard: React.FC<MomentCardProps> = ({
  videoUrl,
  videoTitle,
  watchButtonText,
  downloadButtonText = "Download Data",
  radioButtonText,
  downloadIcon = true,
  outline = false,
  subText,
  MomentsTitle,
  assetsButton,
}) => {
  return (
    <div className="w-full max-h-[600px] space-y-[20px]">
      <p className="!text-[12px] font-[400] tracking-[.1rem] text-[#000000] font-IBM uppercase">
        {MomentsTitle}
      </p>

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

      <div className="space-y-[5px] flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 w-full">
          {watchButtonText && (
            <p className="p-2 cursor-pointer hover:bg-orange-500 font-IBM text-[16px] font-[500] flex-grow rounded bg-black text-white text-center">
              {watchButtonText}
            </p>
          )}

          {downloadIcon && watchButtonText && (
            <div className="bg-black hover:bg-orange-500 font-IBM text-[16px] font-medium text-white p-[11px] rounded inline-flex">
              <MdOutlineFileDownload className="text-[16px]" />
            </div>
          )}
        </div>
        {assetsButton && (
          <p
            className={`p-2 cursor-pointer text-[16px] font-[500] font-IBM w-full rounded text-center hover:bg-orange-500 bg-black text-white`}
          >
            {assetsButton}
          </p>
        )}
        <div className="p-2 font-IBM text-[16px] font-[500] w-full rounded text-white text-center cursor-pointer hover:bg-orange-500 bg-black inline-flex items-center gap-2 justify-center">
          <p>{downloadButtonText}</p>
          <sup className="font-bold p-2 rounded-full bg-white text-black mt-1">
            CSV
          </sup>
        </div>

        {radioButtonText && (
          <p
            className={`p-2 mt-[20px] cursor-pointer text-[16px] font-[500] font-IBM w-full rounded text-center ${
              outline
                ? "border border-black text-black hover:bg-black hover:text-white"
                : "hover:bg-orange-500 bg-black text-white"
            }`}
          >
            {radioButtonText}
          </p>
        )}

        {subText && (
          <p className="text-[12px] font-[400] text-center">{subText}</p>
        )}
      </div>
    </div>
  );
};

export default MomentCard;
