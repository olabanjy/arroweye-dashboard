"use client";

import React, { useRef, useState } from "react";
import { toast } from "sonner";

import { validateEventAttachment } from "./use-event-attachments";

interface UseAttachmentPickerOptions {
  onFiles: (files: File[]) => void;
  multiple: boolean;
  disabled: boolean;
}

/** Shared by the file browser and drag-and-drop so both validate the same way. */
export const useAttachmentPicker = ({
  onFiles,
  multiple,
  disabled,
}: UseAttachmentPickerOptions) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const accept = (fileList: FileList | null) => {
    const files = Array.from(fileList ?? []).slice(0, multiple ? undefined : 1);
    const valid = files.filter((file) => {
      const error = validateEventAttachment(file);
      if (error) toast.error(`${file.name}: ${error}`);
      return !error;
    });
    if (valid.length) onFiles(valid);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    accept(event.target.files);
    event.target.value = "";
  };

  const handleDragOver = (event: React.DragEvent<HTMLElement>) => {
    if (!event.dataTransfer.types.includes("Files")) return;
    // Without preventDefault the browser opens the dropped file instead.
    event.preventDefault();
    event.dataTransfer.dropEffect = disabled ? "none" : "copy";
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLElement>) => {
    // Moving onto a child element also fires dragleave on the zone.
    if (event.currentTarget.contains(event.relatedTarget as Node | null))
      return;
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (!disabled) accept(event.dataTransfer.files);
  };

  return {
    inputRef,
    isDragging,
    openBrowser: () => inputRef.current?.click(),
    handleChange,
    dropzoneProps: {
      onDragEnter: handleDragOver,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    },
  };
};
