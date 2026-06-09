import React, { useEffect, useRef, useState } from "react";
import ls from "localstorage-slim";
import DashboardLayout from "@/pages/dashboard/layout";
import Head from "next/head";
import { Input } from "@/components/ui/input";
import { PromotionGrid } from "@/components/campaigns/PromotionGrid";
import {
  createCampaignDraft,
  getCampaignSongISRC,
  getCampaignWallet,
  getPromoterPlans,
  launchCampaignFully,
} from "@/services/api";
import { BadgeCheck, RefreshCcw, Zap } from "lucide-react";
import { toast } from "react-toastify";
import Modal from "@/pages/component/Modal";
import { useRouter } from "next/router";

const PromoterCampaign = () => {
  const router = useRouter();
  const [walletDetails, setWalletDetails] = useState<any>({});
  const [promotersData, setPromotersData] = useState<any>([]);
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
  const [search, setSearch] = useState<string | undefined>("");

  useEffect(() => {
    getPromoterPlans()
      .then((fetchedContent: any) => {
        setPromotersData(fetchedContent?.results);
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

  const startOver = () => {
    setTotalAudienceReach(0);
    setSelectedPromotion(null);
    setCampaignPayload(null);
    setStartDate("");
    setCampaignSongDetails(null);
  };

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

  const handleCreateCampaignDraft = async () => {
    const createDraftToast = toast.loading("Creating Campaign...");
    setLoadingCampaignCreation(true);

    await createCampaignDraft({
      song_isrc: campaignSongDetails?.isrc,
      song_upc: campaignSongDetails?.upc,
      song_title: campaignSongDetails?.title,
      song_artist: campaignSongDetails?.artist,
      song_artwork: campaignSongDetails?.artwork,
      target_audience_reach: totalAudienceReach,
      start_date: startDate || "2026-06-06",
      mode: "aggregator",
    })
      .then(() => {
        toast.update(createDraftToast, {
          render:
            "Campaign Created Successfully, feel free to edit selection before Launch",
          type: "info",
          isLoading: false,
          autoClose: 3000,
        });
        setEditBeforeLaunchModal(true);
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
    const createToast = toast.loading("Creating Campaign...");

    const existindDraft: any = ls.get("LastCampaignDraft", { decrypt: true });

    const payload = campaignPayload;

    await launchCampaignFully(existindDraft?.id, payload)
      .then(() => {
        toast.update(createToast, {
          render: "Campaign Launched Successfully",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        setLoadingCampaignCreation(false);
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

  const handlePlanSelected = (payload: typeof campaignPayload) => {
    setCampaignPayload(payload);
  };

  return (
    <>
      <Head>
        <title>Promoter Campaigns - Arroweye</title>
      </Head>
      <DashboardLayout>
        <div className="bg-[#F6F6F6] py-7">
          <div className="flex justify-center items-center gap-2 mb-7">
            <p className="text-[#A3A3A3]">Set Budget</p>
            <div className="h-[1px] w-8 bg-[#A3A3A3]" />
            <p>Launch Campaign</p>
          </div>

          <div className="bg-white py-8 mx-5 px-5 lg:px-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] items-center">
              <Input
                className="border-[#9D9A9A]"
                type="text"
                placeholder="Email"
              />
              <div className="relative">
                <Input
                  ref={inputRef}
                  className="border-[#9D9A9A]"
                  type="text"
                  placeholder="ISRC / UPC"
                  onChange={() => {
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
                  <span className="italic absolute top-14 text-sm mt-2">
                    Loading Song....
                  </span>
                )}
                {loadingCampaignSong !== true &&
                  campaignSongDetails?.artist &&
                  campaignSongDetails?.title && (
                    <div
                      className={`absolute flex flex-row gap-2 items-center top-14 text-sm mt-2 text-green-500`}
                    >
                      <BadgeCheck height={14} width={14} />
                      <p>
                        {campaignSongDetails?.artist} -{" "}
                        {campaignSongDetails?.title}
                      </p>{" "}
                    </div>
                  )}
                {loadingCampaignSong !== true && campaignSongDetails?.error && (
                  <p className={`absolute top-14 text-sm mt-2 text-red-500`}>
                    {campaignSongDetails?.error}
                  </p>
                )}
              </div>
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

            <div className="pt-10">
              <div className="mb-8">
                <p className="font-bold lg:text-lg">Promoters</p>
                <Input
                  className="border-[#9D9A9A]"
                  type="search"
                  placeholder="Search Djs"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      getPromoterPlans({ search });
                    }
                  }}
                />
              </div>
              <PromotionGrid
                data={promotersData}
                selectedPromotion={selectedPromotion}
                setSelectedPromotion={setSelectedPromotion}
                onPlanSelected={handlePlanSelected}
                onAudienceReach={(reach) => setTotalAudienceReach(reach)}
                onPlanStats={({ totalTokens, totalDJs }) => {
                  setTotalTokens(totalTokens);
                  setTotalDJs(totalDJs);
                }}
              />
            </div>

            {selectedPromotion && (
              <div className="w-full px-4 py-6 md:px-6 md:py-5 rounded-xl">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  {/* Actions (Automate + Start Over) */}
                  <div className="flex gap-3 order-1 md:order-1">
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
                      onChange={(e) =>
                        setStartDate(e.target.value.split("T")[0])
                      }
                    />
                  </div>

                  {/* Launch CTA */}
                  <button
                    className={`order-3 md:order-3 w-full md:w-auto px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold ${loadingCampaignCreation || !startDate || !campaignSongDetails?.artist ? "opacity-50 italic" : ""}`}
                    disabled={
                      loadingCampaignCreation ||
                      !startDate ||
                      !campaignSongDetails?.artist
                    }
                    onClick={handleCreateCampaignDraft}
                  >
                    {loadingCampaignCreation === true
                      ? "Loading..."
                      : "Create Campaign"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <Modal
          isOpen={editBeforeLaunchModal}
          onClose={() => setEditBeforeLaunchModal(!editBeforeLaunchModal)}
          maxWidth="lg:max-w-2xl"
        >
          <p className="pb-5 font-bold text-lg lg:text-2xl">Your Selection</p>

          <div>
            <PromotionGrid
              isModalPage={true}
              data={promotersData}
              selectedPromotion={selectedPromotion}
              setSelectedPromotion={setSelectedPromotion}
              onPlanSelected={handlePlanSelected}
              onAudienceReach={(reach) => setTotalAudienceReach(reach)}
              onPlanStats={({ totalTokens, totalDJs }) => {
                setTotalTokens(totalTokens);
                setTotalDJs(totalDJs);
              }}
            />
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
                className={`order-3 md:order-3 w-full md:w-auto px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold ${loadingCampaignCreation || !startDate || !campaignSongDetails?.artist ? "opacity-50 italic" : ""}`}
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

export default PromoterCampaign;
