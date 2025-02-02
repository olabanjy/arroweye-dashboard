import Image from "next/image";
import React, { useState } from "react";
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
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  return (
    <div className="w-full max-h-[600px] space-y-[20px]">
      <p className="!text-[12px] font-[400] tracking-[.1rem] text-[#000000] font-IBM uppercase">
        {MomentsTitle}
      </p>

      <div className="relative h-[300px] rounded overflow-hidden">
        <iframe
          className="w-full h-full"
          src={isPlaying ? videoUrl : `${videoUrl}?autoplay=0`}
          title={videoTitle}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
        {!isPlaying && (
          <button
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-4xl"
            onClick={handlePlayClick}
          >
            <Image
              src={
                "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjIuMywgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA3MDAgNzAwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA3MDAgNzAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0zNTQuMywxMi43Yy04OS4zLDAtMTc0LjksMzUuNS0yMzgsOTguNmMtNjMuMSw2My4xLTk4LjYsMTQ4LjctOTguNiwyMzhzMzUuNSwxNzQuOSw5OC42LDIzOAoJYzYzLjEsNjMuMSwxNDguNyw5OC42LDIzOCw5OC42czE3NC45LTM1LjUsMjM4LTk4LjZjNjMuMS02My4xLDk4LjYtMTQ4LjcsOTguNi0yMzhjMC01OS4xLTE1LjYtMTE3LjEtNDUuMS0xNjguMwoJYy0yOS41LTUxLjItNzItOTMuNi0xMjMuMi0xMjMuMlM0MTMuMywxMi43LDM1NC4zLDEyLjdMMzU0LjMsMTIuN3ogTTQ4MS4xLDM4MS42TDMyMy42LDQ4NS43Yy04LjUsNS43LTE4LjgsOC0yOC45LDYuNwoJYy0xMC4xLTEuNC0xOS40LTYuNC0yNi4yLTE0LjFjLTYuNy03LjctMTAuNC0xNy42LTEwLjQtMjcuOFYyNDhjMC0xMC4yLDMuNy0yMC4xLDEwLjQtMjcuOGM2LjctNy43LDE2LTEyLjcsMjYuMi0xNC4xCgljMTAuMS0xLjQsMjAuNCwxLDI4LjksNi43bDE1Ny42LDEwNC4xYzEwLjgsNy4yLDE3LjMsMTkuNCwxNy4zLDMyLjRDNDk4LjQsMzYyLjMsNDkxLjksMzc0LjQsNDgxLjEsMzgxLjZMNDgxLjEsMzgxLjZ6Ii8+Cjwvc3ZnPgo="
              }
              alt="Icon"
              style={{ display: isPlaying ? "none" : "block" }}
              width={50}
              height={50}
            />
          </button>
        )}
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
