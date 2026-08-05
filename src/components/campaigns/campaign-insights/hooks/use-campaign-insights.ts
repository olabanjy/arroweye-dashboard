import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
  const [initialTab, setInitialTab] = useState<any>("moments");
  const [addDataModal, setAddDataModal] = useState(false);
  const [addDataModalSocial, setAddDataModalSocial] = useState(false);
  const [addMediaModal, setAddMediaModal] = useState(false);
  const [addDspModal, setAddDspModal] = useState(false);
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

  const media = content?.media || [];
  const mediaLoading = !content;
  const { id } = useParams<{ id: string }>();

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
      getAirPlayStats({ id: Number(id), ...airplayChannelsFilters }).then(
        (fetchedContent) => {
          setAirPlayData(fetchedContent);
        },
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
        },
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
        },
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
    if (!!id) {
      getSocialMediaStats({
        id: Number(id),
        ...socialMediaPlatformFilters,
      }).then((fetchedContent) => {
        setSocialMediaData(fetchedContent);
      });
      geteSMActionStats({ id: Number(id), ...socialMediaActionsFilters }).then(
        (fetchedContent) => {
          setSmactionData(fetchedContent);
        },
      );
    }
    refreshContent?.();
  };

  const onAddDataSuccess = () => {
    if (!!id) {
      getAirPlayStats({ id: Number(id) }).then((fetchedContent) => {
        setAirPlayData(fetchedContent);
      });
      getAudienceStats({ id: Number(id), ...airplayAudienceFilters }).then(
        (fetchedContent) => {
          setAudienceData(fetchedContent);
        },
      );
    }
    refreshContent?.();
  };

  const onAddDataDspSuccess = () => {
    if (!!id) {
      getDSPStats({ id: Number(id) }).then((fetchedContent) => {
        setDspData(fetchedContent);
      });
      geteDSPPerformanceStats({ id: Number(id) }).then((fetchedContent) => {
        setDspPerformanceData(fetchedContent);
      });
    }
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
    onAddSocialMediaDataSuccess,
    onAddDataSuccess,
    onAddDataDspSuccess,
    toPDF,
    targetRef,
  };
}
