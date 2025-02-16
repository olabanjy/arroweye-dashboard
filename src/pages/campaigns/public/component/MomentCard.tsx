import Image from "next/image";
import React, { useState, useEffect } from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MomentCardProps {
  videoUrls: string[];
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
  videoUrls = [],
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
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Validate video URLs on component mount and when URLs change
  useEffect(() => {
    validateVideoUrls();
  }, [videoUrls]);

  const validateVideoUrls = () => {
    if (!videoUrls || videoUrls.length === 0) {
      setError("No Media Added Yet");
      return false;
    }

    setError(null);
    return true;
  };

  const handlePlayClick = () => {
    if (validateVideoUrls()) {
      setIsPlaying(true);
    }
  };

  const handlePrevVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (validateVideoUrls()) {
      setCurrentVideoIndex((prev) =>
        prev === 0 ? videoUrls.length - 1 : prev - 1
      );
      setIsPlaying(false);
    }
  };

  const handleNextVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (validateVideoUrls()) {
      setCurrentVideoIndex((prev) =>
        prev === videoUrls.length - 1 ? 0 : prev + 1
      );
      setIsPlaying(false);
    }
  };

  return (
    <div className="w-full max-h-[600px] space-y-[20px]">
      <p className="!text-[12px] font-[400] tracking-[.1rem] text-[#000000] font-IBM uppercase">
        {MomentsTitle}
      </p>

      <div className="relative h-[300px] rounded overflow-hidden group">
        {error ? (
          <Alert
            variant="destructive"
            className="h-full flex items-center justify-center"
          >
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <>
            <iframe
              className="w-full h-full"
              src={`${videoUrls[currentVideoIndex]}?autoplay=${isPlaying ? "1" : "0"}&controls=1&showinfo=0&rel=0`}
              title={`${videoTitle} - Video ${currentVideoIndex + 1}`}
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>

            {/* Navigation Buttons */}
            {videoUrls.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handlePrevVideo}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleNextVideo}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {!isPlaying && (
              <button
                className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/40 transition-colors"
                onClick={handlePlayClick}
              >
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                  <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[24px] border-l-black border-b-[12px] border-b-transparent ml-1" />
                </div>
              </button>
            )}
          </>
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
          <p className="p-2 cursor-pointer text-[16px] font-[500] font-IBM w-full rounded text-center hover:bg-orange-500 bg-black text-white">
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
