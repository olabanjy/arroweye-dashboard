import React from "react";
import MomentCard from "./MomentCard";
import MomentSliderCard from "./MomentSliderCard";

const Moments = () => {
  return (
    <div className=" grid md:grid-cols-3 gap-[20px] place-items-center">
      <MomentCard
        videoUrl="https://www.youtube.com/embed/L_kVchHsCYM"
        videoTitle="How to use Chat GPT to generate social media captions"
        watchButtonText="Watch Now"
        downloadButtonText="Download Data"
        radioButtonText="Radio Monitor"
      />
      <MomentCard
        videoUrl="https://www.youtube.com/embed/L_kVchHsCYM"
        videoTitle="How to use Chat GPT to generate social media captions"
        watchButtonText="Watch Now"
        downloadButtonText="Download Data"
      />
      <MomentSliderCard
        images={[
          "https://via.placeholder.com/600x300",
          "https://via.placeholder.com/600x300/111",
          "https://via.placeholder.com/600x300/222",
        ]}
        watchButtonText="Watch Now"
        downloadButtonText="Download Data"
        radioButtonText="Option 1"
        downloadIcon={true}
        outline={true}
        subText="Additional Information"
        MomentsTitle="Moments"
        assetsButton="Download Assets"
      />
    </div>
  );
};

export default Moments;
