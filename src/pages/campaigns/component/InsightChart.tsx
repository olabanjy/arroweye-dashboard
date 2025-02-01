"use client";
import React, { useEffect, useState } from "react";
import PieChart from "@/pages/payments/component/PieChart";
import { ChartData } from "chart.js";
import DoughnutChart from "@/pages/payments/component/Doughnut";
import MomentCard from "../public/component/MomentCard";
import MomentSliderCard from "../public/component/MomentSliderCard";
import AddData from "./AddData";
import AddMedia from "./AddMedia";
import AddDataSocials from "./AddDataSocials";
import AddDataDsp from "./AddDataDsp";
import { useRouter } from "next/router";
import { ContentItem } from "@/types/contents";
import { getSingleProject } from "@/services/api";
import ColumnChart from "@/pages/payments/component/ColumnChart";
import { Dialog } from "primereact/dialog";

const chartDataForLine: ChartData<"bar", number[], string> = {
  labels: ["Apple Music", "Youtube", "Spotify", "others"],
  datasets: [
    {
      label: "",
      data: [300, 50, 100, 22],
      backgroundColor: ["#f8e0e1", "#d7ecfb", "#f8f5d8", "#d4f2ed"],
      borderWidth: 2,
      borderColor: "rgba(255, 255, 255, 1)",
    },
  ],
};

const chartDataForPie: ChartData<"pie", number[], string> = {
  labels: ["TikTok", "Twitter", "Instagram", "Facebook", "YouTube"],
  datasets: [
    {
      label: "Social Media",
      data: [300, 50, 100, 22, 10],
      backgroundColor: ["#f8e0e1", "#d7ecfb", "#f8f5d8", "#d4f2ed"],
      borderWidth: 2,
      borderColor: "rgba(255, 255, 255, 1)",
    },
  ],
};

const chartDataForDoughnutActions: ChartData<"doughnut", number[], string> = {
  labels: ["Shares", "Saves", "Comments", "Likes", "Followers", "Views"],
  datasets: [
    {
      label: "Social Media",
      data: [300, 50, 100, 22, 10],
      backgroundColor: ["#f8e0e1", "#d7ecfb", "#f8f5d8", "#d4f2ed"],
      borderWidth: 2,
      borderColor: "rgba(255, 255, 255, 1)",
    },
  ],
};

