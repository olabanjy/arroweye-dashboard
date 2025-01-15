import React from "react";
import PieChart from "@/pages/payments/component/PieChart";
import { ChartData } from "chart.js";
import DoughnutChart from "@/pages/payments/component/Doughnut";
import MomentCard from "../public/component/MomentCard";
import MomentSliderCard from "../public/component/MomentSliderCard";

const chartDataForDoughnut: ChartData<"doughnut", number[], string> = {
  labels: ["Radio", "Cable", "Tv", "Dj"],
  datasets: [
    {
      label: "Airplay",
      data: [300, 50, 100, 22, 10],
      backgroundColor: ["#f8e0e1", "#d7ecfb", "#f8f5d8", "#d4f2ed"],
      borderColor: ["#f8e0e1", "#d7ecfb", "#f8f5d8", "#d4f2ed"],
      borderWidth: 2,
    },
  ],
};

const chartData: ChartData<"pie", number[], string> = {
  labels: ["Gen Z", "Millenials", "others"],
  datasets: [
    {
      label: "AUDIENCE",
      data: [300, 50, 100],
      backgroundColor: ["#f8e0e1", "#d7ecfb", "#f8f5d8"],
      borderColor: ["#f8e0e1", "#d7ecfb", "#f8f5d8"],
      borderWidth: 2,
    },
  ],
};

const selectOptions = [
  [
    { value: "local", label: "Local TV" },
    { value: "radio", label: "Radio" },
    { value: "dj", label: "Dj" },
    { value: "cable", label: "Cable" },
  ],
];

const countryFlags = [
  { flag: "🇺🇸", name: "United States" },
  { flag: "🇬🇧", name: "United Kingdom" },
  { flag: "🇨🇦", name: "Canada" },
  { flag: "🇦🇺", name: "Australia" },
  { flag: "🇮🇳", name: "India" },
  { flag: "🇯🇵", name: "Japan" },
  { flag: "🇮🇹", name: "Italy" },
  { flag: "🇨🇳", name: "China" },
  { flag: "🇫🇷", name: "France" },
  { flag: "🇩🇪", name: "Germany" },
];

const InsightChart = () => {
  return (
    <div className="mt-[20px] relative">
      <div className=" grid lg:grid-cols-3 gap-[10px]">
        <div className="border p-[20px] w-[300px] rounded-[8px] space-y-[20px] sm:w-full hover:bg-green-500 hover:bg-opacity-5 hover:border hover:border-green-500">
          <div className="  border-b pb-[20px] ">
            <DoughnutChart
              title="AIRPLAY"
              value="1M"
              selectOptions={selectOptions}
              chartData={chartDataForDoughnut}
              info="The total revenue is the overall amount of money generated from the sale of goods or services before any expenses are deducted."
            />
          </div>

          <div className="border-b pb-[20px]">
            <PieChart
              title="AUDIENCE "
              value="300K"
              selectOptions={selectOptions}
              chartData={chartData}
              maxWidth="500px"
              info="The total revenue is the overall amount of money generated from the sale of goods or services before any expenses are deducted."
            />
          </div>

          <MomentCard
            MomentsTitle="MOMENTS"
            videoUrl="https://www.youtube.com/embed/L_kVchHsCYM"
            videoTitle="How to use Chat GPT to generate social media captions"
            watchButtonText="Watch"
            downloadButtonText="Download Data"
            radioButtonText="Radio Monitor"
            subText="Radio monitor report is populating... "
          />
        </div>
        <div className="border p-[20px] w-[300px] sm:w-full rounded-[8px] space-y-[20px] hover:bg-green-500 hover:bg-opacity-5 hover:border hover:border-green-500">
          <div className="  border-b pb-[20px] ">
            <DoughnutChart
              title="AIRPLAY"
              value="1M"
              selectOptions={selectOptions}
              chartData={chartDataForDoughnut}
              info="The total revenue is the overall amount of money generated from the sale of goods or services before any expenses are deducted."
            />
          </div>

          <div className="border-b pb-[20px]">
            <PieChart
              title="AUDIENCE "
              value="300K"
              selectOptions={selectOptions}
              chartData={chartData}
              maxWidth="500px"
              info="The total revenue is the overall amount of money generated from the sale of goods or services before any expenses are deducted."
            />
          </div>

          <MomentCard
            MomentsTitle="REWIND"
            videoUrl="https://www.youtube.com/embed/L_kVchHsCYM"
            videoTitle="How to use Chat GPT to generate social media captions"
            watchButtonText="Watch"
            downloadButtonText="Download Data"
            radioButtonText="Claim Reward"
            subText="Special delivery just for you 🎁💗 "
            outline={true}
          />
        </div>
        <div className="border p-[20px]  w-[300px] sm:w-full rounded-[8px] space-y-[20px] hover:bg-green-500 hover:bg-opacity-5 hover:border hover:border-green-500">
          <div className="  border-b pb-[20px] ">
            <DoughnutChart
              title="AIRPLAY"
              value="1M"
              selectOptions={selectOptions}
              chartData={chartDataForDoughnut}
              info="The total revenue is the overall amount of money generated from the sale of goods or services before any expenses are deducted."
            />
          </div>

          <div className="border-b pb-[20px]">
            <PieChart
              title="AUDIENCE "
              value="300K"
              selectOptions={selectOptions}
              chartData={chartData}
              maxWidth="500px"
              info="The total revenue is the overall amount of money generated from the sale of goods or services before any expenses are deducted."
            />
          </div>

          <MomentSliderCard
            images={[
              "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg",
              "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg",
              "https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg",
            ]}
            downloadButtonText="Download Data"
            downloadIcon={true}
            MomentsTitle="Moments"
            assetsButton="Download Assets"
            additionalContent={
              <div>
                <p className=" text-start font-[400] text-[8px] font-IBM">
                  TOP TERRITORIES
                </p>
                <div className="flex gap-4 mt-2 relative">
                  {countryFlags.map((country, index) => (
                    <div
                      key={index}
                      className="group  cursor-pointer"
                      title={country.name}
                    >
                      <span className="text-[12px]">{country.flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            }
          />
        </div>
      </div>

      <div className="fixed bottom-[50px] inset-x-0 flex justify-center z-30">
        <div className="bg-white border border-gray-300 rounded p-[8px] inline-flex items-center gap-[10px] shadow-md">
          <button className="rounded p-[8px] bg-black text-white hover:bg-gray-800">
            Export
          </button>
          <button className="rounded p-[8px] bg-[#007bff] text-white hover:bg-blue-600">
            Send
          </button>
          <button className="rounded border p-[8px] text-black bg-white hover:bg-gray-100">
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsightChart;
