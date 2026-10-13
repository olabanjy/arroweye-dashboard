"use client";

import { useQuery } from "@tanstack/react-query";

import {
  fetchArtistAnalytics,
  toArtistParams,
  type ArtistQuery,
} from "./fetch-artist-analytics";

export interface ArtistPlatformStats {
  code: string;
  label: string;
  followers: number | null;
  monthlyListeners: number | null;
  streams: number | null;
  views: number | null;
  playlistReach: number | null;
}

export interface ArtistProfile {
  artist: {
    name: string;
    avatar: string | null;
    country: string | null;
    genres: string[];
  };
  platforms: ArtistPlatformStats[];
}

export function useArtistProfile(query: ArtistQuery) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["artist-profile", query.isrc, query.artist],
    queryFn: () =>
      fetchArtistAnalytics<ArtistProfile>(
        "artist-profile",
        toArtistParams(query),
      ),
    enabled: Boolean(query.isrc),
    staleTime: 5 * 60_000,
  });

  return {
    profile: data,
    isProfileLoading: isLoading,
    profileError: error?.message ?? null,
  };
}
