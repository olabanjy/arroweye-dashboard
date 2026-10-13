import { NextRequest } from "next/server";

import {
  ARTIST_FOLLOWER_PLATFORMS,
  toSongstatsSource,
} from "@/lib/music-analytics/platforms";
import {
  artistRequest,
  positiveNumber,
  withArtist,
} from "@/lib/music-analytics/songstats-artist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type HistoryPoint = Record<string, unknown> & { date?: string };

interface HistoricStatsPayload {
  stats?: { source?: string; data?: { history?: HistoryPoint[] } }[];
}

const ALLOWED_DAYS = [30, 90, 365];
const DEFAULT_DAYS = 90;

const parseDays = (raw: string | null) => {
  const days = Number(raw);
  return ALLOWED_DAYS.includes(days) ? days : DEFAULT_DAYS;
};

const daysAgo = (days: number) => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
};

const readFollowers = (source: string, point: HistoryPoint) =>
  positiveNumber(
    point[source === "youtube" ? "subscribers_total" : "followers_total"],
  );

/** One row per day with a follower count per platform, for a single chart. */
const mergeByDate = (payload: HistoricStatsPayload) => {
  const histories = new Map(
    (payload.stats ?? []).map((entry) => [
      entry.source,
      entry.data?.history ?? [],
    ]),
  );
  const rows = new Map<string, Record<string, number | string>>();
  const platforms: { code: string; label: string }[] = [];

  for (const platform of ARTIST_FOLLOWER_PLATFORMS) {
    const source = toSongstatsSource(platform.code);
    let hasPoint = false;

    for (const point of histories.get(source) ?? []) {
      const value = readFollowers(source, point);
      if (!point.date || value === null) continue;

      const row = rows.get(point.date) ?? { date: point.date };
      row[platform.code] = value;
      rows.set(point.date, row);
      hasPoint = true;
    }

    if (hasPoint) platforms.push(platform);
  }

  return {
    platforms,
    points: [...rows.values()].sort((a, b) =>
      String(a.date).localeCompare(String(b.date)),
    ),
  };
};

export async function GET(request: NextRequest) {
  const days = parseDays(request.nextUrl.searchParams.get("days"));

  return withArtist(request, "follower history", async ({ artistId }) => {
    const payload = await artistRequest<HistoricStatsPayload>(
      "/artists/historic_stats",
      artistId,
      {
        source: ARTIST_FOLLOWER_PLATFORMS.map((platform) =>
          toSongstatsSource(platform.code),
        ),
        start_date: daysAgo(days),
        end_date: daysAgo(0),
      },
    );

    return { days, ...mergeByDate(payload) };
  });
}
