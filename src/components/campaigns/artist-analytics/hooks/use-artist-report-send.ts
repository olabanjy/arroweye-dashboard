"use client";

import { useCallback } from "react";

import { sendArtistReport } from "@/actions/artist-report";
import type { FollowerRange } from "@/lib/music-analytics/artist/follower-growth";

/** Emails the artist report for the period currently shown on the page. */
export function useArtistReportSend(campaignId: string, days: FollowerRange) {
  return useCallback(
    (recipient: string) => sendArtistReport({ campaignId, recipient, days }),
    [campaignId, days],
  );
}
