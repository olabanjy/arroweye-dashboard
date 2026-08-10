import { useMemo, useState } from "react";
import { ChartData } from "chart.js";
import { usePDF } from "react-to-pdf";
import getDarkerColor from "@/lib/getDarkerColor";

interface UseCampaignInsightsParams {
  content?: any;
  refreshContent?: () => void;
}

type DoughnutChartData = {
  labels?: string[];
  datasets: Array<{
    data?: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>;
};

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

const emptyMedia: any[] = [];

const weekKeys = ["week_1", "week_2", "week_3", "week_4"] as const;

const toNumber = (value: unknown) => {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number : 0;
};

const sumWeeklyValues = (rows: any[] = []) =>
  rows.reduce(
    (total, row) =>
      total + weekKeys.reduce((sum, key) => sum + toNumber(row?.[key]), 0),
    0,
  );

const getMetricLabel = (metric: any) =>
  metric?.metric_name ||
  metric?.name ||
  `Metric ${metric?.metric ?? ""}`.trim();

const addValue = (
  totals: Record<string, number>,
  label: string | undefined | null,
  value: number,
) => {
  const key = label || "Uncategorized";
  totals[key] = (totals[key] ?? 0) + value;
};

const withTotalCount = (totals: Record<string, number>) => ({
  ...totals,
  total_count: Object.values(totals).reduce((sum, value) => sum + value, 0),
});

export function useCampaignInsights({
  content,
  refreshContent,
}: UseCampaignInsightsParams) {
  const [initialTab, setInitialTab] = useState<any>("moments");
  const [addDataModal, setAddDataModal] = useState(false);
  const [addDataModalSocial, setAddDataModalSocial] = useState(false);
  const [addMediaModal, setAddMediaModal] = useState(false);
  const [addDspModal, setAddDspModal] = useState(false);

  const media = content?.media ?? emptyMedia;
  const mediaLoading = !content;

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

  const airPlayData = useMemo(() => {
    const totals: Record<string, number> = {};

    content?.project_airplay?.forEach((item: any) => {
      addValue(
        totals,
        item?.airplay?.name,
        sumWeeklyValues(item?.airplay_data),
      );
    });

    return withTotalCount(totals);
  }, [content?.project_airplay]);

  const audienceData = useMemo(() => {
    const totals: Record<string, number> = {};

    content?.project_airplay?.forEach((item: any) => {
      addValue(
        totals,
        item?.airplay?.channel || item?.airplay?.name,
        toNumber(item?.airplay?.audience),
      );
    });

    return withTotalCount(totals);
  }, [content?.project_airplay]);

  const socialMediaData = useMemo(() => {
    const totals: Record<string, number> = {};

    content?.project_sm?.forEach((item: any) => {
      addValue(totals, item?.sm?.name, sumWeeklyValues(item?.sm_data));
    });

    return withTotalCount(totals);
  }, [content?.project_sm]);

  const smactionData = useMemo(() => {
    const totals: Record<string, number> = {};

    content?.project_sm?.forEach((item: any) => {
      item?.sm_data?.forEach((metric: any) => {
        addValue(
          totals,
          getMetricLabel(metric),
          weekKeys.reduce((sum, key) => sum + toNumber(metric?.[key]), 0),
        );
      });
    });

    return withTotalCount(totals);
  }, [content?.project_sm]);

  const dspData = useMemo(() => {
    const totals: Record<string, number> = {};

    content?.project_dsp?.forEach((item: any) => {
      addValue(totals, item?.dsp?.name, sumWeeklyValues(item?.dsp_data));
    });

    return withTotalCount(totals);
  }, [content?.project_dsp]);

  const dspPerformanceData = useMemo(() => {
    const totals: Record<string, number> = {};

    content?.project_dsp?.forEach((item: any) => {
      item?.dsp_data?.forEach((metric: any) => {
        addValue(
          totals,
          getMetricLabel(metric),
          weekKeys.reduce((sum, key) => sum + toNumber(metric?.[key]), 0),
        );
      });
    });

    return withTotalCount(totals);
  }, [content?.project_dsp]);

  const generateDoughnutChartData = (
    data: Record<string, number>,
  ): DoughnutChartData => {
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

  const {
    momentMediaData,
    momentReportUrls,
    giftingsReportUrls,
    recapMediaData,
    dspMediaData,
  } = useMemo(() => {
    const momentMedia = media.filter((item: any) => item?.type === "Moment");
    const recapMedia = media.filter((item: any) => item?.type === "Recap");
    const dspCoversWithFiles = media.filter(
      (item: any) =>
        item?.type === "DSP_Covers" && item?.files && item.files.length > 0,
    );

    return {
      giftingsReportUrls: media.filter((item: any) => item?.type === "Gifting"),
      momentMediaData: momentMedia.map((item: any) => item.embed_link),
      momentReportUrls: momentMedia.map((item: any) => item.report),
      recapMediaData: recapMedia.map((item: any) => item.embed_link),
      dspMediaData: dspCoversWithFiles.flatMap((item: any) =>
        item.files.map(
          (file: any) => `https://studio-api.arroweye.pro${file.file}`,
        ),
      ),
    };
  }, [media]);

  const onAddSocialMediaDataSuccess = () => {
    refreshContent?.();
  };

  const onAddDataSuccess = () => {
    refreshContent?.();
  };

  const onAddDataDspSuccess = () => {
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
    isAirPlayDataLoading: mediaLoading,
    isSocialMediaDataLoading: mediaLoading,
    isDspDataLoading: mediaLoading,
    isAudienceDataLoading: mediaLoading,
    isSmActionDataLoading: mediaLoading,
    isDspPerformanceDataLoading: mediaLoading,
    onAddSocialMediaDataSuccess,
    onAddDataSuccess,
    onAddDataDspSuccess,
    toPDF,
    targetRef,
  };
}
