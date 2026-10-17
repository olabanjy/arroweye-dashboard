"use server";

import { getAuthorizedEvent } from "@/lib/server/get-authorized-event";
import { readEventDrops, writeEventDrops } from "@/lib/storage/r2";
import type { EventDrop, EventDropsResult } from "@/types/event-drops";

const MAX_EVENT_DROPS = 50;

const toEventId = (value: number | string) => {
  const eventId = Number(value);
  return Number.isInteger(eventId) && eventId > 0 ? eventId : null;
};

const toOptionalText = (value: unknown, maxLength: number) =>
  typeof value === "string" && value.trim()
    ? value.trim().slice(0, maxLength)
    : null;

const sanitizeDrops = (input: unknown): EventDrop[] | null => {
  if (!Array.isArray(input) || input.length > MAX_EVENT_DROPS) return null;

  const drops: EventDrop[] = [];
  for (const item of input) {
    const id = Number(item?.id);
    if (!Number.isInteger(id) || id <= 0) return null;
    if (drops.some((drop) => drop.id === id)) continue;
    drops.push({
      id,
      name: toOptionalText(item.name, 200) ?? `Attachment ${id}`,
      link: toOptionalText(item.link, 2000),
      type: toOptionalText(item.type, 50),
    });
  }
  return drops;
};

/**
 * Auth failures carry our own user-facing messages; storage failures are
 * logged and replaced with `fallback` so provider errors never reach the UI.
 */
const withAuthorizedEvent = async <T>(
  eventIdInput: number | string,
  fallback: string,
  run: (eventId: number) => Promise<T>,
): Promise<EventDropsResult<T>> => {
  const eventId = toEventId(eventIdInput);
  if (!eventId) return { success: false, message: "This event was not found." };

  try {
    await getAuthorizedEvent(eventId);
  } catch (error) {
    console.error("Event drops authorization failed:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : fallback,
    };
  }

  try {
    return { success: true, ...(await run(eventId)) };
  } catch (error) {
    console.error("Event drops storage failed:", error);
    return { success: false, message: fallback };
  }
};

export async function getEventDrops(
  eventId: number | string,
): Promise<EventDropsResult<{ drops: EventDrop[] }>> {
  return withAuthorizedEvent(
    eventId,
    "Attachments could not be loaded.",
    async (id) => ({ drops: await readEventDrops(id) }),
  );
}

export async function saveEventDrops(
  eventId: number | string,
  dropsInput: EventDrop[],
): Promise<EventDropsResult<{ drops: EventDrop[] }>> {
  const drops = sanitizeDrops(dropsInput);
  if (!drops) {
    return {
      success: false,
      message: "These attachments could not be added.",
    };
  }

  return withAuthorizedEvent(
    eventId,
    "Attachments could not be saved.",
    async (id) => {
      await writeEventDrops(id, drops);
      return { drops };
    },
  );
}
