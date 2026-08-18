"use client";

import React from "react";
import Icon from "@mdi/react";
import {
  mdiStar,
  mdiStarOutline,
  mdiMapMarkerOutline,
  mdiHandCoinOutline,
  mdiClose,
  mdiDisc,
  mdiAccountGroupOutline,
  mdiMinus,
  mdiPlus,
  mdiHelpCircleOutline,
} from "@mdi/js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface DJCardProps {
  id: string | number;
  name: string;
  location: string;
  topLocations?: { name: string; href: string }[];
  campaignsCompleted: number;
  audienceReach: string | number;
  rating: number;
  tokensPerSpin: number;
  initialSpins?: number;
  spins: number;
  onSpinsChange: (value: number) => void;
  isOnModal?: boolean;
  onRemove?: () => void;
}

function StarRating({ rating }: { rating: number }) {
  const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < Math.floor(safeRating);
          return (
            <Icon
              key={i}
              path={filled ? mdiStar : mdiStarOutline}
              size={0.65}
              className={
                filled
                  ? "text-amber-400"
                  : "text-muted-foreground/30"
              }
            />
          );
        })}
      </div>
      <span className="text-xs font-semibold text-muted-foreground ml-1">
        {safeRating.toFixed(1)}
      </span>
    </div>
  );
}

export function DJCardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-5 w-36 rounded-md" />
          <Skeleton className="h-3.5 w-24 rounded-md" />
        </div>
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>

      {/* Details & Performance Stats */}
      <div className="my-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-20 rounded-md" />
          <Skeleton className="h-4 w-36 rounded-md" />
        </div>
        <div className="flex items-center gap-1.5 pt-0.5">
          <Skeleton className="h-4 w-14 rounded-md" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </div>

      {/* Spin Allocator Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-border bg-muted/30 dark:bg-zinc-900/60 p-3.5">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-3 w-32 rounded-md" />
        </div>
        <div className="flex items-center gap-2.5 self-end sm:self-center">
          <Skeleton className="w-16 h-11 rounded-xl" />
          <Skeleton className="size-11 rounded-full" />
          <Skeleton className="size-11 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function DJCard({
  name = "DJ Neptune",
  location = "Lagos - Island",
  topLocations = [],
  campaignsCompleted = 0,
  audienceReach = "0",
  rating = 5,
  tokensPerSpin = 10,
  spins = 0,
  onSpinsChange,
  isOnModal = false,
  onRemove,
}: DJCardProps) {
  const formattedReach =
    typeof audienceReach === "number"
      ? audienceReach.toLocaleString()
      : Number(String(audienceReach).replace(/,/g, ""))
        ? Number(String(audienceReach).replace(/,/g, "")).toLocaleString()
        : audienceReach || "0";

  const totalCost = spins * tokensPerSpin;

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/40 hover:shadow-sm">
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            {location && (
              <>
                <Icon path={mdiMapMarkerOutline} size={0.6} className="shrink-0 text-muted-foreground" />
                <span className="truncate">{location || "Unknown Location"}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Badge
            variant="outline"
            className="border-border bg-transparent text-muted-foreground dark:border-white/20 dark:text-gray-200 font-medium text-xs px-2.5 py-1 shrink-0 gap-1"
          >
            <Icon path={mdiHandCoinOutline} size={0.55} className="shrink-0 opacity-70" />
            {tokensPerSpin} tokens / spin
          </Badge>

          {onRemove && !isOnModal && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mr-1"
              aria-label={`Remove ${name}`}
            >
              <Icon path={mdiClose} size={0.7} />
            </Button>
          )}
        </div>
      </div>

      {/* Details & Performance Stats */}
      <div className="my-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <StarRating rating={rating} />
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Icon path={mdiDisc} size={0.65} className="text-primary" />
              <strong className="font-semibold text-foreground">
                {campaignsCompleted}
              </strong>{" "}
              campaigns
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Icon path={mdiAccountGroupOutline} size={0.65} className="text-primary" />
              <strong className="font-semibold text-foreground">
                {formattedReach}
              </strong>{" "}
              reach
            </span>
          </div>
        </div>

        {/* Top Locations / Venues */}
        {topLocations && topLocations.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-xs font-medium text-muted-foreground mr-0.5">
              Hotspots:
            </span>
            {topLocations.slice(0, 3).map((loc, idx) => (
              <Badge
                key={`${loc.name}-${idx}`}
                variant="secondary"
                className="text-[11px] font-normal px-2 py-0.5 max-w-[180px] truncate"
              >
                {loc.name}
              </Badge>
            ))}
            {topLocations.length > 3 && (
              <span className="text-[11px] text-muted-foreground">
                +{topLocations.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Total Spins Allocator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-border bg-muted/30 dark:bg-zinc-900/60 p-3.5">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              Total Spins
            </span>
            {!isOnModal && (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="size-4 rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/30 text-muted-foreground hover:text-foreground flex items-center justify-center text-[10px] font-bold transition-colors cursor-pointer"
                      aria-label="Spin counter help"
                    >
                      <Icon path={mdiHelpCircleOutline} size={0.55} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">
                    Set how many spins to allocate to {name}. Total token cost
                    is calculated as spins × tokens per spin.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <span className="text-[11px] text-muted-foreground">
            Cost:{" "}
            <strong className="font-semibold text-foreground">
              {totalCost} tokens
            </strong>{" "}
            ({tokensPerSpin}/spin)
          </span>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-center">
          {isOnModal ? (
            <div className="flex items-center justify-center min-w-16 h-10 px-3 rounded-xl border border-border bg-background font-mono text-base font-bold text-foreground">
              {spins}
            </div>
          ) : (
            <>
              {/* Value Input */}
              <input
                type="number"
                min={0}
                value={spins}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  onSpinsChange(isNaN(val) || val < 0 ? 0 : val);
                }}
                className="w-16 h-11 rounded-xl border border-border bg-background dark:bg-zinc-950 text-center font-mono text-lg font-bold text-foreground shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                aria-label={`Spins for ${name}`}
              />

              {/* Circular Red Minus Button */}
              <button
                type="button"
                disabled={spins <= 0}
                onClick={() => onSpinsChange(Math.max(0, spins - 1))}
                className="size-11 rounded-full bg-[#FF334B] hover:bg-[#E0263D] active:scale-95 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-white shadow-xs transition-all cursor-pointer"
                aria-label="Decrease spins"
              >
                <Icon path={mdiMinus} size={0.9} className="text-white" />
              </button>

              {/* Circular Green Plus Button */}
              <button
                type="button"
                onClick={() => onSpinsChange(spins + 1)}
                className="size-11 rounded-full bg-[#00C853] hover:bg-[#00B048] active:scale-95 flex items-center justify-center text-white shadow-xs transition-all cursor-pointer"
                aria-label="Increase spins"
              >
                <Icon path={mdiPlus} size={0.9} className="text-white" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
