import { NextRequest } from "next/server";

import { loadArtistProfile } from "@/lib/music-analytics/artist/load-artist-profile";
import { withArtist } from "@/lib/music-analytics/songstats-artist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return withArtist(request, "profile", ({ artistId }) =>
    loadArtistProfile(artistId),
  );
}
