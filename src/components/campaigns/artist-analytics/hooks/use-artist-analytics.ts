"use client";

import React from "react";

import type { ArtistQuery } from "./fetch-artist-analytics";
import { useArtistAudience } from "./use-artist-audience";
import {
  useArtistFollowerHistory,
  type FollowerRange,
} from "./use-artist-follower-history";
import { useArtistProfile } from "./use-artist-profile";
import { useArtistTopTracks } from "./use-artist-top-tracks";

/** Every artist section, keyed off the campaign's linked song. */
export function useArtistAnalytics(query: ArtistQuery) {
  const [followerRange, setFollowerRange] = React.useState<FollowerRange>(90);

  return {
    followerRange,
    setFollowerRange,
    ...useArtistProfile(query),
    ...useArtistFollowerHistory(query, followerRange),
    ...useArtistTopTracks(query),
    ...useArtistAudience(query),
  };
}
