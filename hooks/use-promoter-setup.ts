import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import ls from "localstorage-slim";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import {
  createCampaignDraft,
  getCampaignSongISRC,
  getCampaignWallet,
  getPromoterPlans,
  launchCampaignFully,
} from "@/services";
import { useIsrcUpcValidator } from "./use-isrc-upc-validator";

export const usePromoterSetup = () => {
  const router = useRouter();
  const [editBeforeLaunchModal, setEditBeforeLaunchModal] = useState(false);
  const [loadingCampaignSong, setLoadingCampaignSong] = useState(false);
  const [loadingCampaignCreation, setLoadingCampaignCreation] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [campaignSongDetails, setCampaignSongDetails] = useState<any>(null);
  const [totalTokens, setTotalTokens] = useState<number>(0);
  const [totalDJs, setTotalDJs] = useState<number>(0);
  const [totalAudienceReach, setTotalAudienceReach] = useState<number>(0);
  const [selectedPromotion, setSelectedPromotion] = useState<any>(null);
  const [campaignPayload, setCampaignPayload] = useState<{
    accept_terms: boolean;
    aggregator_plan_id: number;
    cluster_ids: number[];
  } | null>(null);
  const [draftId, setDraftId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Fetch Promoter Plans via React Query
  const { data: promoterPlansData } = useQuery({
    queryKey: ["promoter-plans", searchQuery],
    queryFn: () => getPromoterPlans({ search: searchQuery }),
  });

  const promotersData = (promoterPlansData as any)?.results || [];

  const handleSearch = useCallback(() => {
    setSearchQuery(search);
  }, [search]);

  // 2. Fetch Wallet via React Query
  const { data: walletDetails } = useQuery({
    queryKey: ["wallet"],
    queryFn: getCampaignWallet,
  });

  // 3. Input Validator Hook
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

  const startOver = useCallback(() => {
    setTotalAudienceReach(0);
    setSelectedPromotion(null);
    setCampaignPayload(null);
    setStartDate("");
    setCampaignSongDetails(null);
    setIsrc("");
  }, [setIsrc]);

  const resetPlan = useCallback(() => {
    setCampaignPayload(null);
    setTotalDJs(0);
    setTotalTokens(0);
  }, []);

  const handlePlanSelected = useCallback((payload: typeof campaignPayload) => {
    setCampaignPayload(payload);
  }, []);

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
        mode: "aggregator",
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
    const createToast = toast.loading("Creating Campaign...");

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

    try {
      await launchCampaignFully(campaignId, campaignPayload);
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
  }, [draftId, campaignPayload, router]);

  return {
    editBeforeLaunchModal,
    setEditBeforeLaunchModal,
    loadingCampaignSong,
    loadingCampaignCreation,
    startDate,
    setStartDate,
    campaignSongDetails,
    totalTokens,
    setTotalTokens,
    totalDJs,
    setTotalDJs,
    totalAudienceReach,
    setTotalAudienceReach,
    selectedPromotion,
    setSelectedPromotion,
    campaignPayload,
    setCampaignPayload,
    draftId,
    promotersData,
    walletDetails,
    isrc,
    setIsrc,
    validationError,
    isIsrcValid,
    isIsrcValidating,
    startOver,
    resetPlan,
    handlePlanSelected,
    handleCreateCampaignDraft,
    handleLaunchCampaign,
    search,
    setSearch,
    handleSearch,
  };
};
