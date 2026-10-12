import "server-only";

import { readRadioMonitor, type StoredRadioMonitor } from "@/lib/storage/r2";

import { parseTop100Chart, type Top100Chart } from "./parse-top-100-chart";
import {
  findStationPlay,
  type RadioStationPlay,
} from "./radio-monitor-summary";

const MAX_STATIONS = 5;

const isPdf = (file: StoredRadioMonitor) =>
  file.fileName.toLowerCase().endsWith(".pdf");

const readChart = async (
  file: StoredRadioMonitor,
): Promise<Top100Chart | undefined> => {
  try {
    return await parseTop100Chart(await readRadioMonitor(file));
  } catch (error) {
    // One unreadable upload shouldn't hide the stations that did parse.
    console.error(`Radio monitor ${file.key} could not be read:`, error);
    return undefined;
  }
};

/**
 * Ranks the stations playing the campaign's song. Each upload is one
 * station's Radiomonitor Top 100 PDF; only the newest chart per station counts.
 */
export const loadRadioStationPlays = async (
  files: StoredRadioMonitor[],
  song: { title: string; artist: string },
): Promise<RadioStationPlay[]> => {
  const charts = await Promise.all(files.filter(isPdf).map(readChart));
  const latestByStation = new Map<string, Top100Chart>();

  // Files arrive newest first, so the first chart seen for a station wins.
  for (const chart of charts) {
    if (chart && !latestByStation.has(chart.station)) {
      latestByStation.set(chart.station, chart);
    }
  }

  const plays = [...latestByStation.values()]
    .map((chart) => findStationPlay(chart, song.title, song.artist))
    .filter((play): play is RadioStationPlay => Boolean(play));

  if (plays.length === 0) {
    console.warn(
      `Radio monitor: "${song.title}" by "${song.artist}" is not on any uploaded chart (checked ${latestByStation.size} of ${files.length} files: ${[...latestByStation.keys()].join(", ") || "none parsed"}).`,
    );
  }

  return plays.sort((a, b) => b.plays - a.plays).slice(0, MAX_STATIONS);
};
