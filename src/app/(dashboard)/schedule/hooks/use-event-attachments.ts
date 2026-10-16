"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getEventAttachmentDownload,
  getEventAttachments,
  getEventAttachmentUploadSignature,
  removeEventAttachment,
} from "@/actions/event-attachments";

export const EVENT_ATTACHMENT_ACCEPT =
  ".pdf,.png,.jpg,.jpeg,.webp,.docx,.xlsx,.pptx,.csv,.txt";
const EVENT_ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;

const attachmentsKey = (eventId: string | number) => [
  "event-attachments",
  String(eventId),
];

export const validateEventAttachment = (file: File) => {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!EVENT_ATTACHMENT_ACCEPT.split(",").includes(`.${extension}`)) {
    return "Upload a PDF, image, Office document, CSV or text file.";
  }
  if (file.size > EVENT_ATTACHMENT_MAX_BYTES) {
    return "Files must be 10MB or smaller.";
  }
  return null;
};

export const uploadEventAttachment = async (
  eventId: string | number,
  file: File,
) => {
  const validationError = validateEventAttachment(file);
  if (validationError) throw new Error(validationError);

  const signed = await getEventAttachmentUploadSignature(
    eventId,
    file.name,
    file.size,
  );
  if (!signed.success) throw new Error(signed.message);

  const response = await fetch(signed.upload.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": signed.upload.contentType },
    body: file,
  });
  if (!response.ok) {
    console.error(
      "Event attachment storage upload failed:",
      response.status,
      await response.text().catch(() => ""),
    );
    throw new Error(`${file.name} could not be uploaded. Please try again.`);
  }
};

export const useEventAttachments = (eventId?: string | number) => {
  const queryClient = useQueryClient();
  const queryKey = attachmentsKey(eventId ?? "");

  const attachmentsQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await getEventAttachments(eventId!);
      if (!result.success) throw new Error(result.message);
      return result.attachments;
    },
    enabled: Boolean(eventId),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadEventAttachment(eventId!, file),
    onSuccess: () => {
      toast.success("Attachment added.");
      void refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  const removeMutation = useMutation({
    mutationFn: async (key: string) => {
      const result = await removeEventAttachment(eventId!, key);
      if (!result.success) throw new Error(result.message);
    },
    onSuccess: () => void refresh(),
    onError: (error) => toast.error(error.message),
  });

  const download = async (key: string) => {
    const result = await getEventAttachmentDownload(eventId!, key);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    window.open(result.url, "_blank", "noopener,noreferrer");
  };

  return {
    attachments: attachmentsQuery.data ?? [],
    isLoading: attachmentsQuery.isLoading,
    error: attachmentsQuery.error?.message,
    upload: uploadMutation.mutate,
    isUploading: uploadMutation.isPending,
    remove: removeMutation.mutate,
    removingKey: removeMutation.isPending ? removeMutation.variables : null,
    download,
  };
};

export type EventAttachmentsState = ReturnType<typeof useEventAttachments>;
