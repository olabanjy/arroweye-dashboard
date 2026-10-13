"use client";

import { DataList, type DataListColumn } from "@/components/ui/data-list";
import { compactNumber } from "./format";
import type { ArtistTopTrack } from "./hooks/use-artist-top-tracks";

const columns: DataListColumn<ArtistTopTrack>[] = [
  {
    key: "track",
    header: "Track",
    width: "minmax(0, 3fr)",
    render: (row) => (
      <div className="flex min-w-0 items-center gap-3">
        {row.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={row.image}
            alt=""
            className="size-9 shrink-0 rounded-[4px] object-cover"
          />
        )}
        <div className="min-w-0">
          <p className="truncate font-[600] text-foreground" title={row.title}>
            {row.title}
            {row.isCampaignSong && (
              <span className="ml-2 rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-[600] uppercase tracking-wider text-green-600">
                This campaign
              </span>
            )}
          </p>
          <p
            className="truncate text-[12px] text-muted-foreground"
            title={row.artists}
          >
            {row.artists}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "playlists",
    header: "Playlists",
    className: "text-muted-foreground",
    render: (row) => (
      <span title={row.playlists.toLocaleString()}>
        {compactNumber.format(row.playlists)}
      </span>
    ),
  },
];

interface ArtistTopTracksCardProps {
  tracks: ArtistTopTrack[];
  loading?: boolean;
}

/** The artist's catalog ranked by playlist placements. */
export function ArtistTopTracksCard({
  tracks,
  loading = false,
}: ArtistTopTracksCardProps) {
  return (
    <DataList
      title="Top Tracks"
      label="track"
      columns={columns}
      rows={tracks}
      getRowKey={(row) => row.id}
      showRank
      loading={loading}
    />
  );
}
