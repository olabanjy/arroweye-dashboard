import { NextRequest } from "next/server";

import { readCountryName } from "@/lib/music-analytics/country-names";
import {
  artistRequest,
  finiteNumber,
  withArtist,
} from "@/lib/music-analytics/songstats-artist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIMIT = 10;

interface ListenerCity {
  city_name?: string;
  city_region?: string | null;
  country_code?: string;
  current_listeners?: unknown;
}

interface AudiencePayload {
  audience?: {
    source?: string;
    data?: { monthly_listeners?: ListenerCity[] };
  }[];
}

const readCities = (payload: AudiencePayload) =>
  (
    payload.audience?.find((entry) => entry.source === "spotify")?.data
      ?.monthly_listeners ?? []
  ).flatMap((city) => {
    const listeners = finiteNumber(city.current_listeners);
    if (!city.city_name || listeners === null) return [];
    return [
      {
        city: city.city_name,
        countryCode: city.country_code ?? "",
        country: readCountryName(city.country_code),
        listeners,
      },
    ];
  });

/**
 * Only city-level listener counts exist, so country totals add up the
 * listed cities and understate listeners outside them.
 */
const sumByCountry = (cities: ReturnType<typeof readCities>) => {
  const totals = new Map<string, { country: string; listeners: number }>();
  for (const city of cities) {
    const entry = totals.get(city.countryCode) ?? {
      country: city.country,
      listeners: 0,
    };
    entry.listeners += city.listeners;
    totals.set(city.countryCode, entry);
  }

  return [...totals.entries()]
    .map(([code, entry]) => ({ code, ...entry }))
    .sort((a, b) => b.listeners - a.listeners)
    .slice(0, LIMIT);
};

export async function GET(request: NextRequest) {
  return withArtist(request, "audience", async ({ artistId }) => {
    const payload = await artistRequest<AudiencePayload>(
      "/artists/audience",
      artistId,
      { source: "spotify" },
    );
    const cities = readCities(payload).sort(
      (a, b) => b.listeners - a.listeners,
    );

    return {
      cities: cities.slice(0, LIMIT),
      countries: sumByCountry(cities),
    };
  });
}
