"use server";

import { getAuthorizedEvent } from "@/lib/server/get-authorized-event";
import {
  createEventAttachmentUpload,
  deleteEventAttachment,
  EVENT_ATTACHMENT_MAX_BYTES,
  getEventAttachmentDownloadUrl,
  isEventAttachmentFormat,
  isEventAttachmentKey,
  listEventAttachments,
} from "@/lib/storage/r2";
import type {
  EventAttachment,
  EventAttachmentResult,
  EventAttachmentUploadParams,
} from "@/types/event-attachments";

const toEventId = (value: number | string) => {
  const eventId = Number(value);
  return Number.isInteger(eventId) && eventId > 0 ? eventId : null;
};

/**
 * Auth failures carry our own user-facing messages; storage failures are
 * logged and replaced with `fallback` so provider errors never reach the UI.
 */
const withAuthorizedEvent = async <T>(
  eventIdInput: number | string,
  fallback: string,
  run: (eventId: number) => Promise<T>,
): Promise<EventAttachmentResult<T>> => {
  const eventId = toEventId(eventIdInput);
  if (!eventId) return { success: false, message: "This event was not found." };

  try {
    await getAuthorizedEvent(eventId);
  } catch (error) {
    console.error("Event attachment authorization failed:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : fallback,
    };
  }

  try {
    return { success: true, ...(await run(eventId)) };
  } catch (error) {
    console.error("Event attachment storage failed:", error);
    return { success: false, message: fallback };
  }
};

export async function getEventAttachments(
  eventId: number | string,
): Promise<EventAttachmentResult<{ attachments: EventAttachment[] }>> {
  return withAuthorizedEvent(
    eventId,
    "Attachments could not be loaded.",
    async (id) => ({ attachments: await listEventAttachments(id) }),
  );
}

export async function getEventAttachmentUploadSignature(
  eventId: number | string,
  fileNameInput: string,
  fileSize: number,
): Promise<EventAttachmentResult<{ upload: EventAttachmentUploadParams }>> {
  const fileName = String(fileNameInput ?? "")
    .trim()
    .slice(0, 200);

  if (!isEventAttachmentFormat(fileName)) {
    return {
      success: false,
      message: "Upload a PDF, image, Office document, CSV or text file.",
    };
  }
  if (
    !Number.isFinite(fileSize) ||
    fileSize <= 0 ||
    fileSize > EVENT_ATTACHMENT_MAX_BYTES
  ) {
    return { success: false, message: "Files must be 10MB or smaller." };
  }

  return withAuthorizedEvent(
    eventId,
    "The upload could not be started.",
    async (id) => ({ upload: await createEventAttachmentUpload(id, fileName) }),
  );
}

export async function getEventAttachmentDownload(
  eventId: number | string,
  key: string,
): Promise<EventAttachmentResult<{ url: string }>> {
  return withAuthorizedEvent(
    eventId,
    "The file could not be downloaded.",
    async (id) => {
      if (!isEventAttachmentKey(id, key)) throw new Error("Key not in event.");
      return { url: await getEventAttachmentDownloadUrl(key) };
    },
  );
}

export async function removeEventAttachment(
  eventId: number | string,
  key: string,
): Promise<EventAttachmentResult<object>> {
  return withAuthorizedEvent(
    eventId,
    "The file could not be removed.",
    async (id) => {
      if (!isEventAttachmentKey(id, key)) throw new Error("Key not in event.");
      await deleteEventAttachment(key);
      return {};
    },
  );
}
