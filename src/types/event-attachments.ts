export interface EventAttachment {
  key: string;
  fileName: string;
  uploadedAt: string;
}

export interface EventAttachmentUploadParams {
  uploadUrl: string;
  contentType: string;
}

export type EventAttachmentResult<T> =
  | ({ success: true } & T)
  | { success: false; message: string };
