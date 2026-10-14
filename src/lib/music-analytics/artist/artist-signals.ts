import type { PlatformGrowth } from "./follower-growth";

export interface PlatformSignal {
  platform: string;
  momentum: "strong growth" | "growth" | "flat" | "decline";
}

// Follower bases move slowly, so a few percent over the period is notable.
const STRONG_GROWTH_PERCENT = 10;
const FLAT_BAND_PERCENT = 1;

const describeMomentum = (
  growth: PlatformGrowth,
): PlatformSignal["momentum"] => {
  if (growth.percent === null) return growth.gained > 0 ? "growth" : "flat";
  if (growth.percent >= STRONG_GROWTH_PERCENT) return "strong growth";
  if (growth.percent >= FLAT_BAND_PERCENT) return "growth";
  return growth.percent > -FLAT_BAND_PERCENT ? "flat" : "decline";
};

/**
 * Qualitative labels only, largest audience first: the model never sees a
 * count, so the tiles and chart stay the single source of figures.
 */
export const deriveArtistSignals = (
  growth: PlatformGrowth[],
): PlatformSignal[] =>
  [...growth]
    .sort((a, b) => b.end - a.end)
    .map((entry) => ({
      platform: entry.label,
      momentum: describeMomentum(entry),
    }));
