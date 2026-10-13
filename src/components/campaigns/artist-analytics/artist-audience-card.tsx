"use client";

import { DataList, type DataListColumn } from "@/components/ui/data-list";
import { compactNumber } from "./format";
import type {
  ListenerCity,
  ListenerCountry,
} from "./hooks/use-artist-audience";

const listenersColumn = <
  Row extends { listeners: number },
>(): DataListColumn<Row> => ({
  key: "listeners",
  header: "Listeners",
  className: "text-muted-foreground",
  render: (row) => (
    <span title={row.listeners.toLocaleString()}>
      {compactNumber.format(row.listeners)}
    </span>
  ),
});

const cityColumns: DataListColumn<ListenerCity>[] = [
  {
    key: "city",
    header: "City",
    width: "minmax(0, 2fr)",
    className: "font-[600] text-foreground",
    render: (row) => (
      <span className="block truncate" title={`${row.city}, ${row.country}`}>
        {row.city}
        <span className="ml-1 font-[400] text-muted-foreground">
          · {row.country}
        </span>
      </span>
    ),
  },
  listenersColumn<ListenerCity>(),
];

const countryColumns: DataListColumn<ListenerCountry>[] = [
  {
    key: "country",
    header: "Country",
    width: "minmax(0, 2fr)",
    className: "font-[600] text-foreground",
    render: (row) => <span className="block truncate">{row.country}</span>,
  },
  listenersColumn<ListenerCountry>(),
];

interface ArtistAudienceCardProps {
  cities: ListenerCity[];
  countries: ListenerCountry[];
  loading?: boolean;
}

/** Where the artist's monthly listeners are, by city and by country. */
export function ArtistAudienceCard({
  cities,
  countries,
  loading = false,
}: ArtistAudienceCardProps) {
  return (
    <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2">
      <DataList
        title="Top Cities"
        label="listener"
        columns={cityColumns}
        rows={cities}
        getRowKey={(row) => `${row.countryCode}-${row.city}`}
        showRank
        loading={loading}
      />
      <DataList
        title="Top Countries"
        label="listener"
        columns={countryColumns}
        rows={countries}
        getRowKey={(row) => row.code}
        showRank
        loading={loading}
        footer={
          countries.length > 0 ? (
            <p className="font-SansFlex text-[12px] text-muted-foreground">
              Totals of the top listener cities in each country.
            </p>
          ) : undefined
        }
      />
    </div>
  );
}
