"use client";

import { useQuery } from "@tanstack/react-query";

import {
  fetchArtistAnalytics,
  toArtistParams,
  type ArtistQuery,
} from "./fetch-artist-analytics";

export type FollowerRange = 30 | 90 | 365;

export type FollowerPoint = { date: string } & Record<string, number | string>;

interface FollowerHistory {
  days: FollowerRange;
  platforms: { code: string; label: string }[];
  points: FollowerPoint[];
}

export function useArtistFollowerHistory(
  query: ArtistQuery,
  days: FollowerRange,
) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["artist-follower-history", query.isrc, query.artist, days],
    queryFn: () =>
      fetchArtistAnalytics<FollowerHistory>("artist-follower-history", {
        ...toArtistParams(query),
        days: String(days),
      }),
    enabled: Boolean(query.isrc),
    staleTime: 5 * 60_000,
  });

  return {
    followerPlatforms: data?.platforms ?? [],
    followerPoints: data?.points ?? [],
    isFollowerHistoryLoading: isLoading,
    hasFollowerHistoryError: isError,
  };
}

/**
 * Follower counts differ by orders of magnitude across platforms, so each is
 * plotted as followers gained since its first point in the range. The raw
 * count rides along for the tooltip.
 */
export const toFollowerGrowth = (
  points: FollowerPoint[],
  platforms: { code: string }[],
) => {
  const baselines = new Map<string, number>();

  return points.map((point) => {
    const row: Record<string, number | string> = { date: point.date };
    for (const { code } of platforms) {
      const value = point[code];
      if (typeof value !== "number") continue;
      if (!baselines.has(code)) baselines.set(code, value);
      row[code] = value - baselines.get(code)!;
      row[`${code}Raw`] = value;
    }
    return row;
  });
};
