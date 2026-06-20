import React, { useEffect, useMemo, useRef, useState } from "react";
import ls from "localstorage-slim";
import DashboardLayout from "@/pages/dashboard/layout";
import Head from "next/head";
import { Input } from "@/components/ui/input";
import { ClusterGrid } from "@/components/campaigns/Clustergrid";
import DJCard, { DJCardProps } from "@/components/campaigns/Djcard";
import { BadgeCheck, RefreshCcw, Zap } from "lucide-react";
import {
  getCampaignClusters,
  getCampaignWallet,
  getClusterDjs,
  getCampaignSongISRC,
  createCampaignDraft,
  launchCampaignFully,
  getSystemAudienceReach,
} from "@/services/api";
import AutomateClusterModal from "@/components/campaigns/AutomateClusterModal";
import Link from "next/link";
import Image from "next/image";
import Modal from "@/pages/component/Modal";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

interface DistrictEntry {
  name: string;
  djs: DJCardProps[]; // whatever your mapped DJ type is
  loading: boolean;
}

const CustomCampaign = () => {
  const router = useRouter();
  const [showAutomateModal, setShowAutomateModal] = useState(false);
  const [editBeforeLaunchModal, setEditBeforeLaunchModal] = useState(false);
  const [loadingCampaignSong, setLoadingCampaignSong] = useState(false);
  const [loadingCampaignCreation, setLoadingCampaignCreation] = useState(false);
  const [hasCreatedDraft, setHasCreatedDraft] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [campaignSongDetails, setCampaignSongDetails] = useState<any>(null);
  const [clusters, setClusters] = useState<any[]>([]);
  const [walletDetails, setWalletDetails] = useState<any>({});
  const [selectedClusterId, setSelectedClusterId] = useState<number | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [djSpins, setDjSpins] = useState<Record<number, number>>({});
  const [totalAudienceReach, setTotalAudienceReach] = useState("");

  const buildCampaignPayload = (
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
  };

  const calculateAudienceReach = (
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
  };

  const parseFormattedNumber = (value: string): number =>
    Number(value.replace(/,/g, "")) || 0;

  const handleCreateCampaignDraft = async () => {
    const createDraftToast = toast.loading("Creating Campaign...");
    setLoadingCampaignCreation(true);

    await createCampaignDraft({
      song_isrc: campaignSongDetails?.isrc,
      song_upc: campaignSongDetails?.upc,
      song_title: campaignSongDetails?.title,
      song_artist: campaignSongDetails?.artist,
      song_artwork: campaignSongDetails?.artwork,
      // target_audience_reach: reachValue,
      start_date: startDate || "2026-06-06",
      mode: "custom",
    })
      .then((result) => {
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
      })
      .catch((err) => {
        console.error("Error submitting form:", err);
        toast.update(createDraftToast, {
          render: "Campaign Created Failed, kindly try again",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        setLoadingCampaignCreation(false);
      });
  };

  const handleLaunchCampaign = async () => {
    const createToast = toast.loading("Launching Campaign...");

    const existindDraft: any = ls.get("LastCampaignDraft", { decrypt: true });

    const payload = buildCampaignPayload(selectedDistricts, djSpins, true);

    await launchCampaignFully(existindDraft?.id, payload)
      .then((result) => {
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
      })
      .catch((err) => {
        console.error("Error submitting form:", err);
        toast.update(createToast, {
          render: "Campaign Launch Failed, kindly try again",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        setLoadingCampaignCreation(false);
      });
  };

  useEffect(() => {
    getCampaignClusters()
      .then((fetchedContent: any) => {
        const districts = fetchedContent?.results ?? [];

        // Group districts by city
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

        // Convert map to ClusterCardProps array
        const clusters = Array.from(cityMap.entries()).map(([city, data]) => ({
          city,
          country: data.country,
          count: `${data.totalDjCount}+`,
          districts: data.districts,
        }));

        setClusters(clusters);
      })
      .catch((err) => {
        console.log("ERR", err);
      });
  }, []);

  useEffect(() => {
    getCampaignWallet()
      .then((fetchedContent: any) => {
        setWalletDetails(fetchedContent);
      })
      .catch((err) => {
        console.log("ERR", err);
      });
  }, []);

  useEffect(() => {
    getSystemAudienceReach()
      .then((fetchedContent: any) => {
        setTotalAudienceReach(fetchedContent?.system_target_audience_reach);
      })
      .catch((err) => {
        console.log("ERR", err);
      });
  }, []);

  const [selectedDistricts, setSelectedDistricts] = useState<
    Record<number, DistrictEntry>
  >({});

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
  const reachValue =
    Number(
      String(calculateAudienceReach(selectedDistricts, djSpins)).replace(
        /,/g,
        "",
      ),
    ) || 0;

  const reachPercentage =
    totalReachNumber > 0
      ? Math.min((reachValue / totalReachNumber) * 100, 100)
      : 0;

  const startOver = () => {
    setSelectedDistricts({});
    setIsrc("");
    setDjSpins({});
    setStartDate("");
    setCampaignSongDetails(null);
  };

  const activeDistrictIds = new Set(Object.keys(selectedDistricts).map(Number));

  const handleDistrictClick = (
    _clusterIndex: number,
    districtId: number,
    districtName: string,
  ) => {
    if (selectedDistricts[districtId]) {
      // Deselecting — clear focus if it was the active one
      if (selectedClusterId === districtId) setSelectedClusterId(null);
      setSelectedDistricts((prev) => {
        const next = { ...prev };
        delete next[districtId];
        return next;
      });
      return;
    }

    setSelectedClusterId(districtId); // ← focus the newly selected district
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
          // Guard: user may have deselected while loading
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
  };

  const removeDj = (districtId: number, djId: number | string) => {
    setSelectedDistricts((prev) => {
      if (!prev[districtId]) return prev;

      const remaining = prev[districtId].djs.filter((dj) => dj.id !== djId);

      // If no DJs left, drop the whole district
      if (remaining.length === 0) {
        const next = { ...prev };
        delete next[districtId];
        // Also clear focus if this was the selected district
        if (selectedClusterId === districtId) setSelectedClusterId(null);
        return next;
      }

      setDjSpins((prev) => {
        const updated = { ...prev };

        delete updated[djId as any];

        return updated;
      });

      return {
        ...prev,
        [districtId]: { ...prev[districtId], djs: remaining },
      };
    });
  };

  const activePlaceholder =
    selectedClusterId !== null && selectedDistricts[selectedClusterId]
      ? `Search Djs in ${selectedDistricts[selectedClusterId].name}`
      : "Select District to Search Djs";

  const fetchDjs = (districtId: number | null, search?: string) => {
    if (!districtId) return;

    setSelectedDistricts((prev) => ({
      ...prev,
      [districtId]: { ...prev[districtId], loading: true },
    }));

    getClusterDjs({ cluster_id: districtId, search })
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

          // Merge: add only DJs not already in the list
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
  };

  const [isrc, setIsrc] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSong = async (value: string) => {
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
  };

  return (
    <>
      <Head>
        <title>Custom Campaigns - Arroweye</title>
      </Head>
      <DashboardLayout>
        <div className="bg-[#F6F6F6] h-max py-7">
          <div className="flex justify-center items-center gap-2 mb-7">
            <Link href="/campaigns/setup">
              <p className="text-[#A3A3A3]">Set Budget</p>
            </Link>
            <div className="h-[1px] w-8 bg-[#A3A3A3]" />
            <p>Launch Campaign</p>
          </div>

          <div className="bg-white py-8 mx-5 px-5 lg:px-14">
            <div className="grid grid-cols-1 gap-[20px] items-center">
              <div className="relative">
                <Input
                  value={isrc}
                  ref={inputRef}
                  className="border-[#9D9A9A]"
                  type="text"
                  placeholder="ISRC / UPC"
                  onChange={(e) => {
                    setIsrc(e.target.value);
                    if (timeoutRef.current) {
                      clearTimeout(timeoutRef.current);
                    }

                    timeoutRef.current = setTimeout(() => {
                      const value = inputRef.current?.value;
                      if (value) {
                        fetchSong(value);
                      }
                    }, 2000);
                  }}
                />
                {loadingCampaignSong === true && (
                  <span className="italic absolute top-14 text-sm mt-2 truncate w-full block">
                    Loading Song....
                  </span>
                )}
                {loadingCampaignSong !== true &&
                  campaignSongDetails?.artist &&
                  campaignSongDetails?.title && (
                    <div
                      title={`${campaignSongDetails?.artist} - ${campaignSongDetails?.title}`}
                      className="absolute flex flex-row gap-2 items-center top-14 text-sm mt-2 text-green-500 w-full overflow-hidden cursor-default"
                    >
                      <BadgeCheck height={14} width={14} className="shrink-0" />
                      <p className="truncate">
                        {campaignSongDetails?.artist} -{" "}
                        {campaignSongDetails?.title}
                      </p>
                    </div>
                  )}
                {loadingCampaignSong !== true && campaignSongDetails?.error && (
                  <p className="absolute top-14 text-sm mt-2 text-red-500 truncate w-full">
                    {campaignSongDetails?.error}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-8 py-[1px] sticky top-0 z-30 bg-white">
              <div className="mt-10 px-5 py-7 rounded-xl bg-[#F3F4F6] border border-black grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">
                <div className="flex flex-col justify-between items-center min-h-[80px]">
                  <p className="text-lg font-medium text-center leading-tight">
                    TOTAL TOKENS
                  </p>
                  <p className="text-5xl font-medium">
                    {walletDetails?.available_balance || "0"}
                  </p>
                </div>

                <div className="flex flex-col justify-between items-center min-h-[80px]">
                  <p className="text-lg font-medium text-center leading-tight">
                    TOKENS ALLOCATED
                  </p>
                  <p className="text-5xl font-medium">{totalTokens || "0"}</p>
                </div>

                <div className="flex flex-col justify-between items-center min-h-[80px]">
                  <p className="text-lg font-medium text-center leading-tight">
                    TOKENS REMAINING
                  </p>
                  <p className="text-5xl font-medium">
                    {totalTokens > 0 && walletDetails?.available_balance > 0
                      ? walletDetails.available_balance - totalTokens
                      : 0}
                  </p>
                </div>

                <div className="flex flex-col justify-between items-center min-h-[80px]">
                  <p className="text-lg font-medium text-center leading-tight">
                    DJS SELECTED
                  </p>
                  <p className="text-5xl font-medium">{totalDJs || 0}</p>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <ClusterGrid
                clusters={clusters}
                activeDistricts={activeDistrictIds} // ← pass the Set
                onDistrictClick={handleDistrictClick}
              />
            </div>

            <div className="my-4">
              <Input
                className="border-[#9D9A9A]"
                type="search"
                placeholder={activePlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    fetchDjs(selectedClusterId, search);
                  }
                }}
              />
            </div>

            <div className="flex flex-col gap-5">
              {Object.entries(selectedDistricts).map(
                ([districtIdStr, entry]) => {
                  const districtId = Number(districtIdStr);
                  return (
                    <div key={districtId}>
                      {/* District label */}
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        {entry.name}
                      </h3>

                      {entry.loading ? (
                        <div className="flex items-center justify-center py-10">
                          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                        </div>
                      ) : entry.djs.length > 0 ? (
                        entry.djs.map((dj) => {
                          const spinKey = `${districtId}-${dj.id}`;

                          return (
                            <div key={spinKey} className="relative mb-5">
                              <DJCard
                                id={dj.id}
                                name={dj.name}
                                location={dj.location}
                                topLocations={dj.topLocations}
                                campaignsCompleted={dj.campaignsCompleted}
                                audienceReach={dj.audienceReach}
                                rating={dj.rating}
                                tokensPerSpin={dj.tokensPerSpin}
                                spins={djSpins[spinKey as any] || 0}
                                onSpinsChange={(value) =>
                                  setDjSpins((prev) => ({
                                    ...prev,
                                    [spinKey]: value,
                                  }))
                                }
                              />

                              <button
                                onClick={() => removeDj(districtId, dj.id)}
                                className="absolute top-1 sm:top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                                aria-label="Remove DJ"
                              >
                                ✕
                              </button>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-center py-5 text-gray-500">
                          No DJs found
                        </p>
                      )}
                    </div>
                  );
                },
              )}

              {Object.keys(selectedDistricts).length === 0 && (
                <p className="text-center py-5">No Districts Selected</p>
              )}
            </div>

            <div className="mt-10 flex flex-col gap-2">
              <p>Audience Reach</p>
              <div className="bg-gray-200 w-full h-1 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${reachPercentage}%`,
                    backgroundColor: "#F4C300",
                  }}
                />
              </div>
              {totalAudienceReach && (
                <p className="text-right">{reachValue.toLocaleString()} of {totalAudienceReach?.toLocaleString()}</p>
              )}
            </div>

            <div className="w-full px-4 py-6 md:px-6 md:py-5 rounded-xl">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                {/* Actions (Automate + Start Over) */}
                <div className="flex gap-3 order-1 md:order-1">
                  <button
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-purple-500 to-pink-500"
                    disabled={true}
                    onClick={() => setShowAutomateModal(true)}
                  >
                    {/* Icon wrapper */}
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white">
                      <Zap size={14} className="text-purple-600" />
                    </span>
                    Automate
                  </button>

                  <button
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-black text-white font-medium"
                    onClick={startOver}
                  >
                    <RefreshCcw size={16} />
                    Start Over
                  </button>
                </div>

                {/* Date Input */}
                <div className="flex flex-col order-2 md:order-2 w-full md:w-auto">
                  <label className="text-xs font-semibold tracking-wide text-gray-600 mb-1 md:mb-2">
                    START DATE
                  </label>
                  <Input
                    type="datetime-local"
                    name="startDate"
                    value={startDate}
                    placeholder="01/01/2034"
                    className="w-full md:w-[260px]"
                    onChange={(e) => setStartDate(e.target.value.split("T")[0])}
                  />
                </div>

                {/* Launch CTA */}
                <button
                  className={`order-3 md:order-3 w-full md:w-auto px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold ${loadingCampaignCreation || Object.keys(selectedDistricts).length === 0 || !startDate || !campaignSongDetails?.artist || !reachValue ? "opacity-50 italic" : ""}`}
                  disabled={
                    loadingCampaignCreation ||
                    Object.keys(selectedDistricts).length === 0 ||
                    !startDate ||
                    !campaignSongDetails?.artist ||
                    !reachValue
                  }
                  onClick={handleCreateCampaignDraft}
                >
                  {loadingCampaignCreation === true
                    ? "Loading..."
                    : "Create Campaign"}
                </button>
              </div>
            </div>

            {Object.keys(selectedDistricts).length !== 0 && hasCreatedDraft && (
              <div className="flex justify-end">
                <button
                  className={`mt-10 md:px-6 ${!campaignSongDetails?.artist || Object.keys(selectedDistricts).length === 0 ? "opacity-50" : ""}`}
                  disabled={
                    !campaignSongDetails?.artist ||
                    Object.keys(selectedDistricts).length === 0
                  }
                  onClick={() => {
                    if (Object.keys(selectedDistricts).length !== 0)
                      setEditBeforeLaunchModal(true);
                  }}
                >
                  <Image
                    className="p-8 bg-[#CAFF00] border border-[#000000] rounded-full"
                    src="/Vectorcart.svg"
                    alt="spinslogo"
                    width={86}
                    height={86}
                  />
                </button>
              </div>
            )}
          </div>
        </div>

        {showAutomateModal && (
          <AutomateClusterModal
            clusters={clusters}
            activeDistricts={activeDistrictIds}
            onDistrictClick={handleDistrictClick}
          />
        )}

        <Modal
          isOpen={editBeforeLaunchModal}
          onClose={() => setEditBeforeLaunchModal(!editBeforeLaunchModal)}
          maxWidth="lg:max-w-2xl"
        >
          <p className="pb-5 font-bold text-lg lg:text-2xl">Your Selection</p>
          <div className="flex flex-col gap-5">
            {Object.entries(selectedDistricts).map(([districtIdStr, entry]) => {
              const districtId = Number(districtIdStr);
              return (
                <div key={districtId}>
                  {/* District label */}
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    {entry.name}
                  </h3>

                  {entry.loading ? (
                    <div className="flex items-center justify-center py-10">
                      <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                    </div>
                  ) : entry.djs.length > 0 ? (
                    entry.djs.map((dj) => {
                      const spinKey = `${districtId}-${dj.id}`;

                      return (
                        <div key={spinKey} className="relative mb-5">
                          <DJCard
                            id={dj.id}
                            name={dj.name}
                            location={dj.location}
                            topLocations={dj.topLocations}
                            campaignsCompleted={dj.campaignsCompleted}
                            audienceReach={dj.audienceReach}
                            rating={dj.rating}
                            tokensPerSpin={dj.tokensPerSpin}
                            spins={djSpins[spinKey as any] || 0}
                            onSpinsChange={(value) =>
                              setDjSpins((prev) => ({
                                ...prev,
                                [spinKey]: value,
                              }))
                            }
                            isOnModal={true}
                          />
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center py-5 text-gray-500">
                      No DJs found
                    </p>
                  )}
                </div>
              );
            })}

            {Object.keys(selectedDistricts).length === 0 && (
              <p className="text-center py-5">No Districts Selected</p>
            )}
          </div>

          <div className="mt-10 px-5 py-7 rounded-xl bg-[#F3F4F6] border border-black grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">
            <div className="flex flex-col justify-between items-center min-h-[30px]">
              <p className="text-xs font-medium text-center leading-tight">
                TOTAL TOKENS
              </p>
              <p className="text-3xl font-medium">
                {walletDetails?.available_balance || "0"}
              </p>
            </div>

            <div className="flex flex-col justify-between items-center min-h-[30px]">
              <p className="text-xs font-medium text-center leading-tight">
                TOKENS ALLOCATED
              </p>
              <p className="text-3xl font-medium">{totalTokens || "0"}</p>
            </div>

            <div className="flex flex-col justify-between items-center min-h-[30px]">
              <p className="text-xs font-medium text-center leading-tight">
                TOKENS REMAINING
              </p>
              <p className="text-3xl font-medium">
                {totalTokens > 0 && walletDetails?.available_balance > 0
                  ? walletDetails.available_balance - totalTokens
                  : 0}
              </p>
            </div>

            <div className="flex flex-col justify-between items-center min-h-[30px]">
              <p className="text-xs font-medium text-center leading-tight">
                DJS SELECTED
              </p>
              <p className="text-3xl font-medium">{totalDJs || 0}</p>
            </div>
          </div>

          <div className="w-full pt-8 rounded-xl">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              {/* Launch CTA */}
              <button
                className={`order-3 md:order-3 w-full md:w-auto px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold ${loadingCampaignCreation || Object.keys(selectedDistricts).length === 0 || !startDate || !campaignSongDetails?.artist ? "opacity-50 italic" : ""}`}
                onClick={handleLaunchCampaign}
              >
                {loadingCampaignCreation === true
                  ? "Loading..."
                  : "Launch Campaign"}
              </button>
            </div>
          </div>
        </Modal>
      </DashboardLayout>
    </>
  );
};

export default CustomCampaign;