const chartDataForDoughnutAirplay: ChartData<"doughnut", number[], string> = {
  labels: ["Radio", "Cable", "TV", "DJ"],
  datasets: [
    {
      label: "Airplay",
      data: [300, 50, 100, 22],
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

const chartDataForDoughnutDSP: ChartData<"pie", number[], string> = {
  labels: ["Pre-saves", "Purchases", "Listens", "Streams", "Downloads"],
  datasets: [
    {
      label: "PERFORMANCE ",
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
const selectOptionsAirPlay = [
  [
    { value: "radio", label: "Radio" },
    { value: "dj", label: "DJ" },
    { value: "localTv", label: "Local TV" },
    { value: "cable", label: "Cable" },
  ],
];
const selectOptionsAudience = [
  [
    { value: "radio", label: "Radio" },
    { value: "dj", label: "DJ" },
    { value: "localTv", label: "Local TV" },
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
  const [addDataModalSocial, setAddDataModalSocial] = useState(false);
  const [addMediaModal, setAddMediaModal] = useState(false);
  const [addDspModal, setAddDspModal] = useState(false);
  const [exportModal, setExportModal] = useState(false);
  const [shareButtonText, setShareButtonText] = useState("Share");

  const { query } = useRouter();

  const [content, setContent] = useState<ContentItem | null>(null);
  const { id } = query;

  useEffect(() => {
    getSingleProject(Number(id)).then((fetchedContent) => {
      setContent(fetchedContent);
    });
  }, [id]);

  const handleShareClick = () => {
    navigator.clipboard.writeText("https://your-link.com");
    setShareButtonText("Copied");
    setTimeout(() => {
      setShareButtonText("Share");
    }, 3000);
  };

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
                valuePlaceholder="TOP CHANNELS"
                value={content?.airplay_count ?? 0}
                selectOptions={selectOptionsAirPlay}
                selectOptionsBottom={selectOptionsAudience}
                chartData={chartDataForDoughnutAirplay}
                placeholder="Channels"
                info="The total revenue is the overall amount of money generated from the sale of goods or services before any expenses are deducted."
              />
            </div>

            <div className="border-b pb-[20px]">
              <PieChart
                title="AUDIENCE "
                value="300K"
                selectOptions={selectOptionsAudience}
                chartData={chartData}
                selectOptionsBottom={selectOptionsAudience}
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
                <p
                  className="cursor-pointer  p-[15px] border border-[#000] rounded-full hover:border-none bg-white hover:bg-[#000] font-[400] text-[16px] text-[#000] hover:text-[#fff]"
                  onClick={() => setAddDataModalSocial(true)}
                >
                  add data
                </p>
                <p className=" cursor-pointer p-[15px] border border-[#000] rounded-full hover:border-none bg-white hover:bg-[#000] font-[400] text-[16px] text-[#000] hover:text-[#fff]">
                  add media
                </p>
              </div>
            )}

            <div className="  border-b pb-[20px] ">
              <PieChart
                title="SOCIAL MEDIA"
                valuePlaceHolder="TOP PLATFORMS"
                value={content?.social_media_count ?? 0}
                chartData={chartDataForPie}
                selectOptionsBottom={selectOptionsAudience}
                info="The total revenue is the overall amount of money generated from the sale of goods or services before any expenses are deducted."
              />
            </div>

            <div className="border-b pb-[20px]">
              <DoughnutChart
                title="ACTIONS"
                value="300K"
                chartData={chartDataForDoughnutActions}
                selectOptionsBottom={selectOptionsAudience}
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
                <p
                  className="cursor-pointer  p-[15px] border border-[#000] rounded-full hover:border-none bg-white hover:bg-[#000] font-[400] text-[16px] text-[#000] hover:text-[#fff]"
                  onClick={() => setAddDspModal(true)}
                >
                  add data
                </p>
                <p className=" cursor-pointer p-[15px] border border-[#000] rounded-full hover:border-none bg-white hover:bg-[#000] font-[400] text-[16px] text-[#000] hover:text-[#fff]">
                  add media
                </p>
              </div>
            )}

            <div className="  border-b pb-[20px] ">
              <ColumnChart
                title="DSP"
                valuePlaceholder="TOP DSPs"
                value={content?.dsp_count ?? 0}
                chartData={chartDataForLine}
                selectOptionsBottom={selectOptions}
                info="The total revenue is the overall amount of money generated from the sale of goods or services before any expenses are deducted."
              />
            </div>

            <div className="border-b pb-[20px]">
              <PieChart
                title="PERFORMANCE "
                value="300K"
                selectOptionsBottom={selectOptions}
                chartData={chartDataForDoughnutDSP}
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
      <AddDataSocials
        visible={addDataModalSocial}
        onHide={() => setAddDataModalSocial(false)}
      />
      <AddMedia
        visible={addMediaModal}
        onHide={() => setAddMediaModal(false)}
      />

      <AddDataDsp visible={addDspModal} onHide={() => setAddDspModal(false)} />
      <div className="fixed bottom-[30px] lg:left-32 right-0 flex justify-center z-30 w-full">
        <div className="bg-white border border-gray-300 rounded p-[8px] flex items-center gap-[10px]">
          <p
            className="rounded p-[8px] bg-black text-white !w-[70px] text-center cursor-pointer"
            onClick={() => setExportModal(true)}
          >
            Export
          </p>
          <p className="rounded p-[8px] bg-[#007bff] text-white w-[70px] text-center">
            Send
          </p>
          <p
            className="rounded border p-[8px] text-black bg-white w-[70px] text-center cursor-pointer"
            onClick={handleShareClick}
          >
            {shareButtonText}
          </p>
        </div>
      </div>

      <div
        className={`custom-dialog-overlay ${
          exportModal
            ? "bg-black/30 backdrop-blur-md fixed inset-0 z-50"
            : "hidden"
        }`}
      >
        <Dialog
          visible={exportModal}
          onHide={() => {
            setExportModal(false);
          }}
          breakpoints={{ "960px": "75vw", "640px": "100vw" }}
          style={{ width: "30vw" }}
          className="custom-dialog-overlay"
        >
          <div className="space-y-[20px]">
            <p className=" text-center text-[18px] font-[400] font-IBM text-[#000000]">
              Select your preferred format
            </p>

            <div className=" grid grid-cols-2 gap-[10px]">
              <div className=" font-IBM border rounded-[8px] border-black hover:border-blue-500 h-[200px] flex items-center justify-center">
                PDF
              </div>
              <div className=" font-IBM border rounded-[8px] border-black hover:border-blue-500 h-[200px] flex items-center justify-center">
                CSV
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default InsightChart;
