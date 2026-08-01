import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const hasData = (images?.length ?? 0) > 0;

  useEffect(() => {
    if (!carouselApi || images.length <= 1) return;

    const interval = window.setInterval(() => {
      carouselApi.scrollNext();
    }, 3000);

    return () => window.clearInterval(interval);
  }, [carouselApi, images.length]);

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
        <Skeleton className="h-[400px] w-full rounded bg-gray-200" />
      ) : hasData ? (
        <Carousel
          opts={{ loop: true }}
          setApi={setCarouselApi}
          className="group h-[400px] w-full overflow-hidden rounded [&_[data-slot=carousel-content]]:h-full [&_[data-slot=carousel-content]>div]:h-full"
        >
          <CarouselContent className="h-full">
            {images.map((image, index) => (
              <CarouselItem key={`${image}-${index}`} className="h-full">
                {links?.[index] ? (
                  <Link
                    href={links[index]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full overflow-hidden rounded"
                  >
                    <img
                      src={image}
                      alt={`Slide ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </Link>
                ) : (
                  <div className="h-full overflow-hidden rounded">
                    <img
                      src={image}
                      alt={`Slide ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 1 && (
            <>
              <CarouselPrevious
                variant="ghost"
                className="left-2 size-10 border-0 bg-black/50 text-white opacity-0 hover:bg-black/50 hover:text-white group-hover:opacity-100"
              />
              <CarouselNext
                variant="ghost"
                className="right-2 size-10 border-0 bg-black/50 text-white opacity-0 hover:bg-black/50 hover:text-white group-hover:opacity-100"
              />
            </>
          )}
        </Carousel>
      ) : null}

      <div className="space-y-[5px] flex flex-col items-center justify-center">
        {hasData && (
          <div className="flex items-center gap-2 w-full">
            {watchButtonText && (
              <Button
                type="button"
                className="h-auto flex-grow rounded bg-black p-2 text-base font-medium text-white hover:bg-orange-500"
              >
                {watchButtonText}
              </Button>
            )}

            {downloadIcon && watchButtonText && (
              <Button
                type="button"
                size="icon"
                className="h-auto rounded bg-black p-[11px] text-white hover:bg-orange-500"
                aria-label="Download"
              >
                <Download />
              </Button>
            )}
          </div>
        )}

        {hasData && assetsButton && (
          <Button
            type="button"
            className="h-auto w-full rounded-full bg-black p-2 text-base font-medium text-white hover:bg-orange-500"
            onClick={() => downloadAllDspFiles(images)}
          >
            {assetsButton}
          </Button>
        )}

        <Button
          type="button"
          className="h-auto w-full rounded-full bg-black p-2 text-base font-medium text-white hover:bg-orange-500"
          onClick={() => downloadCSV(csvData)}
        >
          {downloadButtonText}
          <sup className="mt-1 rounded-full bg-white p-2 font-bold text-black">
            CSV
          </sup>
        </Button>

        {radioButtonText && (
          <Button
            type="button"
            variant={outline ? "outline" : "default"}
            className={
              outline
                ? "h-auto w-full rounded-full border-black p-2 text-base font-medium text-black hover:bg-black hover:text-white"
                : "h-auto w-full rounded-full bg-black p-2 text-base font-medium text-white hover:bg-orange-500"
            }
          >
            {radioButtonText}
          </Button>
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
