"use client";

import React, { useState, useMemo } from "react";
import Icon from "@mdi/react";
import {
  mdiCalendarOutline,
  mdiCheckCircle,
  mdiAlertCircle,
  mdiDiscAlert,
  mdiMapMarkerRadiusOutline,
  mdiMapMarkerOutline,
  mdiTrashCanOutline,
  mdiMagnify,
  mdiFlash,
  mdiReload,
  mdiCart,
  mdiMusic,
} from "@mdi/js";
import { format } from "date-fns";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ClusterGrid } from "@/components/campaigns/Clustergrid";
import DJCard, { DJCardSkeleton } from "@/components/campaigns/dj-card";
import AutomateClusterModal from "@/components/campaigns/AutomateClusterModal";
import Link from "next/link";
import { useCustomSetup } from "../../../../../hooks/use-custom-setup";
import { CampaignStats } from "../../_components/campaign-stats";
import { cn } from "@/lib/utils";

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

  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  const hasSelectedDistricts = Object.keys(selectedDistricts).length > 0;
  const isReadyToCreate =
    !loadingCampaignCreation &&
    hasSelectedDistricts &&
    Boolean(startDate) &&
    Boolean(campaignSongDetails?.artist) &&
    reachValue > 0;

  const parsedStartDate = useMemo(() => {
    if (!startDate) return undefined;
    const d = new Date(startDate + "T00:00:00");
    return isNaN(d.getTime()) ? undefined : d;
  }, [startDate]);

  return (
    <>
      <div className="h-max py-7 bg-transparent text-gray-950 dark:text-foreground">
        {/* Stepper Navigation */}
        <div className="flex justify-center items-center gap-3 mb-7 text-sm font-medium">
          <Link
            href="/campaigns/setup"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Set Budget
          </Link>
          <div className="h-px w-8 bg-border" />
          <span className="text-foreground font-semibold">Launch Campaign</span>
        </div>

        <Card className="mx-4 sm:mx-6 rounded-xl border-0 bg-transparent py-0 shadow-none">
          <CardContent className="px-2 sm:px-6 lg:px-10 py-6 space-y-8">
            {/* Song ISRC Input & Preview */}
            <div className="space-y-3">
              <div className="relative">
                <Input
                  value={isrc}
                  className="h-12 text-sm border-border bg-card dark:bg-card/50 pl-4 pr-10"
                  type="text"
                  placeholder="Enter ISRC or UPC (e.g. USRC17607839)"
                  onChange={(e) => setIsrc(e.target.value)}
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center">
                  {loadingCampaignSong || isIsrcValidating ? (
                    <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  ) : (
                    <Icon path={mdiMusic} size={0.7} className="text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Status and Feedback Messages */}
              {(loadingCampaignSong || isIsrcValidating) && (
                <p className="text-xs italic text-muted-foreground">
                  {isIsrcValidating ? "Validating code..." : "Loading song details..."}
                </p>
              )}

              {!loadingCampaignSong && !isIsrcValidating && validationError && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-destructive">
                  <Icon path={mdiAlertCircle} size={0.65} />
                  <span>{validationError}</span>
                </div>
              )}

              {!loadingCampaignSong &&
                !isIsrcValidating &&
                !validationError &&
                campaignSongDetails?.error && (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-destructive">
                    <Icon path={mdiAlertCircle} size={0.65} />
                    <span>{campaignSongDetails?.error}</span>
                  </div>
                )}

              {!loadingCampaignSong &&
                !isIsrcValidating &&
                !validationError &&
                campaignSongDetails?.artist &&
                campaignSongDetails?.title && (
                  <div
                    title={`${campaignSongDetails?.artist} - ${campaignSongDetails?.title}`}
                    className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium"
                  >
                    <Icon path={mdiCheckCircle} size={0.7} className="shrink-0" />
                    <span className="truncate">
                      <strong>{campaignSongDetails?.artist}</strong> — {campaignSongDetails?.title}
                    </span>
                  </div>
                )}
            </div>

            {/* Campaign Stats Sticky Header */}
            <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm py-2">
              <CampaignStats
                availableTokens={walletDetails?.available_balance || 0}
                allocatedTokens={totalTokens}
                selectedDjs={totalDJs}
              />
            </div>

            {/* Clusters Selector Grid */}
            <div className="pt-2">
              <ClusterGrid
                clusters={clusters}
                activeDistricts={activeDistrictIds}
                onDistrictClick={handleDistrictClick}
              />
            </div>

            {/* DJ Search Input */}
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                <Icon path={mdiMagnify} size={0.8} className="text-muted-foreground" />
              </div>
              <Input
                className="h-11 pl-10 border-border bg-card dark:bg-card/50"
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

            {/* District DJ Selection Lists */}
            <div className="space-y-8">
              {Object.entries(selectedDistricts).map(([districtIdStr, entry]) => {
                const districtId = Number(districtIdStr);
                return (
                  <div key={districtId} className="space-y-4 rounded-xl bg-muted/20 border border-border/50 p-4 sm:p-5">
                    {/* District Header */}
                    <div className="flex items-center justify-between gap-3 pb-2 border-b border-border/60">
                      <div className="flex items-center gap-2">
                        <Icon path={mdiMapMarkerOutline} size={0.75} className="text-primary shrink-0" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                          {entry.name}
                        </h3>
                        <Badge variant="secondary" className="text-[11px] font-semibold">
                          {entry.djs.length} {entry.djs.length === 1 ? "DJ" : "DJs"}
                        </Badge>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDistrictClick(0, districtId, entry.name)}
                        className="h-8 text-xs text-muted-foreground hover:text-destructive gap-1.5"
                      >
                        <Icon path={mdiTrashCanOutline} size={0.65} />
                        <span className="hidden sm:inline">Remove District</span>
                      </Button>
                    </div>

                    {/* District DJ Cards Grid or Skeleton Loading */}
                    {entry.loading ? (
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <DJCardSkeleton />
                        <DJCardSkeleton />
                      </div>
                    ) : entry.djs.length > 0 ? (
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {entry.djs.map((dj) => {
                          const spinKey = `${districtId}-${dj.id}`;

                          return (
                            <DJCard
                              key={spinKey}
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
                              onRemove={() => removeDj(districtId, dj.id)}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-10 rounded-xl border border-dashed border-border bg-card/30">
                        <div className="flex justify-center mb-2">
                          <Icon path={mdiDiscAlert} size={1.6} className="text-muted-foreground/40" />
                        </div>
                        <p className="text-sm font-semibold text-foreground">
                          No DJs found in {entry.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                          Try searching with a different name or select another district.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}

              {!hasSelectedDistricts && (
                <div className="text-center py-14 rounded-xl border border-dashed border-border bg-card/40">
                  <div className="flex justify-center mb-3">
                    <Icon path={mdiMapMarkerRadiusOutline} size={1.8} className="text-muted-foreground/40" />
                  </div>
                  <h4 className="text-base font-semibold text-foreground">
                    No Districts Selected
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                    Click on any district pill in the clusters section above to load available DJs for your campaign.
                  </p>
                </div>
              )}
            </div>

            {/* Audience Reach Bar */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="uppercase tracking-wider text-muted-foreground">
                  Estimated Audience Reach
                </span>
                <span className="text-foreground font-mono font-bold">
                  {reachPercentage.toFixed(1)}% of goal
                </span>
              </div>
              <Progress value={reachPercentage} aria-label="Audience reach" className="h-2.5" />
              {totalAudienceReach && (
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Target: {Number(totalAudienceReach).toLocaleString()} reach</span>
                  <span className="font-semibold text-foreground">
                    {reachValue.toLocaleString()} reached
                  </span>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                {/* Actions (Automate + Start Over) */}
                <div className="flex gap-2.5 order-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 flex-1 md:flex-none gap-2 border-border"
                    disabled={true}
                    onClick={() => setShowAutomateModal(true)}
                  >
                    <Icon path={mdiFlash} size={0.75} className="text-purple-500" />
                    Automate
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    className="h-11 flex-1 md:flex-none gap-2"
                    onClick={startOver}
                  >
                    <Icon path={mdiReload} size={0.75} />
                    Start Over
                  </Button>
                </div>

                {/* Date Picker using Popover + Calendar */}
                <div className="flex flex-col order-2 w-full md:w-auto space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Icon path={mdiCalendarOutline} size={0.65} />
                    Start Date
                  </label>
                  <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full md:w-[240px] h-11 justify-start text-left font-normal border-border bg-card dark:bg-card/50",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <Icon path={mdiCalendarOutline} size={0.75} className="mr-2 text-muted-foreground" />
                        {parsedStartDate ? (
                          format(parsedStartDate, "PPP")
                        ) : (
                          <span>Pick a start date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={parsedStartDate}
                        onSelect={(date) => {
                          if (date) {
                            setStartDate(format(date, "yyyy-MM-dd"));
                          } else {
                            setStartDate("");
                          }
                          setDatePopoverOpen(false);
                        }}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Launch CTA */}
                <Button
                  type="button"
                  className="order-3 h-11 w-full md:w-auto px-6 font-semibold"
                  disabled={!isReadyToCreate}
                  onClick={handleCreateCampaignDraft}
                >
                  {loadingCampaignCreation && (
                    <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  )}
                  {loadingCampaignCreation ? "Creating Campaign..." : "Create Campaign"}
                </Button>
              </div>
            </div>

            {/* Review Floating Action Button */}
            {hasSelectedDistricts && hasCreatedDraft && (
              <div className="flex justify-end pt-4">
                <Button
                  type="button"
                  size="icon-lg"
                  className="size-16 rounded-full bg-primary text-primary-foreground shadow-lg hover:opacity-90 transition-all hover:scale-105"
                  disabled={!campaignSongDetails?.artist || !hasSelectedDistricts}
                  onClick={() => setEditBeforeLaunchModal(true)}
                >
                  <Icon path={mdiCart} size={1} />
                  <span className="sr-only">Review & Launch Campaign</span>
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

      {/* Review & Launch Dialog */}
      <Dialog
        open={editBeforeLaunchModal}
        onOpenChange={setEditBeforeLaunchModal}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Review Campaign Selection</DialogTitle>
            <DialogDescription>
              Review your selected DJs and token allocations before launching.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 my-2">
            {Object.entries(selectedDistricts).map(([districtIdStr, entry]) => {
              const districtId = Number(districtIdStr);
              return (
                <div key={districtId} className="space-y-3">
                  <div className="flex items-center gap-2 pb-1 border-b border-border">
                    <Icon path={mdiMapMarkerOutline} size={0.7} className="text-primary" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {entry.name}
                    </h4>
                  </div>

                  {entry.djs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {entry.djs.map((dj) => {
                        const spinKey = `${districtId}-${dj.id}`;

                        return (
                          <DJCard
                            key={spinKey}
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
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-center py-4 text-xs text-muted-foreground">
                      No DJs selected
                    </p>
                  )}
                </div>
              );
            })}

            {!hasSelectedDistricts && (
              <p className="text-center py-6 text-xs text-muted-foreground">
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

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              className="h-10 w-full sm:w-auto font-semibold"
              disabled={
                loadingCampaignCreation ||
                !hasSelectedDistricts ||
                !startDate ||
                !campaignSongDetails?.artist
              }
              onClick={handleLaunchCampaign}
            >
              {loadingCampaignCreation && (
                <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
              )}
              {loadingCampaignCreation ? "Launching..." : "Launch Campaign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomCampaign;
