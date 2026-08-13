"use client";
import React from "react";
import AddData from "../AddData";
import AddMedia from "../AddMedia";
import AddDataSocials from "../AddDataSocials";
import AddDataDsp from "../AddDataDsp";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PieChart from "@/app/(dashboard)/payments/component/PieChart";
import MomentCardRewards from "../MomentCardRewards";
import MomentCard from "../MomentCard";
import MomentSliderCard from "../MomentSliderCard";
import DoughnutChart from "../Doughnut";
import ColumnChart from "../ColumnChart";

import { BottomDock } from "./bottom-dock";
import { useCampaignInsights } from "./hooks/use-campaign-insights";

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

const editActionButtonClassName =
  "h-11 w-full justify-start rounded-[8px] border-zinc-300 !bg-white px-5 text-sm font-medium !text-zinc-950 shadow-none hover:!bg-zinc-100 hover:!text-zinc-950 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-violet-500/25";

interface InsightChartProps {
  editMode?: boolean;
  handleDownloadPage?: () => void;
  handleDownloadData?: () => void;
  isAdvertiser?: boolean | null;
  content?: any;
  refreshContent?: () => void;
}

const CampaignInsights: React.FC<InsightChartProps> = ({
  editMode = false,
  handleDownloadPage,
  handleDownloadData,
  isAdvertiser,
  content,
  refreshContent,
}) => {
  const {
    initialTab,
    setInitialTab,
    addDataModal,
    setAddDataModal,
    addDataModalSocial,
    setAddDataModalSocial,
    addMediaModal,
    setAddMediaModal,
    addDspModal,
    setAddDspModal,
    airPlayData,
    socialMediaData,
    dspData,
    audienceData,
    smactionData,
    dspPerformanceData,
    momentMediaData,
    momentReportUrls,
    giftingsReportUrls,
    recapMediaData,
    dspMediaData,
    mediaLoading,
    setairplayChannelsFilters,
    setairplayAudienceFilters,
    setSocialMediaPlatformFilters,
    setSocialMediaActionsFilters,
    setDspFilters,
    setDspPerformanceFilters,
    chartDataForDoughnutAirplay,
    chartDataForDoughnutSMAction,
    chartDataForPie,
    pieChartDataAudience,
    pieChartDataDSPPerformance,
    chartDataForBar,
    isAirPlayDataLoading,
    isSocialMediaDataLoading,
    isDspDataLoading,
    isAudienceDataLoading,
    isSmActionDataLoading,
    isDspPerformanceDataLoading,
    onAddSocialMediaDataSuccess,
    onAddDataSuccess,
    onAddDataDspSuccess,
    targetRef,
  } = useCampaignInsights({ content, refreshContent });

  const insightGridClass = editMode
    ? "grid grid-cols-1 gap-x-[10px] gap-y-[20px] w-full md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[auto_auto_auto_auto]"
    : "grid grid-cols-1 gap-x-[10px] gap-y-[20px] w-full md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[auto_auto_auto]";
  const insightCardClass = editMode
    ? "border p-[20px] w-full rounded-[8px] space-y-[20px] hover:bg-green-500/5 hover:border hover:border-green-500 lg:row-span-4 lg:grid lg:[grid-template-rows:subgrid] lg:space-y-0"
    : "border p-[20px] w-full rounded-[8px] space-y-[20px] hover:bg-green-500/5 hover:border hover:border-green-500 lg:row-span-3 lg:grid lg:[grid-template-rows:subgrid] lg:space-y-0";

  return (
    <div ref={targetRef}>
      <div className="mt-[20px] mb-[80px]">
        <div className={insightGridClass}>
          <div className={insightCardClass}>
            {editMode && (
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className={editActionButtonClassName}
                  onClick={() => setAddDataModal(true)}
                >
                  <Plus className="size-4" />
                  Add data
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={editActionButtonClassName}
                  onClick={() => {
                    setInitialTab("moments");
                    setAddMediaModal(true);
                  }}
                >
                  <Plus className="size-4" />
                  Add media
                </Button>
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
                isLoading={isAirPlayDataLoading}
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
                isLoading={isAudienceDataLoading}
                setFilters={setairplayAudienceFilters}
                selectOptionsBottom={selectOptionsAudience}
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
              // subText="Radio monitor report is populating..."
              loading={mediaLoading}
            />
          </div>
          <div className={insightCardClass}>
            {editMode && (
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className={editActionButtonClassName}
                  onClick={() => setAddDataModalSocial(true)}
                >
                  <Plus className="size-4" />
                  Add data
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={editActionButtonClassName}
                  onClick={() => {
                    setInitialTab("Recap");
                    setAddMediaModal(true);
                  }}
                >
                  <Plus className="size-4" />
                  Add media
                </Button>
              </div>
            )}

            <div className="  border-b pb-[20px] ">
              <PieChart
                title="SOCIAL MEDIA"
                valuePlaceHolder="TOP PLATFORMS"
                value={socialMediaData?.total_count ?? 0}
                chartData={chartDataForPie}
                isLoading={isSocialMediaDataLoading}
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
                isLoading={isSmActionDataLoading}
                setFilters={setSocialMediaActionsFilters}
                selectOptionsBottom={selectOptionsAudience}
                info="Estimated breakdown of engagement and interactions recorded across social media platforms."
              />
            </div>

            <MomentCardRewards
              MomentsTitle="INSIGHTS"
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
              loading={mediaLoading}
            />
          </div>
          <div className={insightCardClass}>
            {editMode && (
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className={editActionButtonClassName}
                  onClick={() => setAddDspModal(true)}
                >
                  <Plus className="size-4" />
                  Add data
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={editActionButtonClassName}
                  onClick={() => {
                    setInitialTab("Dsp");
                    setAddMediaModal(true);
                  }}
                >
                  <Plus className="size-4" />
                  Add media
                </Button>
              </div>
            )}

            <div className="  border-b pb-[20px] ">
              <ColumnChart
                title="DISCOVERY AND STREAMING"
                valuePlaceholder="TOP DSPs"
                value={dspData?.total_count ?? 0}
                chartData={chartDataForBar}
                isLoading={isDspDataLoading}
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
                isLoading={isDspPerformanceDataLoading}
                setFilters={setDspPerformanceFilters}
                info="Estimated breakdown of activities and engagement metrics recorded across all DSPs. These figures are estimates; please verify the actual data with your distributor."
              />
            </div>

            <MomentSliderCard
              images={dspMediaData}
              loading={mediaLoading}
              csvData={{ ...dspData, ...dspPerformanceData }}
              downloadButtonText="Download Data"
              downloadIcon={true}
              MomentsTitle="PLAYLISTS"
              assetsButton="Download Assets"
              links={[
                "https://www.google.com",
                "https://www.figma.com",
                "https://www.youtube.com",
              ]}
              additionalContent={
                <div className="hidden">
                  <p className=" text-start font-[400] text-[8px] font-SansFlex">
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
        onSuccess={refreshContent}
        initialTab={initialTab}
      />

      <AddDataDsp
        visible={addDspModal}
        onHide={() => setAddDspModal(false)}
        onAddDataSuccess={onAddDataDspSuccess}
        existingDSPData={content?.project_dsp}
      />

      <BottomDock
        contentId={content?.id}
        handleDownloadData={handleDownloadData}
        notifications={content?.notifications}
        media={content?.media}
      />
    </div>
  );
};

export default CampaignInsights;
