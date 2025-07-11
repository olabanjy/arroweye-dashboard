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
  getAudienceStats,
  geteSMActionStats,
  geteDSPPerformanceStats,
} from "@/services/api";
import ColumnChart from "@/pages/payments/component/ColumnChart";
import { Dialog } from "primereact/dialog";
import { Input } from "@/components/ui/input";
import { VscSend } from "react-icons/vsc";
import { usePDF } from "react-to-pdf";
import getDarkerColor from "@/lib/getDarkerColor";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import MomentCardRewards from "../public/component/MomentCardRewards";

const selectOptions = [
  [
    { value: "nigeria", label: "Nigeria" },
    { value: "UK", label: "UK" },
    { value: "ghana", label: "Ghana" },
    { value: "kenya", label: "Kenya" },
    { value: "ivoryCoast", label: "Ivory Coast" },
  ],
];
const selectOptionsAirPlay = [
  [
    { value: "", label: "Countries" },
    { value: "Nigeria", label: "Nigeria" },
    { value: "UK", label: "UK" },
    { value: "Kenya", label: "Kenya" },
    { value: "SouthAfrica", label: "S.Africa" },
    { value: "IvoryCoast", label: "Ivory Coast" },
    { value: "Ghana", label: "Ghana" },
  ],
];
const selectOptionsAudience = [
  [
    { value: "", label: "Channels" },
    { value: "Radio", label: "Radio" },
    { value: "DJ", label: "DJ" },
    { value: "TV", label: "Local TV" },
    { value: "Cable", label: "Cable" },
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
  handleDownloadPage?: () => void;
  handleDownloadData?: () => void;
}

const InsightChart: React.FC<InsightChartProps> = ({
  editMode = false,
  handleDownloadPage,
  handleDownloadData,
}) => {
  const [initialTab, setInitialTab] = useState<any>("moments");
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
  const [audienceData, setAudienceData] = useState<any>({});
  const [smactionData, setSmactionData] = useState<any>({});
  const [dspPerformanceData, setDspPerformanceData] = useState<any>({});
  const [momentMediaData, setMomentMediaData] = useState<any>([]);
  const [momentReportUrls, setMomentReportUrls] = useState<any>([]);
  const [giftingsReportUrls, setGiftingsReportUrls] = useState<any>([]);
  const [recapMediaData, setRecapMediaData] = useState<any>([]);
  const [dspMediaData, setDspMediaData] = useState<any>([]);

  const { query } = useRouter();

  const [content, setContent] = useState<any | null>(null);
  const [media, setMedia] = useState<any | null>([]);
  const { id } = query;

  const [airplayChannelsFilters, setairplayChannelsFilters] = useState({
    country: "",
    weeks: "",
    lifetime: "",
  });

  const [airplayAudienceFilters, setairplayAudienceFilters] = useState({
    channels: "",
    weeks: "",
    lifetime: "",
  });

  const [socialMediaPlatformFilters, setSocialMediaPlatformFilters] = useState({
    weeks: "",
    lifetime: "",
  });

  const [socialMediaActionsFilters, setSocialMediaActionsFilters] = useState({
    weeks: "",
    lifetime: "",
  });

  const [dspFilters, setDspFilters] = useState({
    weeks: "",
    lifetime: "",
  });

  const [dspPerformanceFilters, setDspPerformanceFilters] = useState({
    weeks: "",
    lifetime: "",
  });

  useEffect(() => {
    if (!!id) {
      getSingleProject(Number(id)).then((fetchedContent) => {
        setContent(fetchedContent);
        setMedia(fetchedContent?.media);
      });
    }
  }, [id]);

  useEffect(() => {
    if (!!id) {
      getAirPlayStats({ id: Number(id), ...airplayChannelsFilters }).then(
        (fetchedContent) => {
          setAirPlayData(fetchedContent);
        }
      );
    }
  }, [
    id,
    airplayChannelsFilters.weeks,
    airplayChannelsFilters.lifetime,
    airplayChannelsFilters.country,
  ]);

  useEffect(() => {
    if (!!id) {
      getSocialMediaStats({
        id: Number(id),
        ...socialMediaPlatformFilters,
      }).then((fetchedContent) => {
        setSocialMediaData(fetchedContent);
      });
    }
  }, [
    id,
    socialMediaPlatformFilters.weeks,
    socialMediaPlatformFilters.lifetime,
  ]);

  useEffect(() => {
    if (!!id) {
      getDSPStats({ id: Number(id), ...dspFilters }).then((fetchedContent) => {
        setDspData(fetchedContent);
      });
    }
  }, [id, dspFilters.weeks, dspFilters.lifetime]);

  useEffect(() => {
    if (!!id) {
      getAudienceStats({ id: Number(id), ...airplayAudienceFilters }).then(
        (fetchedContent) => {
          setAudienceData(fetchedContent);
        }
      );
    }
  }, [
    id,
    airplayAudienceFilters.weeks,
    airplayAudienceFilters.lifetime,
    airplayAudienceFilters.channels,
  ]);

  useEffect(() => {
    if (!!id) {
      geteSMActionStats({ id: Number(id), ...socialMediaActionsFilters }).then(
        (fetchedContent) => {
          setSmactionData(fetchedContent);
        }
      );
    }
  }, [id, socialMediaActionsFilters.weeks, socialMediaActionsFilters.lifetime]);

  useEffect(() => {
    if (!!id) {
      geteDSPPerformanceStats({
        id: Number(id),
        ...dspPerformanceFilters,
      }).then((fetchedContent) => {
        setDspPerformanceData(fetchedContent);
      });
    }
  }, [id, dspPerformanceFilters.weeks, dspPerformanceFilters.lifetime]);

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

  const chartDataForDoughnutSMAction =
    smactionData && generateDoughnutChartData(smactionData);

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

  const chartDataForPie =
    socialMediaData && generatePieChartData(socialMediaData);

  const pieChartDataAudience =
    audienceData && generatePieChartData(audienceData);

  const pieChartDataDSPPerformance =
    dspPerformanceData && generatePieChartData(dspPerformanceData);

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

  useEffect(() => {
    if (media.length > 0) {
      const giftings = media.filter((item: any) => item?.type === "Gifting");
      setGiftingsReportUrls(giftings);

      const newMomentMedia = media.filter(
        (item: any) => item?.type === "Moment"
      );
      const embedMomentLinks = newMomentMedia.map(
        (item: any) => item.embed_link
      );
      const momentReportUrl = newMomentMedia.map((item: any) => item.report);
      console.log("MOMENT MEDIA", momentReportUrl);
      const newRecapMedia = media.filter((item: any) => item?.type === "Recap");
      const embedRecapLinks = newRecapMedia.map((item: any) => item.embed_link);
      const dspCoversWithFiles = media.filter(
        (item: any) =>
          item?.type === "DSP_Covers" && item?.files && item.files.length > 0
      );
      const dspfileUrls = dspCoversWithFiles.flatMap((item: any) =>
        item.files.map(
          (file: any) => `https://studio-api.arroweye.pro${file.file}`
        )
      );

      setMomentReportUrls(momentReportUrl);
      setMomentMediaData(embedMomentLinks);
      setRecapMediaData(embedRecapLinks);
      setDspMediaData(dspfileUrls);
    }
  }, [media]);

  const onAddSocialMediaDataSuccess = () => {
    if (!!id) {
      getSocialMediaStats({
        id: Number(id),
        ...socialMediaPlatformFilters,
      }).then((fetchedContent) => {
        setSocialMediaData(fetchedContent);
        toast.info("Social Media Stats Updated");
      });
      geteSMActionStats({ id: Number(id), ...socialMediaActionsFilters }).then(
        (fetchedContent) => {
          setSmactionData(fetchedContent);
        }
      );
    }
    if (!!id) {
      getSingleProject(Number(id)).then((fetchedContent) => {
        setContent(fetchedContent);
      });
    }
  };

  const onAddDataSuccess = () => {
    if (!!id) {
      getAirPlayStats({ id: Number(id) }).then((fetchedContent) => {
        setAirPlayData(fetchedContent);
        toast.info("AirPlay stats updated");
      });
      getAudienceStats({ id: Number(id), ...airplayAudienceFilters }).then(
        (fetchedContent) => {
          setAudienceData(fetchedContent);
        }
      );
    }
    if (!!id) {
      getSingleProject(Number(id)).then((fetchedContent) => {
        setContent(fetchedContent);
      });
    }
  };
  const onAddDataDspSuccess = () => {
    if (!!id) {
      getDSPStats({ id: Number(id) }).then((fetchedContent) => {
        setDspData(fetchedContent);
      });
      geteDSPPerformanceStats({ id: Number(id) }).then((fetchedContent) => {
        setDspPerformanceData(fetchedContent);
        toast.info("DSP stats updated");
      });
    }
    if (!!id) {
      getSingleProject(Number(id)).then((fetchedContent) => {
        setContent(fetchedContent);
      });
    }
  };

  return (
    <div ref={targetRef}>
      <div className="mt-[20px] mb-[80px]">
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px] w-full">
          <div className="border p-[20px] w-full rounded-[8px] space-y-[20px]  hover:bg-green-500 hover:bg-opacity-5 hover:border hover:border-green-500">
            {editMode && (
              <div className=" space-y-[20px]">
                <p
                  className="cursor-pointer p-[15px] border border-[#000] rounded-full bg-white hover:bg-[#000] font-[400] text-[16px] text-[#000] hover:text-[#fff]"
                  onClick={() => setAddDataModal(true)}
                >
                  + add data
                </p>
                <p
                  className="cursor-pointer p-[15px] border border-[#000] rounded-full bg-white hover:bg-[#000] font-[400] text-[16px] text-[#000] hover:text-[#fff]"
                  onClick={() => {
                    setInitialTab("moments");
                    setAddMediaModal(true);
                  }}
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
                setFilters={setairplayChannelsFilters}
                placeholder="Country"
                info="Estimated total number of airplay instances this campaign received across radio, television, and DJ/club activations."
              />
            </div>

            <div className="border-b pb-[20px]">
              <PieChart
                title="AUDIENCE"
                value={audienceData?.total_count ?? 0}
                selectOptions={selectOptionsAudience}
                chartData={pieChartDataAudience}
                setFilters={setairplayAudienceFilters}
                selectOptionsBottom={selectOptionsAudience}
                // maxWidth="500px"
                info="Estimated total number of listeners and viewers reached on radio and television. This data is based on the audience size of the channels where your music was featured."
              />
            </div>

            <MomentCard
              MomentsTitle="MOMENTS"
              csvData={{ ...airPlayData, ...audienceData }}
              videoUrls={momentMediaData}
              reportUrls={momentReportUrls}
              videoTitle="Moments"
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
                  className="cursor-pointer p-[15px] border border-[#000] rounded-full bg-white hover:bg-[#000] font-[400] text-[16px] text-[#000] hover:text-[#fff]"
                  onClick={() => setAddDataModalSocial(true)}
                >
                  + add data
                </p>
                <p
                  className=" cursor-pointer p-[15px] border border-[#000] rounded-full bg-white hover:bg-[#000] font-[400] text-[16px] text-[#000] hover:text-[#fff]"
                  onClick={() => {
                    setInitialTab("Recap");
                    setAddMediaModal(true);
                  }}
                >
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
                setFilters={setSocialMediaPlatformFilters}
                selectOptionsBottom={selectOptionsAudience}
                info="Estimated total recorded actions and engagements across individual social media platforms."
              />
            </div>

            <div className="border-b pb-[20px]">
              <DoughnutChart
                title="ACTIONS"
                value={smactionData?.total_count ?? 0}
                chartData={chartDataForDoughnutSMAction}
                setFilters={setSocialMediaActionsFilters}
                selectOptionsBottom={selectOptionsAudience}
                info="Estimated breakdown of engagement and interactions recorded across social media platforms."
              />
            </div>

            <MomentCardRewards
              MomentsTitle="REWIND"
              giftingPin={content?.pin}
              giftings={giftingsReportUrls}
              csvData={{ ...socialMediaData, ...smactionData }}
              videoUrls={recapMediaData}
              reportUrls={momentReportUrls}
              videoTitle="Recap"
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
                  className="cursor-pointer  p-[15px] border border-[#000] rounded-full bg-white hover:bg-[#000] font-[400] text-[16px] text-[#000] hover:text-[#fff]"
                  onClick={() => setAddDspModal(true)}
                >
                  + add data
                </p>
                <p
                  className=" cursor-pointer p-[15px] border border-[#000] rounded-full bg-white hover:bg-[#000] font-[400] text-[16px] text-[#000] hover:text-[#fff]"
                  onClick={() => {
                    setInitialTab("Dsp");
                    setAddMediaModal(true);
                  }}
                >
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
                setFilters={setDspFilters}
                selectOptionsBottom={selectOptions}
                info="Estimated total number of streams and views recorded during this campaign across DSPs. These figures are estimates; please confirm the actual numbers with your distributor."
              />
            </div>

            <div className="border-b pb-[20px]">
              <PieChart
                title="PERFORMANCE "
                value={dspPerformanceData?.total_count ?? 0}
                selectOptionsBottom={selectOptions}
                chartData={pieChartDataDSPPerformance}
                setFilters={setDspPerformanceFilters}
                // maxWidth="500px"
                info="Estimated breakdown of activities and engagement metrics recorded across all DSPs. These figures are estimates; please verify the actual data with your distributor."
              />
            </div>

            <MomentSliderCard
              images={dspMediaData}
              csvData={{ ...dspData, ...dspPerformanceData }}
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
      <AddData
        visible={addDataModal}
        onHide={() => setAddDataModal(false)}
        onAddDataSuccess={onAddDataSuccess}
        existingAirPlayData={content?.project_airplay}
      />
      <AddDataSocials
        visible={addDataModalSocial}
        onHide={() => setAddDataModalSocial(false)}
        onAddDataSuccess={onAddSocialMediaDataSuccess}
        existingSocialMediaData={content?.project_sm}
      />
      <AddMedia
        visible={addMediaModal}
        onHide={() => setAddMediaModal(false)}
        initialTab={initialTab}
      />

      <AddDataDsp
        visible={addDspModal}
        onHide={() => setAddDspModal(false)}
        onAddDataSuccess={onAddDataDspSuccess}
        existingDSPData={content?.project_dsp}
      />

      {openChatModal && (
        <div className="fixed bottom-[90px] lg:left-32 right-0 flex justify-center z-30 w-full">
          <div className="bg-none p-[8px] flex items-center gap-[10px] max-w-[500px] w-full relative">
            <button
              className="font-IBM text-[28px] z-10 absolute top-0 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setOpenChatModal(false)}
            >
              &times;
            </button>
            <div className="bg-white border border-gray-300  p-inputgroup py-[10px] mt-8 mb-2 flex flex-row justify-between items-center">
              <Input
                placeholder="hello@arroweye.pro"
                className="w-full lg:min-w-[400px] border-none shadow-none focus:ring-0 focus:outline-none placeholder:font-IBM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="mx-3 flex justify-center items-center bg-blue-500 rounded-full p-4">
                <VscSend
                  size={16}
                  className="text-white cursor-pointer"
                  onClick={() => {
                    if (content?.id) {
                      const currentUrl =
                        typeof window !== "undefined"
                          ? window.location.href
                          : "";
                      sendProjectEmail(content.id, { email, url: currentUrl });
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-[30px] lg:left-32 right-0 flex justify-center z-30 w-full">
        <div className="bg-white border border-gray-300 rounded p-[8px] flex items-center gap-[10px]">
          <p
            className="rounded-[8px] p-[8px] bg-black text-white !w-[70px] text-center cursor-pointer"
            onClick={() => setExportModal(true)}
          >
            Export
          </p>
          <p
            className=" cursor-pointer rounded-[8px] p-[8px] bg-[#007bff] text-white w-[70px] text-center"
            onClick={() => setOpenChatModal(!openChatModal)}
          >
            Send
          </p>
          <p
            className="rounded-[8px] border p-[8px] text-black bg-white w-[70px] text-center cursor-pointer"
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
                onClick={() => handleDownloadPage && handleDownloadPage()}
              >
                PDF
              </div>
              <div
                className="font-IBM border rounded-[8px] border-black hover:border-blue-500 h-[200px] flex items-center justify-center"
                onClick={() => handleDownloadData && handleDownloadData()}
              >
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
