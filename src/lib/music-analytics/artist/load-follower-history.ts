import "server-only";

import { ARTIST_FOLLOWER_PLATFORMS, toSongstatsSource } from "../platforms";
import { artistRequest, positiveNumber } from "../songstats-artist";
import type { FollowerHistory, FollowerRange } from "./follower-growth";

type HistoryPoint = Record<string, unknown> & { date?: string };

interface HistoricStatsPayload {
  stats?: { source?: string; data?: { history?: HistoryPoint[] } }[];
}

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
const mergeByDate = (
  payload: HistoricStatsPayload,
): Omit<FollowerHistory, "days"> => {
  const histories = new Map(
    (payload.stats ?? []).map((entry) => [
      entry.source,
      entry.data?.history ?? [],
    ]),
  );
  const rows = new Map<string, FollowerHistory["points"][number]>();
  const platforms: FollowerHistory["platforms"] = [];

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
    points: [...rows.values()].sort((a, b) => a.date.localeCompare(b.date)),
  };
};

export const loadFollowerHistory = async (
  artistId: string,
  days: FollowerRange,
): Promise<FollowerHistory> => {
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
};
