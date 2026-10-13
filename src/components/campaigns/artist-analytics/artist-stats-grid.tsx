"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { compactNumber } from "./format";
import type { ArtistPlatformStats } from "./hooks/use-artist-profile";

interface ArtistStatsGridProps {
  platforms: ArtistPlatformStats[];
  loading?: boolean;
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
        return (
          <Card
            key={platform.code}
            className="gap-0 rounded-[8px] p-[20px] shadow-none font-SansFlex bg-transparent hover:bg-green-500/5 hover:border-green-500"
          >
            <CardContent className="space-y-3 p-0">
              <p className="!text-[12px] font-[400] uppercase tracking-[.1rem] text-[#7a8081]">
                {platform.label}
              </p>
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
