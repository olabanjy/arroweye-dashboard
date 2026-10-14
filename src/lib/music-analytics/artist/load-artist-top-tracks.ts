import "server-only";

import { artistRequest, finiteNumber } from "../songstats-artist";

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
export const loadArtistTopTracks = async (
  artistId: string,
  campaignTrackId?: string,
) => {
  const payload = await artistRequest<TopTracksPayload>(
    "/artists/top_tracks",
    artistId,
    { source: "spotify", metric: "playlists", scope: "total", limit: LIMIT },
  );
  const tracks = payload.data?.[0]?.top_tracks ?? [];

  return tracks.map((track, index) => ({
    id: track.songstats_track_id ?? String(index),
    title: track.track_name ?? "",
    artists: track.artist_name ?? "",
    image: track.image_url ?? null,
    playlists: finiteNumber(track.rank_value) ?? 0,
    isCampaignSong: Boolean(
      campaignTrackId && track.songstats_track_id === campaignTrackId,
    ),
  }));
};

export type ArtistTopTrackData = Awaited<
  ReturnType<typeof loadArtistTopTracks>
>[number];
