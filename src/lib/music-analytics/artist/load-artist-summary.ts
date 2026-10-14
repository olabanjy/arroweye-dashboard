import "server-only";

import { resolveArtist } from "../songstats-artist";
import { deriveArtistSignals } from "./artist-signals";
import { readArtistSummary, writeArtistSummary } from "./artist-summary-store";
import {
  summarizeFollowerGrowth,
  type FollowerHistory,
  type FollowerRange,
} from "./follower-growth";
import { generateArtistSummary } from "./generate-artist-summary";
import { loadFollowerHistory } from "./load-follower-history";

type UnknownRecord = Record<string, unknown>;

const asRecord = (value: unknown): UnknownRecord =>
  value && typeof value === "object" ? (value as UnknownRecord) : {};

const readCached = async (artistId: string, days: FollowerRange) => {
  try {
    return await readArtistSummary(artistId, days);
  } catch (error) {
    // A broken copy is rewritten on this load.
    console.error(
      `Stored artist summary for ${artistId} could not be read:`,
      error,
    );
    return null;
  }
};

/** The campaign's linked song and artist name, read from the project. */
export const readCampaignArtist = (project: UnknownRecord) => ({
  isrc: String(project.isrc || project.song_isrc || "").trim(),
  artistName: String(
    project.artist_name || asRecord(project.campaign).song_artist || "",
  ).trim(),
});

/**
 * Regenerates only when the qualitative picture changes, so most loads are
 * a single storage read.
 */
export const summarizeArtist = async ({
  artistId,
  artistName,
  history,
}: {
  artistId: string;
  artistName: string;
  history: FollowerHistory;
}) => {
  const { days } = history;
  const signals = deriveArtistSignals(summarizeFollowerGrowth(history));
  if (signals.length === 0) return null;

  const signature = JSON.stringify({ days, signals, artistName });
  const cached = await readCached(artistId, days);
  if (cached?.signature === signature) return cached.summary;

  const summary = await generateArtistSummary(signals, days, artistName);
  if (!summary) return null;

  await writeArtistSummary(artistId, days, { signature, summary }).catch(
    (error: unknown) => {
      console.error(
        `Artist summary for ${artistId} could not be stored:`,
        error,
      );
    },
  );
  return summary;
};

/**
 * Built from the campaign's own song and artist, so the client cannot steer
 * what the model is given.
 */
export const loadArtistSummary = async (
  project: UnknownRecord,
  days: FollowerRange,
) => {
  const { isrc, artistName } = readCampaignArtist(project);
  if (!isrc) return null;

  const artist = await resolveArtist(isrc, artistName || undefined);
  if (!artist) return null;

  return summarizeArtist({
    artistId: artist.artistId,
    artistName,
    history: await loadFollowerHistory(artist.artistId, days),
  });
};
