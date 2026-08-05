"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  mdiArrowDownCircleOutline,
  mdiCalendarMonthOutline,
  mdiClose,
  mdiEmailOutline,
  mdiLoading,
  mdiMicrosoftExcel,
  mdiRefresh,
  mdiReload,
  mdiRestore,
  mdiSend,
} from "@mdi/js";
import MdiIcon, { Icon } from "@mdi/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { NotificationList } from "@/app/(dashboard)/campaigns/notifications/NotificationList";
import { DropsIcon } from "@/app/(dashboard)/sidebar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getDropZones, sendProjectEmail } from "@/services";
import type { NotificationByType } from "@/types/notifications";

type DockPanel = "refresh" | "drops" | "schedule" | "send" | "export";

interface BottomDockProps {
  contentId?: number | string;
  handleDownloadData?: () => void;
  handleRefresh?: () => void;
}

const panelTitle: Record<DockPanel, string> = {
  refresh: "Refresh insights",
  drops: "Drops",
  schedule: "Campaign schedule",
  send: "Send report",
  export: "Export report",
};

export function BottomDock({
  contentId,
  handleDownloadData,
  handleRefresh,
}: BottomDockProps) {
  const router = useRouter();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [activePanel, setActivePanel] = useState<DockPanel>("refresh");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const isDropsPanelOpen = popoverOpen && activePanel === "drops";
  const {
    data: dropZonesData,
    isLoading: dropZonesLoading,
    isError: dropZonesError,
    refetch: refetchDropZones,
  } = useQuery({
    queryKey: ["dropzones", 1, "", "", "", "", "", ""],
    queryFn: () => getDropZones({ page: 1 }),
    enabled: isDropsPanelOpen,
    staleTime: 60_000,
  });

  const dropNotifications = useMemo<NotificationByType<"Assets">[]>(
    () =>
      (dropZonesData?.results ?? []).map((drop) => {
        const uploader =
          [drop.first_name, drop.last_name].filter(Boolean).join(" ") ||
          drop.user?.user_profile?.fullname ||
          "Unknown user";

        return {
          id: drop.id,
          type: "Assets",
          icon: "",
          content: `New drop from ${uploader}: ${drop.folder_name || "Untitled folder"}`,
          actions: [
            { type: "Download", url: drop.link },
            { type: "Share", url: drop.link },
          ],
          created: drop.created,
          read: true,
        };
      }),
    [dropZonesData],
  );

  const selectPanel = (panel: DockPanel) => {
    if (popoverOpen && activePanel === panel) {
      setPopoverOpen(false);
      return;
    }

    setActivePanel(panel);
    setPopoverOpen(true);
  };

  const closePopover = () => setPopoverOpen(false);

  const handleSendEmail = async () => {
    if (!contentId || !email) return;

    setIsSending(true);
    const currentUrl =
      typeof window !== "undefined" ? window.location.href : "";

    try {
      const response = await sendProjectEmail(contentId, {
        email,
        url: currentUrl,
      });

      if (response) setEmail("");
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setIsSending(false);
    }
  };

  const refreshInsights = () => {
    if (handleRefresh) handleRefresh();
    else if (typeof window !== "undefined") window.location.reload();
    closePopover();
  };

  const openSchedule = () => {
    if (typeof document === "undefined") return;

    const schedule = document.getElementById("campaign-schedule");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    schedule?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
    closePopover();
  };

  const exportCsv = () => {
    handleDownloadData?.();
    closePopover();
  };

  const dockItems: Array<{
    id: DockPanel;
    label: string;
    icon: React.ReactNode;
    badge?: boolean;
  }> = [
    {
      id: "refresh",
      label: "Refresh insights",
      icon: <MdiIcon className="size-full" path={mdiRestore} />,
    },
    {
      id: "drops",
      label: "Open drops",
      icon: <DropsIcon className="size-full" />,
    },
    {
      id: "schedule",
      label: "Open campaign schedule",
      icon: <MdiIcon className="size-full" path={mdiCalendarMonthOutline} />,
      badge: true,
    },
    {
      id: "send",
      label: "Send report",
      icon: <MdiIcon className="size-full" path={mdiEmailOutline} />,
    },
    {
      id: "export",
      label: "Export CSV",
      icon: <MdiIcon className="size-full" path={mdiArrowDownCircleOutline} />,
    },
  ];

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <div className="fixed inset-x-0 bottom-7.5 z-30 flex justify-center lg:left-32">
        <PopoverAnchor asChild>
          <div
            ref={toolbarRef}
            aria-label="Campaign report actions"
            className="flex h-[60px] w-[calc(100vw-2rem)] max-w-[310px] items-center justify-between rounded-[9px] border border-zinc-200/90 bg-white/95 px-4 shadow-[0_8px_22px_rgba(0,0,0,0.08)] backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95"
            role="toolbar"
          >
            {dockItems.map((item) => {
              const isActive = popoverOpen && activePanel === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  aria-label={item.label}
                  aria-pressed={isActive}
                  className={`relative flex size-9 shrink-0 items-center justify-center rounded-md outline-none transition-[color,transform,background-color] duration-150 active:scale-[0.96] focus-visible:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-400/35 dark:focus-visible:bg-zinc-900 ${
                    isActive
                      ? "text-zinc-950 dark:text-zinc-50"
                      : "text-zinc-300 hover:text-zinc-500 dark:text-zinc-600 dark:hover:text-zinc-400"
                  }`}
                  onClick={() => selectPanel(item.id)}
                  title={item.label}
                >
                  <span className="flex size-7 items-center justify-center">
                    {item.icon}
                  </span>
                  {item.badge && (
                    <span
                      aria-hidden="true"
                      className="absolute top-0 right-0 size-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-950"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </PopoverAnchor>
      </div>

      <PopoverContent
        align="center"
        side="top"
        sideOffset={10}
        onInteractOutside={(event) => {
          const target = event.target;
          if (target instanceof Node && toolbarRef.current?.contains(target)) {
            event.preventDefault();
          }
        }}
        className={`w-[calc(100vw-2rem)] gap-0 overflow-hidden rounded-xl border-0 bg-white p-0 text-sm shadow-2xl ring-1 ring-zinc-950/10 dark:bg-zinc-950 dark:ring-white/10 ${
          activePanel === "drops" ? "max-w-85" : "max-w-[310px]"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
          <p className="text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase dark:text-zinc-400">
            {panelTitle[activePanel]}
          </p>
          <button
            type="button"
            aria-label="Close panel"
            className="flex size-8 items-center justify-center rounded-md text-zinc-400 outline-none transition-[color,transform,background-color] duration-150 hover:bg-zinc-100 hover:text-zinc-700 active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-zinc-400/35 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            onClick={closePopover}
          >
            <MdiIcon className="size-4" path={mdiClose} />
          </button>
        </div>

        {activePanel === "refresh" && (
          <div className="space-y-3 p-4">
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              Fetch the latest performance data for this campaign.
            </p>
            <button
              type="button"
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 text-sm font-semibold text-white outline-none transition-[background-color,transform] duration-150 hover:bg-zinc-800 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-zinc-500/35 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
              onClick={refreshInsights}
            >
              <MdiIcon className="size-4" path={mdiRefresh} />
              Refresh insights
            </button>
          </div>
        )}

        {activePanel === "drops" && (
          <div className="flex min-h-0 flex-col">
            <ScrollArea className="h-[min(46vh,360px)] min-h-48">
              <div className="text-sm text-muted-foreground">
                {dropZonesLoading && (
                  <p className="p-6 text-center text-neutral-500">
                    Loading drops…
                  </p>
                )}
                {dropZonesError && !dropZonesLoading && (
                  <div className="flex items-center justify-center gap-2 p-6 text-red-600">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => void refetchDropZones()}
                      aria-label="Reload drops"
                      title="Reload drops"
                      className="size-7 rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
                    >
                      <MdiIcon path={mdiReload} size={0.7} />
                    </Button>
                    <p>Drops could not be loaded.</p>
                  </div>
                )}
                {!dropZonesLoading && !dropZonesError && (
                  <NotificationList
                    notifications={dropNotifications}
                    emptyCategory="asset"
                  />
                )}
              </div>
            </ScrollArea>

            <div className="shrink-0 border-t border-neutral-100 px-4 py-3 dark:border-zinc-800">
              <Button
                type="button"
                className="h-9 w-full rounded-md bg-zinc-950 text-white hover:bg-orange-500 dark:bg-zinc-100 dark:text-zinc-950"
                onClick={() => router.push("/drops")}
              >
                View All Assets
              </Button>
            </div>
          </div>
        )}

        {activePanel === "schedule" && (
          <div className="space-y-3 p-4">
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              Jump to this campaign&apos;s calendar and scheduled activity.
            </p>
            <button
              type="button"
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 text-sm font-semibold text-white outline-none transition-[background-color,transform] duration-150 hover:bg-zinc-800 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-zinc-500/35 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
              onClick={openSchedule}
            >
              <MdiIcon className="size-4" path={mdiCalendarMonthOutline} />
              View schedule
            </button>
          </div>
        )}

        {activePanel === "send" && (
          <div className="p-4">
            <label className="sr-only" htmlFor="report-recipient-email">
              Recipient email
            </label>
            <div className="relative flex items-center">
              <input
                id="report-recipient-email"
                type="email"
                autoComplete="email"
                placeholder="hello@arroweye.pro"
                className="h-11 w-full rounded-lg border border-zinc-300 bg-white pr-12 pl-4 text-sm text-zinc-950 shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 disabled:opacity-70 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void handleSendEmail();
                }}
                disabled={isSending}
              />
              <button
                type="button"
                aria-label="Send report email"
                className="absolute right-1.5 flex size-8 items-center justify-center rounded-md bg-blue-600 text-white outline-none transition-[background-color,transform] duration-150 hover:bg-blue-700 active:scale-[0.95] focus-visible:ring-2 focus-visible:ring-blue-500/30 disabled:pointer-events-none disabled:opacity-50"
                onClick={() => void handleSendEmail()}
                disabled={isSending || !email}
              >
                {isSending ? (
                  <MdiIcon className="size-4 animate-spin" path={mdiLoading} />
                ) : (
                  <Icon className="size-4" path={mdiSend} />
                )}
              </button>
            </div>
          </div>
        )}

        {activePanel === "export" && (
          <div className="p-4">
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-left outline-none transition-[border-color,background-color,transform] duration-150 hover:border-emerald-300 hover:bg-emerald-50 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-emerald-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30"
              onClick={exportCsv}
              disabled={!handleDownloadData}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                <Icon className="size-5" path={mdiMicrosoftExcel} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Download CSV
                </span>
                <span className="mt-0.5 block text-xs text-zinc-500 dark:text-zinc-400">
                  Export campaign insight data
                </span>
              </span>
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
