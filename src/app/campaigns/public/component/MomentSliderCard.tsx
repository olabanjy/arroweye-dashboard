import React, { useEffect, useState } from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import { HiMiniArrowLeft, HiMiniArrowRight } from "react-icons/hi2";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import Link from "next/link";

interface MomentSliderCardProps {
  images: string[];
  links?: string[];
  watchButtonText?: string;
  downloadButtonText?: string;
  radioButtonText?: string;
  downloadIcon?: boolean;
  outline?: boolean;
  subText?: string;
  MomentsTitle?: string;
  assetsButton?: string;
  additionalContent?: React.ReactNode;
  csvData?: Record<string, unknown>;
  loading?: boolean;
}

const MomentSliderCard: React.FC<MomentSliderCardProps> = ({
  images,
  links,
  watchButtonText,
  downloadButtonText = "Download Data",
  radioButtonText,
  downloadIcon = true,
  outline = false,
  subText,
  MomentsTitle,
  assetsButton,
  additionalContent,
  csvData,
  loading = false,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasData = (images?.length ?? 0) > 0;

  useEffect(() => {
    if (!hasData) {
      setCurrentImageIndex(0);
      return;
    }

    setCurrentImageIndex((index) => Math.min(index, images.length - 1));
  }, [hasData, images.length]);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = window.setInterval(() => {
      setCurrentImageIndex((index) => (index + 1) % images.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [images.length]);

  const showPreviousImage = () => {
    setCurrentImageIndex((index) =>
      index === 0 ? images.length - 1 : index - 1,
    );
  };

  const showNextImage = () => {
    setCurrentImageIndex((index) => (index + 1) % images.length);
  };

  const downloadAllDspFiles = async (fileUrls: string[]) => {
    if (!fileUrls.length) {
      toast.error("No files to download");
      return;
    }

    try {
      const zip = new JSZip();
      const downloadPromises = fileUrls.map(async (url, index) => {
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to fetch ${url}`);

          const blob = await response.blob();

          const filename = url.split("/").pop() || `dsp-cover-${index + 1}.png`;

          zip.file(filename, blob);

          return true;
        } catch (error) {
          console.error(`Error downloading ${url}:`, error);
          return false;
        }
      });

      // Wait for all downloads to complete
      await Promise.all(downloadPromises);

      // Generate the zip file
      const zipBlob = await zip.generateAsync({ type: "blob" });

      // Save the zip file
      saveAs(zipBlob, "dsp-covers.zip");
    } catch (error) {
      console.error("Error creating zip file:", error);
    }
  };

  const downloadCSV = (
    data: Record<string, unknown> | undefined,
    filename = "DSPData.csv",
  ) => {
    if (!data) {
      toast.error("No data to download");
      return;
    }

    const headers = Object.keys(data).join(",") + "\n";
    const values = Object.values(data).join(",") + "\n";

    const csvContent = headers + values;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-[20px]">
      <p className="!text-[12px] font-[400] tracking-[.1rem] text-[#000000] font-SansFlex uppercase">
        {MomentsTitle}
      </p>

      {loading ? (
        <div className="h-[400px] w-full rounded bg-gray-200 animate-pulse" />
      ) : hasData ? (
        <div className="relative w-full px-12 md:px-20">
          {images.length > 1 && (
            <button
              type="button"
              aria-label="Previous image"
              className="absolute left-0 top-1/2 z-10 flex size-14 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#7d837d] text-white transition-colors hover:bg-[#626862] md:size-[62px]"
              onClick={showPreviousImage}
            >
              <HiMiniArrowLeft className="text-[22px]" />
            </button>
          )}

          <div className="mx-auto h-[400px] w-full max-w-[640px] overflow-hidden rounded bg-gray-50 md:h-[640px]">
            <div
              className="flex h-full transition-transform duration-500 ease-in-out will-change-transform"
              style={{
                transform: `translate3d(-${currentImageIndex * 100}%, 0, 0)`,
              }}
            >
              {images.map((image, index) =>
                links?.[index] ? (
                  <Link
                    href={links[index]}
                    key={`${image}-${index}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full w-full shrink-0"
                  >
                    <img
                      src={image}
                      alt={`Slide ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </Link>
                ) : (
                  <div
                    key={`${image}-${index}`}
                    className="h-full w-full shrink-0"
                  >
                    <img
                      src={image}
                      alt={`Slide ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ),
              )}
            </div>
          </div>

          {images.length > 1 && (
            <button
              type="button"
              aria-label="Next image"
              className="absolute right-0 top-1/2 z-10 flex size-14 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#7d837d] text-white transition-colors hover:bg-[#626862] md:size-[62px]"
              onClick={showNextImage}
            >
              <HiMiniArrowRight className="text-[22px]" />
            </button>
          )}
        </div>
      ) : null}

      <div className="space-y-[5px] flex flex-col items-center justify-center">
        {hasData && (
          <div className="flex items-center gap-2 w-full">
            {watchButtonText && (
              <p className="p-2 cursor-pointer hover:bg-orange-500 font-SansFlex text-[16px] font-[500] flex-grow rounded bg-black text-white text-center">
                {watchButtonText}
              </p>
            )}

            {downloadIcon && watchButtonText && (
              <div className="bg-black hover:bg-orange-500 font-SansFlex text-[16px] font-medium text-white p-[11px] rounded inline-flex">
                <MdOutlineFileDownload className="text-[16px]" />
              </div>
            )}
          </div>
        )}

        {hasData && assetsButton && (
          <button
            className="w-full p-2 cursor-pointer hover:bg-orange-500 font-SansFlex text-[16px] font-[500] flex-grow rounded-full bg-black text-white text-center"
            onClick={() => downloadAllDspFiles(images)}
          >
            {assetsButton}
          </button>
        )}

        <div
          className="p-2 font-SansFlex text-[16px] font-[500] w-full rounded-full text-white text-center cursor-pointer hover:bg-orange-500 bg-black inline-flex items-center gap-2 justify-center"
          onClick={() => downloadCSV(csvData)}
        >
          <p>{downloadButtonText}</p>
          <sup className="font-bold p-2 rounded-full bg-white text-black mt-1">
            CSV
          </sup>
        </div>

        {radioButtonText && (
          <p
            className={`p-2 cursor-pointer text-[16px] font-[500] font-SansFlex w-full rounded-full text-center ${
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
        {additionalContent && (
          <div className="p-2 font-SansFlex text-[16px] text-center text-gray-700">
            {additionalContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default MomentSliderCard;
