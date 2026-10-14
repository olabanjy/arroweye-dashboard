"use client";

import { ArrowDown, ArrowUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { PlatformGrowth } from "@/lib/music-analytics/artist/follower-growth";
import { cn } from "@/lib/utils";
import { compactNumber } from "./format";
import type { ArtistPlatformStats } from "./hooks/use-artist-profile";
import { PLATFORM_COLORS, PLATFORM_ICONS } from "./platform-brand";

interface ArtistStatsGridProps {
  platforms: ArtistPlatformStats[];
  growth?: Record<string, PlatformGrowth>;
  growthDays: number;
  growthLoading?: boolean;
  loading?: boolean;
}

const percentFormat = new Intl.NumberFormat("en", {
  maximumFractionDigits: 1,
});

/** Followers gained over the chart's selected period. */
function GrowthDelta({
  growth,
  days,
}: {
  growth: PlatformGrowth;
  days: number;
}) {
  const isUp = growth.gained > 0;
  const isDown = growth.gained < 0;
  const Arrow = isDown ? ArrowDown : ArrowUp;
  const sign = isUp ? "+" : "";

  return (
    <p
      className={cn(
        "flex items-center gap-1 text-xs font-medium tabular-nums",
        isUp && "text-green-600 dark:text-green-500",
        isDown && "text-red-500",
        !isUp && !isDown && "text-muted-foreground",
      )}
      title={`${sign}${growth.gained.toLocaleString()} in the last ${days} days`}
    >
      {(isUp || isDown) && <Arrow className="size-3" />}
      {sign}
      {compactNumber.format(growth.gained)}
      {growth.percent !== null && (
        <span>({percentFormat.format(Math.abs(growth.percent))}%)</span>
      )}
      <span className="font-normal text-muted-foreground">· {days}d</span>
    </p>
  );
}

// On these networks views count videos made with the artist's music, not
// views of the artist's own posts.
const UGC_VIEW_PLATFORMS = new Set(["instagram", "tiktok"]);

const viewsLabel = (code: string) =>
  UGC_VIEW_PLATFORMS.has(code) ? "Views on videos using their music" : "Views";

/** The figure each platform is best known by, after its follower count. */
const readSecondary = (platform: ArtistPlatformStats) => {
  if (platform.monthlyListeners !== null)
    return { label: "Monthly listeners", value: platform.monthlyListeners };
  if (platform.views !== null)
    return { label: viewsLabel(platform.code), value: platform.views };
  if (platform.streams !== null)
    return { label: "Streams", value: platform.streams };
  if (platform.playlistReach !== null)
    return { label: "Playlist reach", value: platform.playlistReach };
  return null;
};

const followerLabel = (platform: ArtistPlatformStats) => {
  if (platform.followers === null) return "No linked account";
  return platform.code === "youtube" ? "Subscribers" : "Followers";
};

export function ArtistStatsGrid({
  platforms,
  growth = {},
  growthDays,
  growthLoading = false,
  loading = false,
}: ArtistStatsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-[10px] md:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton key={index} className="h-[120px] rounded-[8px]" />
        ))}
      </div>
    );
  }

  if (platforms.length === 0) {
    return (
      <div className="flex h-[120px] items-center justify-center rounded-[8px] border border-dashed font-SansFlex text-[14px] text-muted-foreground">
        No platform stats for this artist yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-[10px] md:grid-cols-4">
      {platforms.map((platform) => {
        const secondary = readSecondary(platform);
        const Icon = PLATFORM_ICONS[platform.code];
        return (
          <Card
            key={platform.code}
            className="gap-0 rounded-[8px] p-[20px] shadow-none font-SansFlex bg-transparent hover:bg-green-500/5 hover:border-green-500"
          >
            <CardContent className="space-y-3 p-0">
              <div className="flex items-start justify-between gap-2">
                <p className="!text-[12px] font-[400] uppercase tracking-[.1rem] text-[#7a8081]">
                  {platform.label}
                </p>
                {Icon && (
                  <Icon
                    aria-hidden="true"
                    className="size-5 shrink-0"
                    style={{ color: PLATFORM_COLORS[platform.code] }}
                  />
                )}
              </div>
              <div>
                <p
                  className="text-2xl font-semibold text-foreground tabular-nums"
                  title={platform.followers?.toLocaleString()}
                >
                  {platform.followers === null
                    ? "—"
                    : compactNumber.format(platform.followers)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {followerLabel(platform)}
                </p>
              </div>
              {growthLoading && platform.followers !== null ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                growth[platform.code] && (
                  <GrowthDelta
                    growth={growth[platform.code]}
                    days={growthDays}
                  />
                )
              )}
              {secondary && (
                <p
                  className="text-xs text-muted-foreground"
                  title={secondary.value.toLocaleString()}
                >
                  <span className="font-medium text-foreground tabular-nums">
                    {compactNumber.format(secondary.value)}
                  </span>{" "}
                  {secondary.label.toLowerCase()}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
