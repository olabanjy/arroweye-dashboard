import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { MdOutlineFileDownload } from "react-icons/md";
import Image from "next/image";
import { HiMiniArrowLeft, HiMiniArrowRight } from "react-icons/hi2";
import { FaRegCirclePlay } from "react-icons/fa6";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  csvData?: any;
}

const MomentSliderCard: React.FC<MomentSliderCardProps> = ({
  images,
  // links,
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
}) => {
  const sliderRef = useRef<Slider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
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

  useEffect(() => {
    validateVideoUrls();
  }, [images]);

  const validateVideoUrls = () => {
    if (!images || images.length === 0) {
      setError("No Media Added Yet");
      return false;
    }

    setError(null);
    return true;
  };

  const downloadCSV = (data: any, filename = "DSPData.csv") => {
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
    <div className="w-full max-h-[600px] space-y-[20px]">
      <p className="!text-[12px] font-[400] tracking-[.1rem] text-[#000000] font-IBM uppercase">
        {MomentsTitle}
      </p>

      <div className="relative">
        {error ? (
          <Alert
            variant="destructive"
            className="h-[300px] flex items-center justify-center"
          >
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <>
            {" "}
            <div
              className="absolute left-[15px] top-1/2 transform -translate-y-1/2 cursor-pointer z-10 bg-opacity-50 bg-black rounded-full p-3"
              onClick={() => sliderRef.current?.slickPrev()}
            >
              <HiMiniArrowLeft className="text-white text-[14px]" />
            </div>{" "}
            <Slider ref={sliderRef} {...sliderSettings}>
              {images?.map((image, index) => (
                <div key={index} className="relative w-full h-[400px]">
                  <img
                    src={image}
                    alt={`Slide ${index + 1}`}
                    className="object-contain w-full h-full rounded"
                    width={500}
                    height={400}
                  />
                  <a
                    // href={
                    //   links[index].startsWith("http")
                    //     ? links[index]
                    //     : `https://${links[index]}`
                    // }
                    href=""
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#ffffff] text-[#000000] text-[12px] font-[400] rounded-full px-3 py-1"
                  >
                    <div className="flex items-center justify-center gap-[5px]">
                      <FaRegCirclePlay />
                      Listen
                    </div>
                  </a>
                </div>
              ))}
            </Slider>{" "}
            <div
              className="absolute right-[15px] top-1/2 transform -translate-y-1/2 cursor-pointer z-10 bg-opacity-50 bg-black rounded-full p-3"
              onClick={() => sliderRef.current?.slickNext()}
            >
              <HiMiniArrowRight className="text-white text-[14px]" />
            </div>
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
          <button
            className="w-full p-2 cursor-pointer hover:bg-orange-500 font-IBM text-[16px] font-[500] flex-grow rounded-full bg-black text-white text-center"
            onClick={() => downloadAllDspFiles(images)}
          >
            {assetsButton}
          </button>
        )}

        <div
          className="p-2 font-IBM text-[16px] font-[500] w-full rounded-full text-white text-center cursor-pointer hover:bg-orange-500 bg-black inline-flex items-center gap-2 justify-center"
          onClick={() => downloadCSV(csvData)}
        >
          <p>{downloadButtonText}</p>
          <sup className="font-bold p-2 rounded-full bg-white text-black mt-1">
            CSV
          </sup>
        </div>

        {radioButtonText && (
          <p
            className={`p-2 cursor-pointer text-[16px] font-[500] font-IBM w-full rounded-full text-center ${
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
          <div className="p-2 font-IBM text-[16px] text-center text-gray-700">
            {additionalContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default MomentSliderCard;
