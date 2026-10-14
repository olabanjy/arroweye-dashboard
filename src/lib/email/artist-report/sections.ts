import type { ArtistReport } from "@/lib/music-analytics/artist/load-artist-report";

import { renderMetricGrid } from "../campaign-report/metrics-sections";
import type { MetricCard } from "../campaign-report/types";
import {
  escapeHtml,
  formatNumber,
  infoNote,
  sectionLabel,
  sectionTitle,
} from "../campaign-report/utils";

type Platform = ArtistReport["profile"]["platforms"][number];

// On these networks views count videos made with the artist's music.
const UGC_VIEW_PLATFORMS = new Set(["instagram", "tiktok"]);

const readSecondary = (platform: Platform) => {
  if (platform.monthlyListeners !== null)
    return { label: "Monthly listeners", value: platform.monthlyListeners };
  if (platform.views !== null)
    return {
      label: UGC_VIEW_PLATFORMS.has(platform.code) ? "Video views" : "Views",
      value: platform.views,
    };
  if (platform.streams !== null)
    return { label: "Streams", value: platform.streams };
  if (platform.playlistReach !== null)
    return { label: "Playlist reach", value: platform.playlistReach };
  return null;
};

const toCard = (
  platform: Platform,
  growth: ArtistReport["growth"],
  days: number,
): MetricCard | null => {
  const secondary = readSecondary(platform);
  const change = growth.find((entry) => entry.code === platform.code);

  if (platform.followers !== null) {
    return {
      label: `${platform.label} ${platform.code === "youtube" ? "subscribers" : "followers"}`,
      value: platform.followers,
      changePercent: change?.percent ?? null,
      changePeriodDays: days,
      detailLabel: secondary?.label,
      detailValue: secondary ? formatNumber(secondary.value) : undefined,
    };
  }
  // No linked account: lead with the platform's other figure instead.
  return secondary
    ? {
        label: `${platform.label} ${secondary.label.toLowerCase()}`,
        value: secondary.value,
      }
    : null;
};

export const renderAudienceSummary = (summary: string | null) =>
  summary?.trim()
    ? `<div style="margin-top:26px;">${sectionTitle("Audience Trend", "1.2px")}<div style="background:#fafafa;border:1px solid #e7e7e7;border-radius:10px;padding:14px 15px;"><div style="font-size:10px;letter-spacing:1px;font-weight:900;text-transform:uppercase;color:#6f42c1;margin-bottom:7px;">&#10022; AI Summary</div><div style="font-size:13px;line-height:1.45;color:#555;">${escapeHtml(summary)}</div></div></div>`
    : "";

export const renderPlatformSnapshot = (report: ArtistReport) => {
  const cards = report.profile.platforms.flatMap((platform) => {
    const card = toCard(platform, report.growth, report.days);
    return card ? [card] : [];
  });
  if (cards.length === 0) return "";

  return `<div style="margin-top:26px;">${sectionTitle("Platform Snapshot", "1.2px")}${renderMetricGrid(cards)}${infoNote(`Current audience per platform. Percentages show follower growth over the last ${report.days} days.`)}</div>`;
};

const rankCell = (index: number) =>
  `<td width="34" style="padding:14px 10px 14px 0;"><div style="font-size:10px;font-weight:900;color:#999;">${String(index + 1).padStart(2, "0")}</div></td>`;

const valueCell = (value: number, label: string) =>
  `<td width="85" style="padding:14px 0 14px 12px;text-align:right;"><div style="font-size:15px;font-weight:900;color:#222;">${formatNumber(value)}</div><div style="font-size:9px;color:#888;margin-top:3px;text-transform:uppercase;letter-spacing:.5px;">${label}</div></td>`;

const listRows = (rows: string[], columns: number) =>
  rows
    .map(
      (row, index) =>
        `${row}${index < rows.length - 1 ? `<tr><td colspan="${columns}" style="border-top:1px solid #e9e9e9;"></td></tr>` : ""}`,
    )
    .join("");

const listBox = (rows: string) =>
  `<div style="background:#f9f9f9;border:1px solid #e5e5e5;border-radius:8px;padding:4px 14px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${rows}</table></div>`;

export const renderTopTracks = (tracks: ArtistReport["topTracks"]) => {
  if (tracks.length === 0) return "";

  const rows = tracks.slice(0, 5).map((track, index) => {
    const badge = track.isCampaignSong
      ? ' <span style="font-size:9px;font-weight:900;color:#07a83b;text-transform:uppercase;letter-spacing:.5px;">&middot; This campaign</span>'
      : "";
    return `<tr>${rankCell(index)}<td style="padding:14px 0;"><div style="font-size:13px;font-weight:800;color:#222;">${escapeHtml(track.title)}${badge}</div><div style="font-size:10px;color:#888;margin-top:3px;">${escapeHtml(track.artists)}</div></td>${valueCell(track.playlists, "Playlists")}</tr>`;
  });

  return `<div style="margin-top:24px;">${sectionLabel("Top Tracks", "The artist's tracks on the most playlists.")}${listBox(listRows(rows, 3))}</div>`;
};

export const renderListenerLocations = (audience: ArtistReport["audience"]) => {
  const cities = audience.cities
    .slice(0, 5)
    .map(
      (city, index) =>
        `<tr>${rankCell(index)}<td style="padding:14px 0;"><div style="font-size:13px;font-weight:800;color:#222;">${escapeHtml(city.city)}</div><div style="font-size:10px;color:#888;margin-top:3px;">${escapeHtml(city.country)}</div></td>${valueCell(city.listeners, "Listeners")}</tr>`,
    );
  const countries = audience.countries
    .slice(0, 5)
    .map(
      (country, index) =>
        `<tr>${rankCell(index)}<td style="padding:14px 0;"><div style="font-size:13px;font-weight:800;color:#222;">${escapeHtml(country.country)}</div></td>${valueCell(country.listeners, "Listeners")}</tr>`,
    );

  return [
    cities.length
      ? `<div style="margin-top:24px;">${sectionLabel("Top Cities", "Where the artist's monthly listeners are.")}${listBox(listRows(cities, 3))}</div>`
      : "",
    countries.length
      ? `<div style="margin-top:24px;">${sectionLabel("Top Countries", "Totals of the top listener cities in each country.")}${listBox(listRows(countries, 3))}</div>`
      : "",
  ].join("");
};
