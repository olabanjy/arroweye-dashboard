"use client";

import React, { useEffect, useState } from "react";
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
import { PromotionGrid } from "@/components/campaigns/PromotionGrid";
import {
  BadgeCheck,
  CalendarDays,
  LoaderCircle,
  RefreshCcw,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { usePromoterSetup } from "../../../../../hooks/use-promoter-setup";
import { CampaignStats } from "../../_components/campaign-stats";
import { useAuth } from "@/context/auth-session";
import {
  CampaignEmailField,
  isValidCampaignEmail,
} from "@/components/campaigns/campaign-email-field";
import { InsufficientTokensDialog } from "@/components/campaigns/insufficient-tokens-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const PromoterCampaign = () => {
  const {
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
    promotersData,
    walletDetails,
    refetchWallet,
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
  } = usePromoterSetup();

  const { user, userProfile } = useAuth();
  const [email, setEmail] = useState("");
  const [topUpDialogOpen, setTopUpDialogOpen] = useState(false);
  const [checkedWalletBalance, setCheckedWalletBalance] = useState(0);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  useEffect(() => {
    const accountEmail = user?.email || userProfile?.staff_email;
    if (accountEmail) setEmail((currentEmail) => currentEmail || accountEmail);
  }, [user?.email, userProfile?.staff_email]);

  const isEmailValid = isValidCampaignEmail(email);
  const parsedStartDate = startDate
    ? new Date(`${startDate}T00:00:00`)
    : undefined;

  const handleCreateCampaign = async () => {
    const walletResult = await refetchWallet();
    const availableTokens =
      Number(
        walletResult.data?.available_balance ??
          walletDetails?.available_balance,
      ) || 0;

    setCheckedWalletBalance(availableTokens);

    if (totalTokens > availableTokens) {
      setTopUpDialogOpen(true);
      return;
    }

    await handleCreateCampaignDraft();
  };

  return (
    <>
      <div className="py-7 text-gray-950 dark:text-foreground">
        <div className="flex justify-center items-center gap-2 mb-7">
          <Link href="/campaigns/setup/launch">
            <p className="text-[#A3A3A3] dark:text-muted-foreground">
              Campaign Type
            </p>
          </Link>
          <div className="h-[1px] w-8 bg-[#A3A3A3] dark:bg-border" />
          <p>Launch Campaign</p>
        </div>

        <Card className="mx-5 border-none py-0 shadow-none">
          <CardContent className="px-5 py-8 lg:px-14">
            <CampaignEmailField email={email} onChange={setEmail} />

            <div className="mt-6 grid grid-cols-1 items-center gap-[20px]">
              <div className="relative">
                <Input
                  value={isrc}
                  className="border-[#9D9A9A]"
                  type="text"
                  placeholder="ISRC / UPC"
                  disabled={!isEmailValid}
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

            <div className="sticky top-0 z-30 mt-8 bg-card py-px">
              <div className="mt-10">
                <CampaignStats
                  availableTokens={walletDetails?.available_balance || 0}
                  allocatedTokens={totalTokens}
                  selectedDjs={totalDJs}
                />
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
                      handleSearch();
                    }
                  }}
                />
              </div>
              <PromotionGrid
                data={promotersData}
                selectedPromotion={selectedPromotion}
                setSelectedPromotion={setSelectedPromotion}
                resetPlan={resetPlan}
                onPlanSelected={handlePlanSelected}
                onAudienceReach={(reach) => setTotalAudienceReach(reach)}
                onPlanStats={({ totalTokens, totalDJs }) => {
                  setTotalTokens(totalTokens);
                  setTotalDJs(totalDJs);
                }}
              />
            </div>

            {selectedPromotion && campaignPayload && (
              <div className="w-full px-4 py-6 md:px-6 md:py-5 rounded-xl">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  {/* Actions (Automate + Start Over) */}
                  <div className="flex gap-3 order-1 md:order-1">
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

                  {/* Date Picker using Popover + Calendar */}
                  <div className="order-2 flex w-full flex-col space-y-1.5 md:w-auto">
                    <label className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      <CalendarDays className="size-3.5" />
                      Start Date
                    </label>
                    <Popover
                      open={datePopoverOpen}
                      onOpenChange={setDatePopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "h-11 w-full justify-start border-border bg-card text-left font-normal md:w-[240px] dark:bg-card/50",
                            !startDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarDays className="mr-2 size-4 text-muted-foreground" />
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
                            setStartDate(
                              date ? format(date, "yyyy-MM-dd") : "",
                            );
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
                    className="order-3 h-11 w-full md:w-auto"
                    disabled={
                      loadingCampaignCreation ||
                      !isEmailValid ||
                      !startDate ||
                      !campaignSongDetails?.artist ||
                      !totalAudienceReach
                    }
                    onClick={handleCreateCampaign}
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
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={editBeforeLaunchModal}
        onOpenChange={setEditBeforeLaunchModal}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Your Selection</DialogTitle>
            <DialogDescription>
              Review the promotion plan and token allocation before launching.
            </DialogDescription>
          </DialogHeader>

          <div>
            <PromotionGrid
              isModalPage={true}
              isOnModal={true} // add this
              data={promotersData}
              selectedPromotion={selectedPromotion}
              setSelectedPromotion={setSelectedPromotion}
              onPlanSelected={handlePlanSelected}
              onAudienceReach={(reach) => console.log(reach)}
              onPlanStats={({ totalTokens, totalDJs }) => {
                setTotalTokens(totalTokens);
                setTotalDJs(totalDJs);
              }}
            />
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

      <InsufficientTokensDialog
        open={topUpDialogOpen}
        onOpenChange={setTopUpDialogOpen}
        availableTokens={checkedWalletBalance}
        requiredTokens={totalTokens}
      />
    </>
  );
};

export default PromoterCampaign;
