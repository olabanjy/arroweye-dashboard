import "server-only";

import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const RADIO_MONITOR_CONTENT_TYPES = {
  pdf: "application/pdf",
} as const;
type RadioMonitorFormat = keyof typeof RADIO_MONITOR_CONTENT_TYPES;
export const RADIO_MONITOR_MAX_BYTES = 10 * 1024 * 1024;

const UPLOAD_URL_TTL_SECONDS = 300;
const DOWNLOAD_URL_TTL_SECONDS = 300;

export interface StoredRadioMonitor {
  key: string;
  fileName: string;
  uploadedAt: string;
}

let client: S3Client | undefined;

export const getConfig = () => {
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucket = process.env.R2_BUCKET?.trim();
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
    throw new Error("The file service is not configured.");
  }

  const endpoint = `https://${accountId}.r2.cloudflarestorage.com`;
  client ??= new S3Client({
    region: "auto",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });
  return { client, bucket, endpoint };
};

// One shared report: every campaign looks for its song in the newest upload.
const RADIO_MONITOR_FOLDER = "radio-monitor/shared/";

// Keys are `<folder><timestamp>-<name>`; strip the timestamp for display.
const toFileName = (key: string) =>
  key.split("/").pop()?.replace(/^\d+-/, "") ?? key;

const toSafeFileName = (fileName: string, fallback = "radio-monitor") => {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
  const base = fileName
    .slice(0, -(extension.length + 1))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return `${base || fallback}.${extension}`;
};

const getFormat = (fileName: string) =>
  fileName.split(".").pop()?.toLowerCase() ?? "";

export const isRadioMonitorFormat = (
  fileName: string,
): fileName is `${string}.${RadioMonitorFormat}` =>
  Object.hasOwn(RADIO_MONITOR_CONTENT_TYPES, getFormat(fileName));

export const createRadioMonitorUpload = async (fileName: string) => {
  const { client, bucket, endpoint } = getConfig();
  const contentType =
    RADIO_MONITOR_CONTENT_TYPES[getFormat(fileName) as RadioMonitorFormat];
  const key = `${RADIO_MONITOR_FOLDER}${Date.now()}-${toSafeFileName(fileName)}`;
  const uploadUrl = await getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: UPLOAD_URL_TTL_SECONDS },
  );

  return {
    uploadUrl,
    contentType,
    // Private object location, recorded with the backend; not publicly readable.
    fileUrl: `${endpoint}/${bucket}/${key}`,
  };
};

/** Every upload, newest first. */
export const listRadioMonitors = async (): Promise<StoredRadioMonitor[]> => {
  const { client, bucket } = getConfig();
  const { Contents = [] } = await client.send(
    new ListObjectsV2Command({ Bucket: bucket, Prefix: RADIO_MONITOR_FOLDER }),
  );

  return Contents.filter((object) => object.Key)
    .sort(
      (a, b) =>
        (b.LastModified?.getTime() ?? 0) - (a.LastModified?.getTime() ?? 0),
    )
    .map((object) => ({
      key: object.Key!,
      fileName: toFileName(object.Key!),
      uploadedAt: (object.LastModified ?? new Date()).toISOString(),
    }));
};

export const findLatestRadioMonitor =
  async (): Promise<StoredRadioMonitor | null> =>
    (await listRadioMonitors())[0] ?? null;

export const readRadioMonitor = async (file: StoredRadioMonitor) => {
  const { client, bucket } = getConfig();
  const { Body } = await client.send(
    new GetObjectCommand({ Bucket: bucket, Key: file.key }),
  );
  if (!Body) throw new Error("The radio monitor file is empty.");
  return Body.transformToByteArray();
};

export const getRadioMonitorDownloadUrl = (file: StoredRadioMonitor) => {
  const { client, bucket } = getConfig();
  return getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: bucket,
      Key: file.key,
      ResponseContentDisposition: `attachment; filename="${file.fileName}"`,
    }),
    { expiresIn: DOWNLOAD_URL_TTL_SECONDS },
  );
};

const EVENT_ATTACHMENT_CONTENT_TYPES = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  csv: "text/csv",
  txt: "text/plain",
} as const;
type EventAttachmentFormat = keyof typeof EVENT_ATTACHMENT_CONTENT_TYPES;
export const EVENT_ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;

export interface StoredEventAttachment {
  key: string;
  fileName: string;
  uploadedAt: string;
}

// Events have no attachment field in the API, so files live here keyed by event id.
const eventAttachmentFolder = (eventId: number) =>
  `event-attachments/${eventId}/`;

export const isEventAttachmentFormat = (fileName: string) =>
  Object.hasOwn(EVENT_ATTACHMENT_CONTENT_TYPES, getFormat(fileName));

export const isEventAttachmentKey = (eventId: number, key: string) =>
  key.startsWith(eventAttachmentFolder(eventId)) && !key.includes("..");

export const createEventAttachmentUpload = async (
  eventId: number,
  fileName: string,
) => {
  const { client, bucket } = getConfig();
  const contentType =
    EVENT_ATTACHMENT_CONTENT_TYPES[getFormat(fileName) as EventAttachmentFormat];
  const key = `${eventAttachmentFolder(eventId)}${Date.now()}-${toSafeFileName(fileName, "attachment")}`;
  const uploadUrl = await getSignedUrl(
    client,
    new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
    { expiresIn: UPLOAD_URL_TTL_SECONDS },
  );

  return { uploadUrl, contentType };
};

/** Oldest first, so files keep the order they were added in. */
export const listEventAttachments = async (
  eventId: number,
): Promise<StoredEventAttachment[]> => {
  const { client, bucket } = getConfig();
  const { Contents = [] } = await client.send(
    new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: eventAttachmentFolder(eventId),
    }),
  );

  return Contents.filter((object) => object.Key)
    .sort(
      (a, b) =>
        (a.LastModified?.getTime() ?? 0) - (b.LastModified?.getTime() ?? 0),
    )
    .map((object) => ({
      key: object.Key!,
      fileName: toFileName(object.Key!),
      uploadedAt: (object.LastModified ?? new Date()).toISOString(),
    }));
};

export const getEventAttachmentDownloadUrl = (key: string) => {
  const { client, bucket } = getConfig();
  return getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${toFileName(key)}"`,
    }),
    { expiresIn: DOWNLOAD_URL_TTL_SECONDS },
  );
};

export const deleteEventAttachment = async (key: string) => {
  const { client, bucket } = getConfig();
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
};
