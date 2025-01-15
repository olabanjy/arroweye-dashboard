import React, { useRef } from "react";
import Slider from "react-slick";
import { MdOutlineFileDownload } from "react-icons/md";
import Image from "next/image";
import { HiMiniArrowLeft, HiMiniArrowRight } from "react-icons/hi2";

interface MomentSliderCardProps {
  images: string[];
  watchButtonText?: string;
  downloadButtonText?: string;
  radioButtonText?: string;
  downloadIcon?: boolean;
  outline?: boolean;
  subText?: string;
  MomentsTitle?: string;
  assetsButton?: string;
  additionalContent?: React.ReactNode;
}

const MomentSliderCard: React.FC<MomentSliderCardProps> = ({
  images,
  watchButtonText,
  downloadButtonText = "Download Data",
  radioButtonText,
  downloadIcon = true,
  outline = false,
  subText,
  MomentsTitle,
  assetsButton,
  additionalContent,
}) => {
  const sliderRef = useRef<Slider | null>(null);

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

  return (
    <div className="w-full max-h-[600px] space-y-[20px]">
      <p className="!text-[12px] font-[400] tracking-[.1rem] text-[#000000] font-IBM uppercase">
        {MomentsTitle}
      </p>

      <div className="relative ">
        <Slider ref={sliderRef} {...sliderSettings}>
          {images?.map((image, index) => (
            <div key={index} className="relative w-full h-[300px] ">
              <Image
                src={image}
                alt={`Slide ${index + 1}`}
                className="object-cover w-full h-full rounded"
                width={500}
                height={300}
              />
              <div
                className="absolute left-1 top-1/2 transform -translate-y-1/2 cursor-pointer z-10 bg-opacity-50 bg-black rounded-full p-3"
                onClick={() => sliderRef.current?.slickPrev()}
              >
                <HiMiniArrowLeft className="text-white text-[14px]" />
              </div>
              <div
                className="absolute right-1 top-1/2 transform -translate-y-1/2 cursor-pointer z-10 bg-opacity-50 bg-black rounded-full p-3"
                onClick={() => sliderRef.current?.slickNext()}
              >
                <HiMiniArrowRight className="text-white text-[14px]" />
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <div className="space-y-[5px] flex flex-col items-center justify-center">
        <div className="flex items-center gap-2 w-full">
          {watchButtonText && (
            <p className="p-2 cursor-pointer hover:bg-orange-500 font-IBM text-[14px] font-[500] flex-grow rounded bg-black text-white text-center">
              {watchButtonText}
            </p>
          )}

          {downloadIcon && watchButtonText && (
            <div className="bg-black hover:bg-orange-500 font-IBM text-[14px] font-medium text-white p-[11px] rounded inline-flex">
              <MdOutlineFileDownload className="text-[14px]" />
            </div>
          )}
        </div>

        {assetsButton && (
          <p className="p-2 cursor-pointer text-[14px] font-[500] font-IBM w-full rounded text-center hover:bg-orange-500 bg-black text-white">
            {assetsButton}
          </p>
        )}

        <div className="p-2 font-IBM text-[14px] font-[500] w-full rounded text-white text-center cursor-pointer hover:bg-orange-500 bg-black inline-flex items-center gap-2 justify-center">
          <p>{downloadButtonText}</p>
          <sup className="font-bold p-2 rounded-full bg-white text-black mt-1">
            CSV
          </sup>
        </div>

        {radioButtonText && (
          <p
            className={`p-2 cursor-pointer text-[14px] font-[500] font-IBM w-full rounded text-center ${
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
          <div className="p-2 font-IBM text-[14px] text-center text-gray-700">
            {additionalContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default MomentSliderCard;
