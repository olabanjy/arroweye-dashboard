"use client";

import { useQuery } from "@tanstack/react-query";

import {
  fetchArtistAnalytics,
  toArtistParams,
  type ArtistQuery,
} from "./fetch-artist-analytics";

export interface ArtistTopTrack {
  id: string;
  title: string;
  artists: string;
  image: string | null;
  playlists: number;
  isCampaignSong: boolean;
}

export function useArtistTopTracks(query: ArtistQuery) {
  const { data, isLoading } = useQuery({
    queryKey: ["artist-top-tracks", query.isrc, query.artist],
    queryFn: () =>
      fetchArtistAnalytics<{ items: ArtistTopTrack[] }>(
        "artist-top-tracks",
        toArtistParams(query),
      ),
    enabled: Boolean(query.isrc),
    staleTime: 5 * 60_000,
  });

  return {
    topTracks: data?.items ?? [],
    isTopTracksLoading: isLoading,
  };
}
