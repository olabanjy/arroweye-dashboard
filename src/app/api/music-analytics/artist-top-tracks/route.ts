import { NextRequest } from "next/server";

import {
  artistRequest,
  finiteNumber,
  withArtist,
} from "@/lib/music-analytics/songstats-artist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIMIT = 10;

interface TopTrack {
  songstats_track_id?: string;
  track_name?: string;
  artist_name?: string;
  image_url?: string;
  rank_value?: unknown;
}

interface TopTracksPayload {
  data?: { source?: string; top_tracks?: TopTrack[] }[];
}

/**
 * Ranked by playlist count on Spotify: the only ranking metric the provider
 * documents for top tracks, and the platform with the widest coverage.
 */
export async function GET(request: NextRequest) {
  return withArtist(request, "top tracks", async ({ artistId, trackId }) => {
    const payload = await artistRequest<TopTracksPayload>(
      "/artists/top_tracks",
      artistId,
      { source: "spotify", metric: "playlists", scope: "total", limit: LIMIT },
    );
    const tracks = payload.data?.[0]?.top_tracks ?? [];

    return {
      items: tracks.map((track, index) => ({
        id: track.songstats_track_id ?? String(index),
        title: track.track_name ?? "",
        artists: track.artist_name ?? "",
        image: track.image_url ?? null,
        playlists: finiteNumber(track.rank_value) ?? 0,
        isCampaignSong: Boolean(
          trackId && track.songstats_track_id === trackId,
        ),
      })),
    };
  });
}
