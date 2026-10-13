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

type StatData = Record<string, unknown>;

interface ArtistInfoPayload {
  artist_info?: {
    name?: string;
    avatar?: string;
    country?: string;
    genres?: string[];
  };
}

interface ArtistStatsPayload {
  stats?: { source?: string; data?: StatData }[];
}

const readPlatformStats = (source: string, data: StatData | undefined) => ({
  // YouTube counts subscribers; every other network counts followers.
  followers: positiveNumber(
    data?.[source === "youtube" ? "subscribers_total" : "followers_total"],
  ),
  monthlyListeners: positiveNumber(data?.monthly_listeners_current),
  streams: positiveNumber(data?.streams_total),
  views: positiveNumber(data?.video_views_total ?? data?.views_total),
  playlistReach: positiveNumber(data?.playlist_reach_current),
});

export async function GET(request: NextRequest) {
  return withArtist(request, "profile", async ({ artistId }) => {
    const [info, stats] = await Promise.all([
      artistRequest<ArtistInfoPayload>("/artists/info", artistId),
      artistRequest<ArtistStatsPayload>("/artists/stats", artistId, {
        source: ARTIST_FOLLOWER_PLATFORMS.map((platform) =>
          toSongstatsSource(platform.code),
        ),
      }),
    ]);
    const statsBySource = new Map(
      (stats.stats ?? []).map((entry) => [entry.source, entry.data]),
    );

    return {
      artist: {
        name: info.artist_info?.name ?? "",
        avatar: info.artist_info?.avatar ?? null,
        country: info.artist_info?.country ?? null,
        genres: info.artist_info?.genres ?? [],
      },
      platforms: ARTIST_FOLLOWER_PLATFORMS.flatMap((platform) => {
        const source = toSongstatsSource(platform.code);
        const values = readPlatformStats(source, statsBySource.get(source));
        const hasData = Object.values(values).some((value) => value !== null);
        return hasData
          ? [{ code: platform.code, label: platform.label, ...values }]
          : [];
      }),
    };
  });
}
