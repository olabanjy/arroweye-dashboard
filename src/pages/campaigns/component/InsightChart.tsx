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
import {
  getSingleProject,
  sendProjectEmail,
  getAirPlayStats,
  getSocialMediaStats,
  getDSPStats,
} from "@/services/api";
import ColumnChart from "@/pages/payments/component/ColumnChart";
import { Dialog } from "primereact/dialog";
import { Input } from "@/components/ui/input";
import { BsTelegram } from "react-icons/bs";
import { usePDF } from "react-to-pdf";
import getDarkerColor from "@/pages/payments/helper/getDarkerColor";

const chartDataForDoughnutActions: ChartData<"doughnut", number[], string> = {
  labels: ["Shares", "Saves", "Comments", "Likes", "Followers", "Views"],
  datasets: [
    {
      label: "Social Media",
      data: [300, 50, 100, 22, 10, 15], // Now 6 data points
      backgroundColor: [
        "#f8e0e1",
        "#d7ecfb",
        "#f8f5d8",
        "#d4f2ed",
        "#d2f0ec",
        "#f1e6d9",
      ], // 6 background colors
      borderWidth: 1,
      borderColor: getDarkerColor(
        ["#f8e0e1", "#d7ecfb", "#f8f5d8", "#d4f2ed", "#d2f0ec", "#f1e6d9"],
        20
      ),
      borderAlign: "inner",
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
      borderWidth: 1,
      borderColor: getDarkerColor(["#f8e0e1", "#d7ecfb", "#f8f5d8"], 20),
      borderAlign: "inner",
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
      borderWidth: 1,
      borderColor: getDarkerColor(["#f8e0e1", "#d7ecfb", "#f8f5d8"], 20),
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
    { value: "Nigeria", label: "Nigeria" },
    { value: "Kenya", label: "Kenya" },
    { value: "SouthAfrica", label: "S.Africa" },
    { value: "IvoryCoast", label: "Ivory Coast" },
    { value: "Ghana", label: "Ghana" },
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
  const [openChatModal, setOpenChatModal] = useState(false);
  const [addDataModalSocial, setAddDataModalSocial] = useState(false);
  const [addMediaModal, setAddMediaModal] = useState(false);
  const [addDspModal, setAddDspModal] = useState(false);
  const [exportModal, setExportModal] = useState(false);
  const [shareButtonText, setShareButtonText] = useState("Share");
  const [email, setEmail] = useState("");
  const [airPlayData, setAirPlayData] = useState<any>({});
  const [socialMediaData, setSocialMediaData] = useState<any>({});
  const [dspData, setDspData] = useState<any>({});

  const { query } = useRouter();

  const [content, setContent] = useState<ContentItem | null>(null);
  const { id } = query;

  useEffect(() => {
    if (!!id) {
      getSingleProject(Number(id)).then((fetchedContent) => {
        setContent(fetchedContent);
      });
    }
  }, [id]);

  useEffect(() => {
    if (!!id) {
      getAirPlayStats(Number(id)).then((fetchedContent) => {
        console.log("Air Plays", fetchedContent);
        setAirPlayData(fetchedContent);
      });
    }
  }, [id]);

  useEffect(() => {
    if (!!id) {
      getSocialMediaStats(Number(id)).then((fetchedContent) => {
        console.log("Socials", fetchedContent);
        setSocialMediaData(fetchedContent);
      });
    }
  }, [id]);

  useEffect(() => {
    if (!!id) {
      getDSPStats(Number(id)).then((fetchedContent) => {
        console.log("DSP", fetchedContent);
        setDspData(fetchedContent);
      });
    }
  }, [id]);

  const generateDoughnutChartData = (
    data: Record<string, number>
  ): ChartData<"doughnut", number[], string> => {
    const filteredEntries = Object.entries(data).filter(
      ([key]) => key !== "total_count"
    );

    if (filteredEntries.length === 0) {
      return {
        labels: ["Total Count"],
        datasets: [
          {
            label: "Airplay",
            data: [data.total_count],
            backgroundColor: ["#d4d4d4"],
            borderWidth: 1,
            borderColor: getDarkerColor(["#d4d4d4"], 20),
          },
        ],
      };
    }

    const labels = filteredEntries.map(([key]) => key);
    const values = filteredEntries.map(([_, value]) => value);

    const backgroundColors = labels.map(
      (_, i) => `hsl(${(i * 60) % 360}, 70%, 80%)`
    );
    const borderColors = getDarkerColor(backgroundColors, 20);

    return {
      labels,
      datasets: [
        {
          label: "Airplay",
          data: values,
          backgroundColor: backgroundColors,
          borderWidth: 1,
          borderColor: borderColors,
        },
      ],
    };
  };

  const chartDataForDoughnutAirplay =
    airPlayData && generateDoughnutChartData(airPlayData);

  const generatePieChartData = (
    data: Record<string, number>
  ): ChartData<"pie", number[], string> => {
    const filteredEntries = Object.entries(data).filter(
      ([key]) => key !== "total_count"
    );

    if (filteredEntries.length === 0) {
      return {
        labels: ["Total Count"],
        datasets: [
          {
            label: "Total",
            data: [data.total_count],
            backgroundColor: ["#d4d4d4"],
            borderWidth: 1,
            borderColor: getDarkerColor(["#d4d4d4"], 20),
          },
        ],
      };
    }

    const labels = filteredEntries.map(([key]) => key);
    const values = filteredEntries.map(([_, value]) => value);

    const backgroundColors = labels.map(
      (_, i) => `hsl(${(i * 60) % 360}, 70%, 80%)`
    );
    const borderColors = getDarkerColor(backgroundColors, 20);

    return {
      labels,
      datasets: [
        {
          label: "Social Media",
          data: values,
          backgroundColor: backgroundColors,
          borderWidth: 1,
          borderColor: borderColors,
          borderAlign: "inner",
        },
      ],
    };
  };

  const chartDataForPie = generatePieChartData(socialMediaData);

  const generateBarChartData = (
    data: Record<string, number>
  ): ChartData<"bar", number[], string> => {
    const filteredEntries = Object.entries(data).filter(
      ([key]) => key !== "total_count"
    );

    if (filteredEntries.length === 0) {
      return {
        labels: ["Total Count"],
        datasets: [
          {
            label: "Total",
            data: [data.total_count],
            backgroundColor: ["#d4d4d4"],
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 1)",
          },
        ],
      };
    }

    const labels = filteredEntries.map(([key]) => key);
    const values = filteredEntries.map(([_, value]) => value);

    const backgroundColors = labels.map(
      (_, i) => `hsl(${(i * 60) % 360}, 70%, 80%)`
    );

    return {
      labels,
      datasets: [
        {
          label: "Platform Usage",
          data: values,
          backgroundColor: backgroundColors,
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 1)",
        },
      ],
    };
  };

  const chartDataForBar = generateBarChartData(dspData);

  const handleShareClick = () => {
    navigator.clipboard.writeText("https://your-link.com");
    setShareButtonText("Copied");
    setTimeout(() => {
      setShareButtonText("Share");
    }, 3000);
  };

  const { toPDF, targetRef } = usePDF({ filename: "dashboard.pdf" });

  return (
    <div className=" " ref={targetRef}>
      <div className="mt-[20px] mb-[80px]">
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px] w-full">
          <div className="border p-[20px] w-full rounded-[8px] space-y-[20px]  hover:bg-green-500 hover:bg-opacity-5 hover:border hover:border-green-500">
            {editMode && (
              <div className=" space-y-[20px]">
                <p
                  className="cursor-pointer  p-[15px] border border-[#000] rounded-full hover:border bg-white hover:bg-[#000] font-[400] text-[16px] text-[#000] hover:text-[#fff]"
                  onClick={() => setAddDataModal(true)}
                >
                  + add data
                </p>
                <p
                  className=" cursor-pointer p-[15px] border border-[#000] rounded-full hover:border-none bg-white hover:bg-[#000] font-[400] text-[16px] text-[#000] hover:text-[#fff]"
                  onClick={() => setAddMediaModal(true)}
                >
                  + add media
                </p>
              </div>
            )}

            <div className="  border-b pb-[20px]">
              <DoughnutChart
                title="AIRPLAY"
                valuePlaceholder="TOP CHANNELS"
                value={airPlayData?.total_count ?? 0}
                selectOptions={selectOptionsAirPlay}
                selectOptionsBottom={selectOptionsAudience}
                chartData={chartDataForDoughnutAirplay}
                placeholder="Country"
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
              videoUrl="https://www.youtube.com/embed/L_kVchHsCYM?controls=1&autoplay=1&mute=1"
              videoTitle="How to use Chat GPT to generate social media captions"
              watchButtonText="Watch"
              downloadButtonText="Download Data"
              radioButtonText="Radio Monitor"
              subText="Radio monitor report is populating..."
            />
          </div>
          <div className="border p-[20px] w-full rounded-[8px] space-y-[20px] hover:bg-green-500 hover:bg-opacity-5 hover:border hover:border-green-500">
            {editMode && (
              <div className=" space-y-[20px]">
                <p
                  className="cursor-pointer  p-[15px] border border-[#000] rounded-full hover:border-none bg-white hover:bg-[#000] font-[400] text-[16px] text-[#000] hover:text-[#fff]"
                  onClick={() => setAddDataModalSocial(true)}
                >
                  + add data
                </p>
                <p className=" cursor-pointer p-[15px] border border-[#000] rounded-full hover:border-none bg-white hover:bg-[#000] font-[400] text-[16px] text-[#000] hover:text-[#fff]">
                  + add media
                </p>
              </div>
            )}

            <div className="  border-b pb-[20px] ">
              <PieChart
                title="SOCIAL MEDIA"
                valuePlaceHolder="TOP PLATFORMS"
                value={socialMediaData?.total_count ?? 0}
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
              videoUrl="https://www.youtube.com/embed/L_kVchHsCYM?controls=1&autoplay=1&mute=1"
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
                  + add data
                </p>
                <p className=" cursor-pointer p-[15px] border border-[#000] rounded-full hover:border-none bg-white hover:bg-[#000] font-[400] text-[16px] text-[#000] hover:text-[#fff]">
                  + add media
                </p>
              </div>
            )}

            <div className="  border-b pb-[20px] ">
              <ColumnChart
                title="DSP"
                valuePlaceholder="TOP DSPs"
                value={dspData?.total_count ?? 0}
                chartData={chartDataForBar}
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
              links={[
                "https://www.google.com",
                "https://www.figma.com",
                "https://www.youtube.com",
              ]}
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

      {openChatModal && (
        <div className="fixed bottom-[90px] lg:left-32 right-0 flex justify-center z-30 w-full">
          <div className="bg-white border border-gray-300 rounded p-[8px] flex items-center gap-[10px] max-w-[500px] w-full relative">
            <button
              className=" font-IBM text-[20px] z-10 absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setOpenChatModal(false)}
            >
              &times;
            </button>
            <div className="p-inputgroup grid space-y-[10px] py-[10px] mb-2">
              <Input
                placeholder="hello@arroweye.pro"
                className="border-none focus:ring-0 focus:outline-none focus:border-transparent placeholder:font-IBM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <BsTelegram
                size={44}
                className="text-blue-500 cursor-pointer"
                onClick={() => {
                  console.log("yeah");
                  if (content?.id) {
                    const currentUrl =
                      typeof window !== "undefined" ? window.location.href : "";
                    sendProjectEmail(content.id, { email, url: currentUrl });
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-[30px] lg:left-32 right-0 flex justify-center z-30 w-full">
        <div className="bg-white border border-gray-300 rounded p-[8px] flex items-center gap-[10px]">
          <p
            className="rounded p-[8px] bg-black text-white !w-[70px] text-center cursor-pointer"
            onClick={() => setExportModal(true)}
          >
            Export
          </p>
          <p
            className=" cursor-pointer rounded p-[8px] bg-[#007bff] text-white w-[70px] text-center"
            onClick={() => setOpenChatModal(!openChatModal)}
          >
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
          exportModal ? "bg-white fixed inset-0 z-50 p-8" : "hidden"
        }`}
      >
        <Dialog
          visible={exportModal}
          onHide={() => {
            setExportModal(false);
          }}
          breakpoints={{ "960px": "75vw", "640px": "100vw" }}
          style={{ width: "30vw", padding: "20px", backgroundColor: "white" }}
          className="custom-dialog-overlay"
        >
          <div className="space-y-[30px] p-4">
            <p className="text-center text-[18px] font-[400] font-IBM text-[#000000]">
              Select your preferred format
            </p>

            <div className="grid grid-cols-2 gap-[10px] pb-5">
              <div
                className="font-IBM border rounded-[8px] border-black hover:border-blue-500 h-[200px] flex items-center justify-center"
                onClick={() => toPDF()}
              >
                PDF
              </div>
              <div className="font-IBM border rounded-[8px] border-black hover:border-blue-500 h-[200px] flex items-center justify-center">
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
