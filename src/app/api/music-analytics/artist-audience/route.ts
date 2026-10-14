import { NextRequest } from "next/server";

import { loadArtistAudience } from "@/lib/music-analytics/artist/load-artist-audience";
import { withArtist } from "@/lib/music-analytics/songstats-artist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return withArtist(request, "audience", ({ artistId }) =>
    loadArtistAudience(artistId),
  );
}
