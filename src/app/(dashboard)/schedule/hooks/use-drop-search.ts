"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getCampaignDropZones } from "@/services";
import type { EventDrop } from "@/types/event-drops";
import { toEventDrop } from "./use-event-drops";

interface UseDropSearchOptions {
  campaignId?: number | string;
  excludeIds: number[];
  onSelect: (drop: EventDrop) => void;
}

export const useDropSearch = ({
  campaignId,
  excludeIds,
  onSelect,
}: UseDropSearchOptions) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isOpen) setQuery("");
  }, [isOpen]);

  const dropsQuery = useQuery({
    queryKey: ["dropzones", "campaign", String(campaignId)],
    queryFn: () => getCampaignDropZones(campaignId!),
    enabled: isOpen && Boolean(campaignId),
    staleTime: 60_000,
  });

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return (dropsQuery.data ?? [])
      .map(toEventDrop)
      .filter(
        (drop) =>
          !excludeIds.includes(drop.id) &&
          (!normalized || drop.name.toLowerCase().includes(normalized)),
      );
  }, [dropsQuery.data, excludeIds, query]);

  const select = (drop: EventDrop) => {
    onSelect(drop);
    setIsOpen(false);
  };

  return {
    isOpen,
    setIsOpen,
    query,
    setQuery,
    results,
    hasCampaign: Boolean(campaignId),
    isLoading: dropsQuery.isFetching,
    error: dropsQuery.error ? "Attachments could not be loaded." : null,
    select,
  };
};
