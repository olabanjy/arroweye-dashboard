"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import type { FollowerRange } from "@/lib/music-analytics/artist/follower-growth";

import { fetchArtistAnalytics } from "./fetch-artist-analytics";

export function useArtistSummary(
  campaignId: string,
  days: FollowerRange,
  enabled = true,
) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["artist-summary", campaignId, days],
    queryFn: () =>
      fetchArtistAnalytics<{ summary?: string | null }>("artist-summary", {
        campaignId,
        days: String(days),
      }),
    enabled: Boolean(campaignId) && enabled,
    // The server only rewrites it when the growth picture changes.
    staleTime: 30 * 60_000,
    retry: false,
  });

  // The card hides the summary on failure, so the reason is only logged.
  useEffect(() => {
    if (error) console.error("Artist audience summary failed:", error);
  }, [error]);

  return {
    artistSummary: data?.summary ?? null,
    isArtistSummaryLoading: isLoading,
  };
}
