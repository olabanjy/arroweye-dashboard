import "server-only";

import type { ArtistReport } from "@/lib/music-analytics/artist/load-artist-report";

import {
  renderAudienceSummary,
  renderListenerLocations,
  renderPlatformSnapshot,
  renderTopTracks,
} from "./artist-report/sections";
import {
  asString,
  detailRow,
  escapeHtml,
  formatDateTime,
  formatNumber,
  safeUrl,
} from "./campaign-report/utils";

interface ArtistReportTemplateInput {
  project: Record<string, unknown>;
  report: ArtistReport;
  campaignId: string;
  generatedAt: Date;
}

export function renderArtistReportEmail({
  project,
  report,
  campaignId,
  generatedAt,
}: ArtistReportTemplateInput) {
  const reportLink = safeUrl(
    `https://studio.arroweye.pro/campaigns/${campaignId}/artist`,
  );
  const artistName =
    report.profile.artist.name ||
    asString(project.artist_name || project.song_artist) ||
    "Artist";
  const campaignName = asString(project.title || project.song_title);
  const detailRows = [
    detailRow("Artist", artistName, true),
    detailRow("Genres", report.profile.artist.genres.slice(0, 4).join(", ")),
    detailRow("Campaign", campaignName),
    detailRow("Growth period", `Last ${report.days} days`),
    detailRow("Generated", formatDateTime(generatedAt)),
  ].join("");
  const sections = [
    renderAudienceSummary(report.summary),
    renderPlatformSnapshot(report),
    renderTopTracks(report.topTracks),
    renderListenerLocations(report.audience),
  ].join("");

  const html = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>Artist Report | Arroweye Pro</title></head><body style="background-color:#f9f9f9;font-family:Avenir,Arial,sans-serif;margin:0;padding:0;-webkit-font-smoothing:antialiased;color:#333;"><div style="display:none;max-height:0;overflow:hidden;opacity:0;">Artist report for ${escapeHtml(artistName)}</div><div style="max-width:600px;margin:28px auto;padding:5px 1px 1px;background-color:#ff7400;background-image:linear-gradient(to right,#ff006d,#ff7f00,#ffff00,#00ff00,#147aff);box-shadow:0 8px 30px rgba(0,0,0,.045);text-align:left;"><div style="padding:22px 20px 40px 20px;background-color:#fff;"><div style="text-align:left;margin-top:14px;margin-bottom:28px;"><img src="https://res.cloudinary.com/dyueswnzk/image/upload/v1759783466/studio_2_hajzkn.png" alt="Arroweye" width="120"></div><div style="font-size:24px;line-height:1.15;font-weight:900;color:#222;">Artist Report</div><div style="background:#fafafa;padding:13px 15px;border-radius:10px;margin-top:16px;border:1px solid #e7e7e7;"><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;font-size:14px;">${detailRows}</table></div>${sections}<div style="text-align:center;margin-top:35px;"><a href="${reportLink}" style="display:inline-block;font-size:13px;font-weight:900;color:#fff;background-color:#ff7400;padding:11px 24px;text-decoration:none;border-radius:999px;line-height:20px;">View Artist Dashboard</a></div><div style="text-align:center;margin-top:20px;padding:15px 0;"></div></div></div></body></html>`;

  const text = [
    `${artistName} | Artist Report`,
    campaignName ? `Campaign: ${campaignName}` : "",
    report.summary ?? "",
    ...report.profile.platforms.map((platform) => {
      const growth = report.growth.find(
        (entry) => entry.code === platform.code,
      );
      const followers =
        platform.followers === null
          ? "no linked account"
          : `${formatNumber(platform.followers)} followers`;
      const change =
        growth?.percent === null || growth?.percent === undefined
          ? ""
          : ` (${growth.percent >= 0 ? "up" : "down"} ${Math.abs(growth.percent).toLocaleString("en", { maximumFractionDigits: 1 })}% over ${report.days} days)`;
      return `${platform.label}: ${followers}${change}`;
    }),
    report.topTracks.length
      ? `Top tracks:\n${report.topTracks
          .slice(0, 5)
          .map(
            (track, index) =>
              `${index + 1}. ${track.title} (${formatNumber(track.playlists)} playlists)`,
          )
          .join("\n")}`
      : "",
    `View artist dashboard: ${reportLink}`,
  ]
    .filter(Boolean)
    .join("\n");

  return { html, text, subject: `${artistName} | Artist Report` };
}
