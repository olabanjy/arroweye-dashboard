import React from "react";
import DashboardLayout from "@/pages/dashboard/layout";
import Head from "next/head";
import { Input } from "@/components/ui/input";
import { ClusterGrid } from "@/components/campaigns/Clustergrid";
import DJCard from "@/components/campaigns/Djcard";
import { BadgeCheck, RefreshCcw, Zap } from "lucide-react";
import AutomateClusterModal from "@/components/campaigns/AutomateClusterModal";
import Link from "next/link";
import Image from "next/image";
import Modal from "@/pages/component/Modal";
import { useCustomSetup } from "../../../../hooks/use-custom-setup";

const CustomCampaign = () => {
  const {
    editBeforeLaunchModal,
    setEditBeforeLaunchModal,
    loadingCampaignSong,
    campaignSongDetails,
    clusters,
    walletDetails,
    selectedClusterId,
    search,
    setSearch,
    djSpins,
    setDjSpins,
    selectedDistricts,
    isrc,
    setIsrc,
    validationError,
    isIsrcValid,
    isIsrcValidating,
    totalDJs,
    totalTokens,
    totalAudienceReach,
    reachValue,
    reachPercentage,
    activeDistrictIds,
    handleDistrictClick,
    removeDj,
    activePlaceholder,
    fetchDjs,
    showAutomateModal,
    setShowAutomateModal,
    loadingCampaignCreation,
    startDate,
    setStartDate,
    handleCreateCampaignDraft,
    handleLaunchCampaign,
    startOver,
    hasCreatedDraft,
  } = useCustomSetup();

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
                  className="border-[#9D9A9A]"
                  type="text"
                  placeholder="ISRC / UPC"
                  onChange={(e) => setIsrc(e.target.value)}
                />
                {(loadingCampaignSong || isIsrcValidating) && (
                  <span className="italic absolute top-14 text-sm mt-2 truncate w-full block">
                    {isIsrcValidating
                      ? "Validating code..."
                      : "Loading Song...."}
                  </span>
                )}
                {!loadingCampaignSong &&
                  !isIsrcValidating &&
                  validationError && (
                    <p className="absolute top-14 text-sm mt-2 text-red-500 truncate w-full">
                      {validationError}
                    </p>
                  )}
                {!loadingCampaignSong &&
                  !isIsrcValidating &&
                  !validationError &&
                  campaignSongDetails?.error && (
                    <p className="absolute top-14 text-sm mt-2 text-red-500 truncate w-full">
                      {campaignSongDetails?.error}
                    </p>
                  )}
                {!loadingCampaignSong &&
                  !isIsrcValidating &&
                  !validationError &&
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
                <p className="text-right">
                  {reachValue.toLocaleString()} of{" "}
                  {totalAudienceReach?.toLocaleString()}
                </p>
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
                disabled={
                  loadingCampaignCreation ||
                  Object.keys(selectedDistricts).length === 0 ||
                  !startDate ||
                  !campaignSongDetails?.artist
                }
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
