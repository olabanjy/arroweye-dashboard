"use client";

import { useQuery } from "@tanstack/react-query";

import {
  fetchArtistAnalytics,
  toArtistParams,
  type ArtistQuery,
} from "./fetch-artist-analytics";

export interface ListenerCity {
  city: string;
  countryCode: string;
  country: string;
  listeners: number;
}

export interface ListenerCountry {
  code: string;
  country: string;
  listeners: number;
}

interface ArtistAudience {
  cities: ListenerCity[];
  countries: ListenerCountry[];
}

export function useArtistAudience(query: ArtistQuery) {
  const { data, isLoading } = useQuery({
    queryKey: ["artist-audience", query.isrc, query.artist],
    queryFn: () =>
      fetchArtistAnalytics<ArtistAudience>(
        "artist-audience",
        toArtistParams(query),
      ),
    enabled: Boolean(query.isrc),
    staleTime: 5 * 60_000,
  });

  return {
    listenerCities: data?.cities ?? [],
    listenerCountries: data?.countries ?? [],
    isAudienceLoading: isLoading,
  };
}
