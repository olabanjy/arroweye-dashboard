import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import ls from "localstorage-slim";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import {
  getCampaignClusters,
  getCampaignWallet,
  getClusterDjs,
  createCampaignDraft,
  launchCampaignFully,
  getSystemAudienceReach,
  getCampaignSongISRC,
} from "@/services";
import { useIsrcUpcValidator } from "./use-isrc-upc-validator";
import { DJCardProps } from "@/components/campaigns/Djcard";

export interface DistrictEntry {
  name: string;
  djs: DJCardProps[];
  loading: boolean;
}

export const useCustomSetup = () => {
  const router = useRouter();
  const [showAutomateModal, setShowAutomateModal] = useState(false);
  const [editBeforeLaunchModal, setEditBeforeLaunchModal] = useState(false);
  const [loadingCampaignSong, setLoadingCampaignSong] = useState(false);
  const [loadingCampaignCreation, setLoadingCampaignCreation] = useState(false);
  const [hasCreatedDraft, setHasCreatedDraft] = useState(false);
  const [draftId, setDraftId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [campaignSongDetails, setCampaignSongDetails] = useState<any>(null);
  const [selectedClusterId, setSelectedClusterId] = useState<number | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [djSpins, setDjSpins] = useState<Record<number, number>>({});
  const [selectedDistricts, setSelectedDistricts] = useState<
    Record<number, DistrictEntry>
  >({});

  // 1. Fetch Clusters via React Query
  const { data: clustersData } = useQuery({
    queryKey: ["campaign-clusters"],
    queryFn: getCampaignClusters,
  });

  const clusters = useMemo(() => {
    const districts = clustersData?.results ?? [];
    const cityMap = new Map<
      string,
      {
        country: string;
        totalDjCount: number;
        districts: { id: number; name: string }[];
      }
    >();

    districts.forEach((item: any) => {
      if (!cityMap.has(item.city)) {
        cityMap.set(item.city, {
          country: item.country,
          totalDjCount: 0,
          districts: [],
        });
      }

      const entry = cityMap.get(item.city)!;
      entry.totalDjCount += item.dj_count;
      entry.districts.push({
        id: item.id,
        name: item.name,
      });
    });

    return Array.from(cityMap.entries()).map(([city, data]) => ({
      city,
      country: data.country,
      count: `${data.totalDjCount}+`,
      districts: data.districts,
    }));
  }, [clustersData]);

  // 2. Fetch Wallet via React Query
  const { data: walletDetails } = useQuery({
    queryKey: ["wallet"],
    queryFn: getCampaignWallet,
  });

  // 3. Fetch System Audience Reach via React Query
  const { data: systemReachData } = useQuery({
    queryKey: ["system-audience-reach"],
    queryFn: getSystemAudienceReach,
  });

  const totalAudienceReach =
    systemReachData?.system_target_audience_reach || "";

  // 4. Input Validator Hook
  const {
    value: isrc,
    setValue: setIsrc,
    error: validationError,
    isValid: isIsrcValid,
    isValidating: isIsrcValidating,
  } = useIsrcUpcValidator("");

  const fetchSong = useCallback(async (value: string) => {
    if (!value) return;
    setLoadingCampaignSong(true);
    try {
      const fetchedContent = await getCampaignSongISRC(value);
      if (fetchedContent?.song) {
        setCampaignSongDetails(fetchedContent.song);
      } else {
        setCampaignSongDetails({ error: "No song Found" });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingCampaignSong(false);
    }
  }, []);

  useEffect(() => {
    if (isIsrcValid && isrc) {
      fetchSong(isrc);
    } else {
      setCampaignSongDetails(null);
    }
  }, [isIsrcValid, isrc, fetchSong]);

  const buildCampaignPayload = useCallback(
    (
      selectedDistricts: Record<number, DistrictEntry>,
      djSpins: Record<string, number>,
      acceptTerms: boolean,
    ) => {
      const clusterIds = Object.keys(selectedDistricts).map(Number);
      const djAllocations: { dj_id: number; spins: number }[] = [];

      Object.entries(djSpins).forEach(([key, spins]) => {
        const [clusterIdStr, djIdStr] = key.split("-");
        const clusterId = Number(clusterIdStr);
        const djId = Number(djIdStr);

        const cluster = selectedDistricts[clusterId];
        if (!cluster) return;

        const dj = cluster.djs.find((d) => d.id === djId);
        if (!dj) return;

        djAllocations.push({ dj_id: djId, spins });
      });

      return {
        accept_terms: acceptTerms,
        cluster_ids: clusterIds,
        dj_allocations: djAllocations,
      };
    },
    [],
  );

  const calculateAudienceReach = useCallback(
    (
      selectedDistricts: Record<number, DistrictEntry>,
      djSpins: Record<string, number>,
    ): number => {
      let audienceReach = 0;

      Object.entries(djSpins).forEach(([key, spins]) => {
        if (spins === 0) return;

        const [clusterIdStr, djIdStr] = key.split("-");
        const clusterId = Number(clusterIdStr);
        const djId = Number(djIdStr);

        const cluster = selectedDistricts[clusterId];
        if (!cluster) return;

        const dj = cluster.djs.find((d) => d.id === djId);
        if (!dj) return;

        audienceReach += Number(dj.audienceReach);
      });

      return audienceReach;
    },
    [],
  );

  const totalDJs = Object.values(selectedDistricts).reduce(
    (acc, district) => acc + district.djs.length,
    0,
  );

  const totalTokens = useMemo(() => {
    let total = 0;

    Object.entries(selectedDistricts).forEach(
      ([districtIdStr, district]: any) => {
        district.djs.forEach((dj: any) => {
          const spinKey = `${districtIdStr}-${dj.id}`;
          const spins = djSpins[spinKey as any] || 0;

          total += dj.tokensPerSpin * spins;
        });
      },
    );

    return total;
  }, [selectedDistricts, djSpins]);

  const totalReachNumber = Number(totalAudienceReach) || 0;
  const reachValue = useMemo(() => {
    return (
      Number(
        String(
          calculateAudienceReach(selectedDistricts, djSpins as any),
        ).replace(/,/g, ""),
      ) || 0
    );
  }, [selectedDistricts, djSpins, calculateAudienceReach]);

  const reachPercentage =
    totalReachNumber > 0
      ? Math.min((reachValue / totalReachNumber) * 100, 100)
      : 0;

  const startOver = useCallback(() => {
    setSelectedDistricts({});
    setIsrc("");
    setDjSpins({});
    setStartDate("");
    setCampaignSongDetails(null);
  }, [setIsrc]);

  const activeDistrictIds = useMemo(() => {
    return new Set(Object.keys(selectedDistricts).map(Number));
  }, [selectedDistricts]);

  const handleDistrictClick = useCallback(
    (_clusterIndex: number, districtId: number, districtName: string) => {
      if (selectedDistricts[districtId]) {
        if (selectedClusterId === districtId) setSelectedClusterId(null);
        setSelectedDistricts((prev) => {
          const next = { ...prev };
          delete next[districtId];
          return next;
        });
        return;
      }

      setSelectedClusterId(districtId);
      setSelectedDistricts((prev) => ({
        ...prev,
        [districtId]: { name: districtName, djs: [], loading: true },
      }));

      getClusterDjs({ cluster_id: districtId })
        .then((data) => {
          const mapped = data.results.map((dj: any) => ({
            id: dj.id,
            name: `${dj.first_name} ${dj.last_name}`,
            location: dj.area,
            topLocations: (dj.top_locations || []).map((loc: string) => ({
              name: loc,
              href: "#",
            })),
            campaignsCompleted: dj.campaigns_completed,
            audienceReach: String(dj.audience_reach),
            rating: dj.rating,
            tokensPerSpin: dj.tokens_per_spin,
          }));

          setSelectedDistricts((prev) => {
            if (!prev[districtId]) return prev;
            return {
              ...prev,
              [districtId]: { name: districtName, djs: mapped, loading: false },
            };
          });
        })
        .catch((err) => {
          console.log("ERR", err);
          setSelectedDistricts((prev) => {
            if (!prev[districtId]) return prev;
            return {
              ...prev,
              [districtId]: { ...prev[districtId], loading: false },
            };
          });
        });
    },
    [selectedDistricts, selectedClusterId],
  );

  const removeDj = useCallback(
    (districtId: number, djId: number | string) => {
      setSelectedDistricts((prev) => {
        if (!prev[districtId]) return prev;

        const remaining = prev[districtId].djs.filter((dj) => dj.id !== djId);

        if (remaining.length === 0) {
          const next = { ...prev };
          delete next[districtId];
          if (selectedClusterId === districtId) setSelectedClusterId(null);
          return next;
        }

        setDjSpins((prevSpins) => {
          const updated = { ...prevSpins };
          delete updated[`${districtId}-${djId}` as any];
          return updated;
        });

        return {
          ...prev,
          [districtId]: { ...prev[districtId], djs: remaining },
        };
      });
    },
    [selectedClusterId],
  );

  const activePlaceholder =
    selectedClusterId !== null && selectedDistricts[selectedClusterId]
      ? `Search Djs in ${selectedDistricts[selectedClusterId].name}`
      : "Select District to Search Djs";

  const fetchDjs = useCallback(
    (districtId: number | null, searchVal?: string) => {
      if (!districtId) return;

      setSelectedDistricts((prev) => ({
        ...prev,
        [districtId]: { ...prev[districtId], loading: true },
      }));

      getClusterDjs({ cluster_id: districtId, search: searchVal })
        .then((data) => {
          const mapped: DJCardProps[] = data.results.map((dj: any) => ({
            id: dj.id,
            name: `${dj.first_name} ${dj.last_name}`,
            location: dj.area,
            topLocations: (dj.top_locations || []).map((loc: string) => ({
              name: loc,
              href: "#",
            })),
            campaignsCompleted: dj.campaigns_completed,
            audienceReach: String(dj.audience_reach),
            rating: dj.rating,
            tokensPerSpin: dj.tokens_per_spin,
          }));

          setSelectedDistricts((prev) => {
            if (!prev[districtId]) return prev;

            const existingIds = new Set(prev[districtId].djs.map((d) => d.id));
            const newDjs = mapped.filter((dj) => !existingIds.has(dj.id));

            return {
              ...prev,
              [districtId]: {
                ...prev[districtId],
                djs: [...prev[districtId].djs, ...newDjs],
                loading: false,
              },
            };
          });
        })
        .catch((err) => {
          console.log("ERR", err);
          setSelectedDistricts((prev) => {
            if (!prev[districtId]) return prev;
            return {
              ...prev,
              [districtId]: { ...prev[districtId], loading: false },
            };
          });
        });
    },
    [],
  );

  const handleCreateCampaignDraft = useCallback(async () => {
    const createDraftToast = toast.loading("Creating Campaign...");
    setLoadingCampaignCreation(true);

    try {
      const result = await createCampaignDraft({
        song_isrc: campaignSongDetails?.isrc,
        song_upc: campaignSongDetails?.upc,
        song_title: campaignSongDetails?.title,
        song_artist: campaignSongDetails?.artist,
        song_artwork: campaignSongDetails?.artwork,
        start_date: startDate,
        mode: "custom",
      });

      if (!result) {
        toast.update(createDraftToast, {
          render: "Campaign Creation Failed, kindly try again",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        setLoadingCampaignCreation(false);
        return;
      }
      setDraftId(result?.id ?? null);
      toast.update(createDraftToast, {
        render:
          "Campaign Created Successfully, feel free to edit selection before Launch",
        type: "info",
        isLoading: false,
        autoClose: 3000,
      });
      setEditBeforeLaunchModal(true);
      setHasCreatedDraft(true);
      setLoadingCampaignCreation(false);
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.update(createDraftToast, {
        render: "Campaign Created Failed, kindly try again",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      setLoadingCampaignCreation(false);
    }
  }, [campaignSongDetails, startDate]);

  const handleLaunchCampaign = useCallback(async () => {
    const createToast = toast.loading("Launching Campaign...");

    const fallbackDraft: any = ls.get("LastCampaignDraft", { decrypt: true });
    const campaignId = draftId ?? fallbackDraft?.id;

    if (!campaignId) {
      toast.update(createToast, {
        render: "No campaign draft found. Please create the campaign first.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      setLoadingCampaignCreation(false);
      return;
    }

    const payload = buildCampaignPayload(
      selectedDistricts,
      djSpins as any,
      true,
    );

    try {
      const result = await launchCampaignFully(campaignId, payload);
      if (!result) {
        toast.update(createToast, {
          render: "Campaign Creation Failed, kindly try again",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        setLoadingCampaignCreation(false);
        return;
      }
      toast.update(createToast, {
        render: "Campaign Launched Successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setLoadingCampaignCreation(false);
      setEditBeforeLaunchModal(false);
      setTimeout(() => {
        router.push("/campaigns");
      }, 3000);
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.update(createToast, {
        render: "Campaign Launch Failed, kindly try again",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      setLoadingCampaignCreation(false);
    }
  }, [draftId, selectedDistricts, djSpins, buildCampaignPayload, router]);

  return {
    showAutomateModal,
    setShowAutomateModal,
    editBeforeLaunchModal,
    setEditBeforeLaunchModal,
    loadingCampaignSong,
    loadingCampaignCreation,
    hasCreatedDraft,
    draftId,
    startDate,
    setStartDate,
    campaignSongDetails,
    clusters,
    walletDetails,
    selectedClusterId,
    setSelectedClusterId,
    search,
    setSearch,
    djSpins,
    setDjSpins,
    totalAudienceReach,
    selectedDistricts,
    isrc,
    setIsrc,
    validationError,
    isIsrcValid,
    isIsrcValidating,
    totalDJs,
    totalTokens,
    reachValue,
    reachPercentage,
    activeDistrictIds,
    handleDistrictClick,
    removeDj,
    activePlaceholder,
    fetchDjs,
    handleCreateCampaignDraft,
    handleLaunchCampaign,
    startOver,
  };
};
