import "server-only";

import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

import { getConfig } from "@/lib/storage/r2";

import type { FollowerRange } from "./follower-growth";

// Bumped when the prompt changes, so older summaries are rewritten.
const STORE_VERSION = 1;

export interface StoredArtistSummary {
  version: typeof STORE_VERSION;
  /** Inputs the summary was written from; a change means it is stale. */
  signature: string;
  summary: string;
}

// Keyed by artist, not campaign: every campaign for the artist shares it.
const keyFor = (artistId: string, days: FollowerRange) =>
  `artist-summary/artist-${artistId}-${days}d.json`;

const isMissingObject = (error: unknown) =>
  error instanceof Error && error.name === "NoSuchKey";

export const readArtistSummary = async (
  artistId: string,
  days: FollowerRange,
): Promise<StoredArtistSummary | null> => {
  const { client, bucket } = getConfig();

  try {
    const { Body } = await client.send(
      new GetObjectCommand({ Bucket: bucket, Key: keyFor(artistId, days) }),
    );
    if (!Body) return null;

    const stored = JSON.parse(
      await Body.transformToString(),
    ) as StoredArtistSummary;
    return stored.version === STORE_VERSION ? stored : null;
  } catch (error) {
    if (isMissingObject(error)) return null;
    throw error;
  }
};

export const writeArtistSummary = async (
  artistId: string,
  days: FollowerRange,
  summary: Omit<StoredArtistSummary, "version">,
) => {
  const { client, bucket } = getConfig();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: keyFor(artistId, days),
      Body: JSON.stringify({ version: STORE_VERSION, ...summary }),
      ContentType: "application/json",
    }),
  );
};
