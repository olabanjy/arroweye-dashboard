import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChartData } from "chart.js";
import { usePDF } from "react-to-pdf";
import {
  getAirPlayStats,
  getSocialMediaStats,
  getDSPStats,
  getAudienceStats,
  geteSMActionStats,
  geteDSPPerformanceStats,
} from "@/services";
import getDarkerColor from "@/lib/getDarkerColor";

interface UseCampaignInsightsParams {
  content?: any;
  refreshContent?: () => void;
}

const campaignChartPalette = [
  "#ff5c7a",
  "#38a8ff",
  "#ffc247",
  "#4ecdc4",
  "#8b5cf6",
  "#ff7a1a",
  "#22c55e",
  "#ec4899",
];

const getCampaignChartColors = (count: number) =>
  Array.from(
    { length: count },
    (_, index) => campaignChartPalette[index % campaignChartPalette.length],
  );

export function useCampaignInsights({
  content,
  refreshContent,
}: UseCampaignInsightsParams) {
  const queryClient = useQueryClient();
  const [initialTab, setInitialTab] = useState<any>("moments");
  const [addDataModal, setAddDataModal] = useState(false);
  const [addDataModalSocial, setAddDataModalSocial] = useState(false);
  const [addMediaModal, setAddMediaModal] = useState(false);
  const [addDspModal, setAddDspModal] = useState(false);
  const [momentMediaData, setMomentMediaData] = useState<any>([]);
  const [momentReportUrls, setMomentReportUrls] = useState<any>([]);
  const [giftingsReportUrls, setGiftingsReportUrls] = useState<any>([]);
  const [recapMediaData, setRecapMediaData] = useState<any>([]);
  const [dspMediaData, setDspMediaData] = useState<any>([]);

  const media = content?.media || [];
  const mediaLoading = !content;
  const { id } = useParams<{ id: string }>();
  const campaignId = Number(id);
  const hasCampaignId = Boolean(id) && Number.isFinite(campaignId);

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

  const { data: airPlayData = {}, isLoading: isAirPlayDataLoading } = useQuery({
    queryKey: [
      "campaign-insights",
      campaignId,
      "airplay",
      airplayChannelsFilters,
    ],
    queryFn: async () =>
      (await getAirPlayStats({
        id: campaignId,
        ...airplayChannelsFilters,
      })) ?? {},
    enabled: hasCampaignId,
  });

  const { data: socialMediaData = {}, isLoading: isSocialMediaDataLoading } =
    useQuery({
      queryKey: [
        "campaign-insights",
        campaignId,
        "social-media",
        socialMediaPlatformFilters,
      ],
      queryFn: async () =>
        (await getSocialMediaStats({
          id: campaignId,
          ...socialMediaPlatformFilters,
        })) ?? {},
      enabled: hasCampaignId,
    });

  const { data: dspData = {}, isLoading: isDspDataLoading } = useQuery({
    queryKey: ["campaign-insights", campaignId, "dsp", dspFilters],
    queryFn: async () =>
      (await getDSPStats({ id: campaignId, ...dspFilters })) ?? {},
    enabled: hasCampaignId,
  });

  const { data: audienceData = {}, isLoading: isAudienceDataLoading } =
    useQuery({
      queryKey: [
        "campaign-insights",
        campaignId,
        "audience",
        airplayAudienceFilters,
      ],
      queryFn: async () =>
        (await getAudienceStats({
          id: campaignId,
          ...airplayAudienceFilters,
        })) ?? {},
      enabled: hasCampaignId,
    });

  const { data: smactionData = {}, isLoading: isSmActionDataLoading } =
    useQuery({
      queryKey: [
        "campaign-insights",
        campaignId,
        "social-media-actions",
        socialMediaActionsFilters,
      ],
      queryFn: async () =>
        (await geteSMActionStats({
          id: campaignId,
          ...socialMediaActionsFilters,
        })) ?? {},
      enabled: hasCampaignId,
    });

  const {
    data: dspPerformanceData = {},
    isLoading: isDspPerformanceDataLoading,
  } = useQuery({
    queryKey: [
      "campaign-insights",
      campaignId,
      "dsp-performance",
      dspPerformanceFilters,
    ],
    queryFn: async () =>
      (await geteDSPPerformanceStats({
        id: campaignId,
        ...dspPerformanceFilters,
      })) ?? {},
    enabled: hasCampaignId,
  });

  const generateDoughnutChartData = (
    data: Record<string, number>,
  ): ChartData<"doughnut", number[], string> => {
    const filteredEntries = Object.entries(data).filter(
      ([key]) => key !== "total_count",
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

    const backgroundColors = getCampaignChartColors(labels.length);
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
    data: Record<string, number>,
  ): ChartData<"pie", number[], string> => {
    const filteredEntries = Object.entries(data).filter(
      ([key]) => key !== "total_count",
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

    const backgroundColors = getCampaignChartColors(labels.length);
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
    data: Record<string, number>,
  ): ChartData<"bar", number[], string> => {
    const filteredEntries = Object.entries(data).filter(
      ([key]) => key !== "total_count",
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

    const backgroundColors = getCampaignChartColors(labels.length);

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

  const { toPDF, targetRef } = usePDF({ filename: "dashboard.pdf" });

  useEffect(() => {
    if (media.length > 0) {
      const giftings = media.filter((item: any) => item?.type === "Gifting");
      setGiftingsReportUrls(giftings);

      const newMomentMedia = media.filter(
        (item: any) => item?.type === "Moment",
      );
      const embedMomentLinks = newMomentMedia.map(
        (item: any) => item.embed_link,
      );
      const momentReportUrl = newMomentMedia.map((item: any) => item.report);
      const newRecapMedia = media.filter((item: any) => item?.type === "Recap");
      const embedRecapLinks = newRecapMedia.map((item: any) => item.embed_link);
      const dspCoversWithFiles = media.filter(
        (item: any) =>
          item?.type === "DSP_Covers" && item?.files && item.files.length > 0,
      );
      const dspfileUrls = dspCoversWithFiles.flatMap((item: any) =>
        item.files.map(
          (file: any) => `https://studio-api.arroweye.pro${file.file}`,
        ),
      );

      setMomentReportUrls(momentReportUrl);
      setMomentMediaData(embedMomentLinks);
      setRecapMediaData(embedRecapLinks);
      setDspMediaData(dspfileUrls);
    }
  }, [media]);

  const onAddSocialMediaDataSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ["campaign-insights", campaignId, "social-media"],
    });
    queryClient.invalidateQueries({
      queryKey: ["campaign-insights", campaignId, "social-media-actions"],
    });
    refreshContent?.();
  };

  const onAddDataSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ["campaign-insights", campaignId, "airplay"],
    });
    queryClient.invalidateQueries({
      queryKey: ["campaign-insights", campaignId, "audience"],
    });
    refreshContent?.();
  };

  const onAddDataDspSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ["campaign-insights", campaignId, "dsp"],
    });
    queryClient.invalidateQueries({
      queryKey: ["campaign-insights", campaignId, "dsp-performance"],
    });
    refreshContent?.();
  };

  return {
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
    airplayChannelsFilters,
    setairplayChannelsFilters,
    airplayAudienceFilters,
    setairplayAudienceFilters,
    socialMediaPlatformFilters,
    setSocialMediaPlatformFilters,
    socialMediaActionsFilters,
    setSocialMediaActionsFilters,
    dspFilters,
    setDspFilters,
    dspPerformanceFilters,
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
    toPDF,
    targetRef,
  };
}
