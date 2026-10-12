import "server-only";

import { createHash } from "node:crypto";

import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

import { getConfig } from "@/lib/storage/r2";

// Bumped when the stored shape changes, so older entries are ignored.
const STORE_VERSION = 1;

export interface StoredResponse {
  version: typeof STORE_VERSION;
  path: string;
  fetchedAt: number;
  payload: unknown;
}

// Paths carry query strings, so they are hashed into a safe object key.
const keyFor = (provider: string, path: string) =>
  `analytics-cache/${provider}/${createHash("sha256").update(path).digest("hex")}.json`;

const isMissingObject = (error: unknown) =>
  error instanceof Error && error.name === "NoSuchKey";

/**
 * Storage problems never fail an analytics request: they are logged and the
 * caller carries on as if nothing was stored.
 */
export const readStoredResponse = async (
  provider: string,
  path: string,
): Promise<StoredResponse | null> => {
  try {
    const { client, bucket } = getConfig();
    const { Body } = await client.send(
      new GetObjectCommand({ Bucket: bucket, Key: keyFor(provider, path) }),
    );
    if (!Body) return null;

    const stored = JSON.parse(await Body.transformToString()) as StoredResponse;
    return stored.version === STORE_VERSION && stored.path === path
      ? stored
      : null;
  } catch (error) {
    if (!isMissingObject(error)) {
      console.error(`Reading stored ${provider} response failed:`, error);
    }
    return null;
  }
};

export const writeStoredResponse = async (
  provider: string,
  path: string,
  payload: unknown,
) => {
  try {
    const { client, bucket } = getConfig();
    const stored: StoredResponse = {
      version: STORE_VERSION,
      path,
      fetchedAt: Date.now(),
      payload,
    };
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: keyFor(provider, path),
        Body: JSON.stringify(stored),
        ContentType: "application/json",
      }),
    );
  } catch (error) {
    console.error(`Storing ${provider} response failed:`, error);
  }
};
