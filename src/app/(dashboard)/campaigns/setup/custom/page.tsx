"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ClusterGrid } from "@/components/campaigns/Clustergrid";
import DJCard from "@/components/campaigns/Djcard";
import {
  BadgeCheck,
  LoaderCircle,
  RefreshCcw,
  ShoppingCart,
  X,
  Zap,
} from "lucide-react";
import AutomateClusterModal from "@/components/campaigns/AutomateClusterModal";
import Link from "next/link";
import { useCustomSetup } from "../../../../../hooks/use-custom-setup";
import { CampaignStats } from "../../_components/campaign-stats";

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
      <div className="h-max py-7 bg-transparent text-gray-950 dark:text-foreground">
        <div className="flex justify-center items-center gap-2 mb-7">
          <Link href="/campaigns/setup">
            <p className="text-[#A3A3A3] dark:text-muted-foreground">
              Set Budget
            </p>
          </Link>
          <div className="h-[1px] w-8 bg-[#A3A3A3] dark:bg-border" />
          <p>Launch Campaign</p>
        </div>

        <Card className="mx-5 rounded-lg border-0 bg-transparent py-0 shadow-none">
          <CardContent className="px-5 py-8 lg:px-14">
            <div className="grid grid-cols-1 gap-[20px] items-center">
              <div className="relative">
                <Input
                  value={isrc}
                  className="border-[#9D9A9A] dark:bg-transparent"
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
            <div className="sticky top-0 z-30 mt-8 bg-background py-px">
              <div className="mt-10">
                <CampaignStats
                  availableTokens={walletDetails?.available_balance || 0}
                  allocatedTokens={totalTokens}
                  selectedDjs={totalDJs}
                />
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
                className="border-[#9D9A9A] dark:bg-transparent"
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
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 dark:text-muted-foreground">
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

                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() => removeDj(districtId, dj.id)}
                                className="absolute right-3 top-1 text-muted-foreground hover:text-destructive sm:top-3"
                                aria-label="Remove DJ"
                              >
                                <X />
                              </Button>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-center py-5 text-gray-500 dark:text-muted-foreground">
                          No DJs found
                        </p>
                      )}
                    </div>
                  );
                },
              )}

              {Object.keys(selectedDistricts).length === 0 && (
                <p className="text-center py-5 text-gray-600 dark:text-muted-foreground">
                  No Districts Selected
                </p>
              )}
            </div>

            <div className="mt-10 flex flex-col gap-2">
              <p>Audience Reach</p>
              <Progress value={reachPercentage} aria-label="Audience reach" />
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
                  <Button
                    type="button"
                    className="h-11 flex-1 md:flex-none"
                    disabled={true}
                    onClick={() => setShowAutomateModal(true)}
                  >
                    <Zap />
                    Automate
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    className="h-11 flex-1 md:flex-none"
                    onClick={startOver}
                  >
                    <RefreshCcw />
                    Start Over
                  </Button>
                </div>

                {/* Date Input */}
                <div className="flex flex-col order-2 md:order-2 w-full md:w-auto">
                  <label className="text-xs font-semibold tracking-wide text-gray-600 mb-1 md:mb-2 dark:text-muted-foreground">
                    START DATE
                  </label>
                  <Input
                    type="datetime-local"
                    name="startDate"
                    value={startDate}
                    placeholder="01/01/2034"
                    className="w-full md:w-[260px] dark:bg-transparent"
                    onChange={(e) => setStartDate(e.target.value.split("T")[0])}
                  />
                </div>

                {/* Launch CTA */}
                <Button
                  type="button"
                  className="order-3 h-11 w-full md:w-auto"
                  disabled={
                    loadingCampaignCreation ||
                    Object.keys(selectedDistricts).length === 0 ||
                    !startDate ||
                    !campaignSongDetails?.artist ||
                    !reachValue
                  }
                  onClick={handleCreateCampaignDraft}
                >
                  {loadingCampaignCreation && (
                    <LoaderCircle className="animate-spin" />
                  )}
                  {loadingCampaignCreation === true
                    ? "Loading..."
                    : "Create Campaign"}
                </Button>
              </div>
            </div>

            {Object.keys(selectedDistricts).length !== 0 && hasCreatedDraft && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  size="icon-lg"
                  className="mt-10 size-20 rounded-full bg-[#CAFF00] text-black hover:bg-[#b6e600]"
                  disabled={
                    !campaignSongDetails?.artist ||
                    Object.keys(selectedDistricts).length === 0
                  }
                  onClick={() => {
                    if (Object.keys(selectedDistricts).length !== 0)
                      setEditBeforeLaunchModal(true);
                  }}
                >
                  <ShoppingCart className="size-7" />
                  <span className="sr-only">Review campaign</span>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {showAutomateModal && (
        <AutomateClusterModal
          clusters={clusters}
          activeDistricts={activeDistrictIds}
          onDistrictClick={handleDistrictClick}
        />
      )}

      <Dialog
        open={editBeforeLaunchModal}
        onOpenChange={setEditBeforeLaunchModal}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Your Selection</DialogTitle>
            <DialogDescription>
              Review the DJs and token allocation before launching this
              campaign.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-5">
            {Object.entries(selectedDistricts).map(([districtIdStr, entry]) => {
              const districtId = Number(districtIdStr);
              return (
                <div key={districtId}>
                  {/* District label */}
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 dark:text-muted-foreground">
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
                    <p className="text-center py-5 text-gray-500 dark:text-muted-foreground">
                      No DJs found
                    </p>
                  )}
                </div>
              );
            })}

            {Object.keys(selectedDistricts).length === 0 && (
              <p className="text-center py-5 text-gray-600 dark:text-muted-foreground">
                No Districts Selected
              </p>
            )}
          </div>

          <CampaignStats
            availableTokens={walletDetails?.available_balance || 0}
            allocatedTokens={totalTokens}
            selectedDjs={totalDJs}
            compact
          />

          <DialogFooter>
            <Button
              type="button"
              className="h-10 w-full sm:w-auto"
              disabled={
                loadingCampaignCreation ||
                Object.keys(selectedDistricts).length === 0 ||
                !startDate ||
                !campaignSongDetails?.artist
              }
              onClick={handleLaunchCampaign}
            >
              {loadingCampaignCreation && (
                <LoaderCircle className="animate-spin" />
              )}
              {loadingCampaignCreation === true
                ? "Loading..."
                : "Launch Campaign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomCampaign;
