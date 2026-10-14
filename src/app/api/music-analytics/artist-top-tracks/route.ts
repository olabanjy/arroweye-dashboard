import { NextRequest } from "next/server";

import { loadArtistTopTracks } from "@/lib/music-analytics/artist/load-artist-top-tracks";
import { withArtist } from "@/lib/music-analytics/songstats-artist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return withArtist(request, "top tracks", async ({ artistId, trackId }) => ({
    items: await loadArtistTopTracks(artistId, trackId),
  }));
}
