import "server-only";

import { readStoredResponse, writeStoredResponse } from "./analytics-store";

/**
 * Analytics providers bill per call against a quota and their data moves at
 * most daily, so responses are held in memory and in R2 and shared by every
 * viewer of a campaign. Memory alone is lost on each new Vercel instance.
 * Keys must never contain credentials: only the provider path and query.
 */
export const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000;
const MAX_CACHE_ENTRIES = 1000;

// How long a failure, or a stale copy served in its place, is reused before
// the provider is asked again.
const FAILURE_TTL_MS = 15 * 60 * 1000;

interface Expiring<T> {
  value: T;
  expiresAt: number;
}

const responseCache = new Map<string, Expiring<unknown>>();
const failureCache = new Map<string, Expiring<unknown>>();

/**
 * The cache only helps once a request has finished. Identical calls issued
 * before that — React re-invoking an effect, two people opening the same
 * campaign — would each be billed, so concurrent callers share one promise.
 */
const inFlight = new Map<string, Promise<unknown>>();

const readEntry = <T>(cache: Map<string, Expiring<unknown>>, key: string) => {
  const hit = cache.get(key);
  if (!hit) return undefined;

  if (hit.expiresAt <= Date.now()) {
    cache.delete(key);
    return undefined;
  }

  // Refresh insertion order so the oldest untouched entry is evicted first.
  cache.delete(key);
  cache.set(key, hit);
  return hit.value as T;
};

const writeEntry = (
  cache: Map<string, Expiring<unknown>>,
  key: string,
  value: unknown,
  ttlMs: number,
) => {
  if (cache.size >= MAX_CACHE_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
};

// 429 and 5xx can clear on a retry; other 4xx answers will not.
const isLastingStatus = (status: number) =>
  status >= 400 && status < 500 && status !== 429;

const hasStatus = (error: unknown): error is { status: number } =>
  typeof (error as { status?: unknown })?.status === "number";

const END_DATE_PARAMS = ["endDate", "end_date"];

/**
 * Windows ending today get a new path every day, so the first failure of a
 * day would find no stored copy. The newest copy is also kept under the path
 * minus its end date, to fall back on. Null when the path has no end date.
 */
const toLatestPath = (path: string) => {
  const [base, query = ""] = path.split("?");
  const params = new URLSearchParams(query);
  if (!END_DATE_PARAMS.some((name) => params.has(name))) return null;

  END_DATE_PARAMS.forEach((name) => params.delete(name));
  const rest = params.toString();
  return `latest:${rest ? `${base}?${rest}` : base}`;
};

export interface CachedRequestOptions<T> {
  /** Names the provider in logs and in the R2 key. */
  provider: string;
  /** Path and query; identifies the response. */
  path: string;
  fetcher: () => Promise<T>;
  ttlMs?: number;
  skipCache?: boolean;
}

const requestUncached = async <T>({
  provider,
  path,
  fetcher,
  ttlMs = DEFAULT_TTL_MS,
  skipCache = false,
}: CachedRequestOptions<T>) => {
  const cacheKey = `${provider}:${path}`;
  const stored = skipCache ? null : await readStoredResponse(provider, path);
  const freshUntil = (stored?.fetchedAt ?? 0) + ttlMs;
  if (stored && freshUntil > Date.now()) {
    writeEntry(responseCache, cacheKey, stored.payload, freshUntil - Date.now());
    return stored.payload as T;
  }

  const latestPath = toLatestPath(path);

  try {
    const payload = await fetcher();
    writeEntry(responseCache, cacheKey, payload, ttlMs);
    await Promise.all([
      writeStoredResponse(provider, path, payload),
      latestPath && writeStoredResponse(provider, latestPath, payload),
    ]);
    return payload;
  } catch (error) {
    const fallback =
      stored ??
      (latestPath && !skipCache
        ? await readStoredResponse(provider, latestPath)
        : null);

    if (fallback) {
      console.warn(
        `${provider} request failed; serving copy from ${new Date(fallback.fetchedAt).toISOString()}:`,
        error,
      );
      writeEntry(responseCache, cacheKey, fallback.payload, FAILURE_TTL_MS);
      return fallback.payload as T;
    }

    if (hasStatus(error) && isLastingStatus(error.status)) {
      writeEntry(failureCache, cacheKey, error, FAILURE_TTL_MS);
    }
    throw error;
  }
};

export const cachedRequest = async <T>(options: CachedRequestOptions<T>) => {
  const cacheKey = `${options.provider}:${options.path}`;

  if (!options.skipCache) {
    const cached = readEntry<T>(responseCache, cacheKey);
    if (cached) return cached;

    const failure = readEntry<unknown>(failureCache, cacheKey);
    if (failure) throw failure;

    const pending = inFlight.get(cacheKey);
    if (pending) return (await pending) as T;
  }

  const request = requestUncached(options).finally(() => {
    inFlight.delete(cacheKey);
  });
  inFlight.set(cacheKey, request);

  return request;
};
