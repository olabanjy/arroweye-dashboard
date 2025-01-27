"use client";
import React, { useState } from "react";
import PieChart from "@/pages/payments/component/PieChart";
import { ChartData } from "chart.js";
import DoughnutChart from "@/pages/payments/component/Doughnut";
import MomentCard from "../public/component/MomentCard";
import MomentSliderCard from "../public/component/MomentSliderCard";
import AddData from "./AddData";
import AddMedia from "./AddMedia";

const chartDataForDoughnut: ChartData<"doughnut", number[], string> = {
  labels: ["Radio", "Cable", "TV", "DJ"],
  datasets: [
    {
      label: "Airplay",
      data: [300, 50, 100, 22, 10],
      backgroundColor: ["#f8e0e1", "#d7ecfb", "#f8f5d8", "#d4f2ed"],
      borderWidth: 2,
      borderColor: "rgba(255, 255, 255, 1)",
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
      borderWidth: 2,
      borderColor: "rgba(255, 255, 255, 1)",
    },
  ],
};

const selectOptions = [
  [
    { value: "nigeria", label: "Nigeria" },
    { value: "ghana", label: "Ghana" },
    { value: "kenya", label: "Kenya" },
    { value: "ivoryCoast", label: "Ivory Coast" },
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

interface InsightChartProps {
  editMode?: boolean;
}

const InsightChart: React.FC<InsightChartProps> = ({ editMode = false }) => {
  const [addDataModal, setAddDataModal] = useState(false);
  const [addMediaModal, setAddMediaModal] = useState(false);

  return (
    <div className=" ">
      <div className="mt-[20px] mb-[20px]">
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px] w-full">
          <div className="border p-[20px] w-full rounded-[8px] space-y-[20px]  hover:bg-green-500 hover:bg-opacity-5 hover:border hover:border-green-500">
            {editMode && (
              <div className=" space-y-[20px]">
                <p
                  className="cursor-pointer  p-[15px] border border-[#000] rounded-full hover:border-none bg-white hover:bg-[#000] font-[400] text-[16px] text-[#000] hover:text-[#fff]"
                  onClick={() => setAddDataModal(true)}
                >
                  add data
                </p>
                <p
                  className=" cursor-pointer p-[15px] border border-[#000] rounded-full hover:border-none bg-white hover:bg-[#000] font-[400] text-[16px] text-[#000] hover:text-[#fff]"
                  onClick={() => setAddMediaModal(true)}
                >
                  add media
                </p>
              </div>
            )}

            <div className="  border-b pb-[20px]">
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
                // maxWidth="500px"
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
          <div className="border p-[20px] w-full rounded-[8px] space-y-[20px] hover:bg-green-500 hover:bg-opacity-5 hover:border hover:border-green-500">
            {editMode && (
              <div className=" space-y-[20px]">
                <p className="cursor-pointer  p-[15px] border border-[#000] rounded-full hover:border-none bg-white hover:bg-[#000] font-[400] text-[16px] text-[#000] hover:text-[#fff]">
                  add data
                </p>
                <p className=" cursor-pointer p-[15px] border border-[#000] rounded-full hover:border-none bg-white hover:bg-[#000] font-[400] text-[16px] text-[#000] hover:text-[#fff]">
                  add media
                </p>
              </div>
            )}

            <div className="  border-b pb-[20px] ">
              <DoughnutChart
                title="SOCIAL MEDIA"
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
                // maxWidth="500px"
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
          <div className="border p-[20px]  rounded-[8px] space-y-[20px] hover:bg-green-500 hover:bg-opacity-5 hover:border hover:border-green-500">
            {editMode && (
              <div className=" space-y-[20px]">
                <p className="cursor-pointer  p-[15px] border border-[#000] rounded-full hover:border-none bg-white hover:bg-[#000] font-[400] text-[16px] text-[#000] hover:text-[#fff]">
                  add data
                </p>
                <p className=" cursor-pointer p-[15px] border border-[#000] rounded-full hover:border-none bg-white hover:bg-[#000] font-[400] text-[16px] text-[#000] hover:text-[#fff]">
                  add media
                </p>
              </div>
            )}

            <div className="  border-b pb-[20px] ">
              <DoughnutChart
                title="DSP"
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
                // maxWidth="500px"
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
              MomentsTitle="DSP EDITORIAL"
              assetsButton="Download Assets"
              additionalContent={
                <div className="hidden">
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
      </div>
      <AddData visible={addDataModal} onHide={() => setAddDataModal(false)} />
      <AddMedia
        visible={addMediaModal}
        onHide={() => setAddMediaModal(false)}
      />
      <div className="fixed bottom-[30px] lg:left-32 right-0 flex justify-center z-30 w-full">
        <div className="bg-white border border-gray-300 rounded p-[8px] flex items-center gap-[10px]">
          <p className="rounded p-[8px] bg-black text-white !w-[70px] text-center">
            Export
          </p>
          <p className="rounded p-[8px] bg-[#007bff] text-white w-[70px] text-center">
            Send
          </p>
          <p className="rounded border p-[8px] text-black bg-white w-[70px] text-center">
            Share
          </p>
        </div>
      </div>
    </div>
  );
};

export default InsightChart;
