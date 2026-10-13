import "server-only";

import { NextRequest, NextResponse } from "next/server";

import { withRetry } from "./fan-out";
import {
  normalizeIsrc,
  songstatsRequest,
  type SongstatsParams,
} from "./songstats-client";
import { songstatsErrorResponse } from "./songstats-track-stats";

export interface ResolvedArtist {
  artistId: string;
  trackId?: string;
}

interface TrackInfoPayload {
  track_info?: {
    songstats_track_id?: string;
    artists?: { name?: string; songstats_artist_id?: string }[];
  };
}

type CreditedArtist = NonNullable<
  NonNullable<TrackInfoPayload["track_info"]>["artists"]
>[number];

const normalizeName = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

// Campaign artist fields often list every credit: "A & B", "A feat. B".
const splitCredits = (name: string) =>
  name
    .split(/\s*(?:,|&|\+|\/|\bfeat\.?|\bft\.?|\bx\b|\band\b|\bwith\b)\s*/i)
    .map(normalizeName)
    .filter(Boolean);

/**
 * The credit matching the campaign's artist. Collaborations often credit
 * someone else first, so the first credit is only used when the campaign
 * names no artist.
 */
const pickCredit = (credits: CreditedArtist[], campaignArtist?: string) => {
  if (!campaignArtist?.trim()) return credits[0];

  // Campaign order wins: the first artist the campaign names is its lead.
  for (const wanted of splitCredits(campaignArtist)) {
    const match = credits.find(
      (credit) => credit.name && normalizeName(credit.name) === wanted,
    );
    if (match) return match;
  }
  return undefined;
};

interface ArtistSearchPayload {
  results?: { name?: string; songstats_artist_id?: string }[];
}

/**
 * Remixes and some features credit only the original artist, so the
 * campaign's artist may be missing from the song. Search by name instead,
 * accepting only an exact name match to avoid a namesake.
 */
const searchArtist = async (campaignArtist: string) => {
  for (const wanted of splitCredits(campaignArtist)) {
    const payload = await withRetry(() =>
      songstatsRequest<ArtistSearchPayload>("/artists/search", {
        search: wanted,
        limit: 10,
      }),
    );
    const match = payload.results?.find(
      (result) => result.name && normalizeName(result.name) === wanted,
    );
    if (match?.songstats_artist_id) return match.songstats_artist_id;
  }
  return undefined;
};

/** The campaign's song is the only link to its artist. */
export const resolveArtist = async (
  isrc: string,
  campaignArtist?: string,
): Promise<ResolvedArtist | null> => {
  const payload = await withRetry(() =>
    songstatsRequest<TrackInfoPayload>("/tracks/info", {
      isrc: normalizeIsrc(isrc),
    }),
  );
  const credits = payload.track_info?.artists ?? [];
  const artistId =
    pickCredit(credits, campaignArtist)?.songstats_artist_id ??
    (campaignArtist?.trim() ? await searchArtist(campaignArtist) : undefined);

  if (!artistId) {
    console.warn(
      `No artist matching "${campaignArtist}" for ISRC ${isrc}; song credits:`,
      credits.map((credit) => credit.name),
    );
    return null;
  }

  return { artistId, trackId: payload.track_info?.songstats_track_id };
};

export const artistRequest = <T>(
  path: string,
  artistId: string,
  params: SongstatsParams = {},
) =>
  withRetry(() =>
    songstatsRequest<T>(path, { ...params, songstats_artist_id: artistId }),
  );

export const finiteNumber = (value: unknown) => {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

/**
 * Artist stats report 0, not null, for a platform the artist has no linked
 * account on, so a zero means "no data" rather than a real count.
 */
export const positiveNumber = (value: unknown) => {
  const parsed = finiteNumber(value);
  return parsed !== null && parsed > 0 ? parsed : null;
};

/**
 * Shared shell for artist routes: validates the ISRC, resolves the artist
 * and maps failures to client-safe responses. Provider detail stays in logs.
 */
export const withArtist = async (
  request: NextRequest,
  label: string,
  handler: (artist: ResolvedArtist) => Promise<unknown>,
) => {
  const isrc = request.nextUrl.searchParams.get("isrc")?.trim();
  const campaignArtist =
    request.nextUrl.searchParams.get("artist") ?? undefined;
  if (!isrc) {
    return NextResponse.json(
      { error: "Provide the song's ISRC.", code: "MISSING_ISRC" },
      { status: 400 },
    );
  }

  try {
    const artist = await resolveArtist(isrc, campaignArtist);
    if (!artist) {
      return NextResponse.json(
        {
          error: "We couldn't find analytics for this campaign's artist.",
          code: "NO_ARTIST",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(await handler(artist));
  } catch (error) {
    console.error(`Songstats artist ${label} failed:`, error);
    return songstatsErrorResponse(error);
  }
};
