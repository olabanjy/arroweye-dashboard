"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getEventDrops, saveEventDrops } from "@/actions/event-drops";
import type { DropZone } from "@/types/api";
import type { EventDrop } from "@/types/event-drops";

const eventDropsKey = (eventId: string | number) => [
  "event-drops",
  String(eventId),
];

export const toEventDrop = (drop: DropZone): EventDrop => ({
  id: drop.id,
  name: drop.folder_name || `Attachment ${drop.id}`,
  link: drop.link ?? null,
  type: drop.drop_type || null,
});

export const openDropLink = (link: string | null) => {
  if (!link) {
    toast.error("This attachment has no link.");
    return;
  }
  const url = /^https?:\/\//.test(link) ? link : `https://${link}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

export const linkEventDrops = async (
  eventId: string | number,
  drops: EventDrop[],
) => {
  const result = await saveEventDrops(eventId, drops);
  if (!result.success) throw new Error(result.message);
  return result.drops;
};

export const useEventDrops = (eventId?: string | number) => {
  const queryClient = useQueryClient();
  const queryKey = eventDropsKey(eventId ?? "");

  const dropsQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await getEventDrops(eventId!);
      if (!result.success) throw new Error(result.message);
      return result.drops;
    },
    enabled: Boolean(eventId),
  });

  const drops = dropsQuery.data ?? [];

  const saveMutation = useMutation({
    mutationFn: (next: EventDrop[]) => linkEventDrops(eventId!, next),
    onSuccess: (saved) => queryClient.setQueryData(queryKey, saved),
    onError: (error) => toast.error(error.message),
  });

  return {
    drops,
    isLoading: dropsQuery.isLoading,
    error: dropsQuery.error?.message,
    isSaving: saveMutation.isPending,
    attach: (drop: EventDrop) => saveMutation.mutate([...drops, drop]),
    detach: (dropId: number) =>
      saveMutation.mutate(drops.filter((drop) => drop.id !== dropId)),
  };
};

export type EventDropsState = ReturnType<typeof useEventDrops>;
