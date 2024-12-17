import React from "react";
import MomentCard from "./MomentCard";

const Moments = () => {
  return (
    <div className=" grid md:grid-cols-3 gap-[20px] place-items-center">
      <MomentCard
        videoUrl="https://www.youtube.com/embed/L_kVchHsCYM"
        videoTitle="How to use Chat GPT to generate social media captions"
        watchButtonText="Watch Now"
        downloadButtonText="Download Data"
        radioButtonText="Radio Monitor Now"
      />
      <MomentCard
        videoUrl="https://www.youtube.com/embed/L_kVchHsCYM"
        videoTitle="How to use Chat GPT to generate social media captions"
        watchButtonText="Watch Now"
        downloadButtonText="Download Data"
      />
      <MomentCard
        videoUrl="https://www.youtube.com/embed/L_kVchHsCYM"
        videoTitle="How to use Chat GPT to generate social media captions"
        downloadButtonText="Download Data"
        radioButtonText="Download Assets"
        downloadIcon={false}
      />
    </div>
  );
};

export default Moments;
