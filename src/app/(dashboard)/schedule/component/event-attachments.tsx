"use client";

import React, { useState } from "react";
import { Download, FileText, Loader2, Paperclip, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EVENT_ATTACHMENT_ACCEPT } from "../hooks/use-event-attachments";
import { useAttachmentPicker } from "../hooks/use-attachment-picker";

export interface AttachmentItem {
  key: string;
  name: string;
  meta?: string;
}

const iconButtonClassName =
  "flex size-7 shrink-0 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-200 hover:text-zinc-800 disabled:pointer-events-none disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100";

export const formatFileSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const RemoveButton = ({
  name,
  isRemoving,
  confirm,
  onRemove,
}: {
  name: string;
  isRemoving: boolean;
  confirm: boolean;
  onRemove: () => void;
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const trigger = (
    <button
      type="button"
      onClick={confirm ? undefined : onRemove}
      disabled={isRemoving}
      className={cn(iconButtonClassName, "hover:text-red-600")}
    >
      {isRemoving ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <X className="size-3.5" />
      )}
      <span className="sr-only">Remove {name}</span>
    </button>
  );

  if (!confirm) return trigger;

  return (
    <Popover open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align="end" className="w-64 gap-3 p-3">
        <div>
          <p className="text-[14px] font-medium">Remove attachment?</p>
          <p className="mt-1 break-words text-[13px] text-zinc-500 dark:text-zinc-400">
            {name} will be permanently deleted.
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800"
            onClick={() => setIsConfirmOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            className="rounded-lg bg-red-600 text-white hover:bg-red-700"
            onClick={() => {
              setIsConfirmOpen(false);
              onRemove();
            }}
          >
            Remove
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const AttachmentList = ({
  items,
  removingKey,
  confirmRemove = false,
  onOpen,
  onRemove,
}: {
  items: AttachmentItem[];
  removingKey?: string | null;
  /** Ask first when removal deletes a stored file rather than a pending one. */
  confirmRemove?: boolean;
  onOpen?: (key: string) => void;
  onRemove: (key: string) => void;
}) =>
  items.length ? (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li
          key={item.key}
          className="flex items-center gap-2.5 rounded-lg bg-zinc-100 py-1.5 pl-2.5 pr-1.5 dark:bg-zinc-800"
        >
          <FileText className="size-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] text-zinc-900 dark:text-zinc-100">
              {item.name}
            </p>
            {item.meta && (
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {item.meta}
              </p>
            )}
          </div>
          {onOpen && (
            <button
              type="button"
              onClick={() => onOpen(item.key)}
              className={iconButtonClassName}
            >
              <Download className="size-3.5" />
              <span className="sr-only">Download {item.name}</span>
            </button>
          )}
          <RemoveButton
            name={item.name}
            isRemoving={removingKey === item.key}
            confirm={confirmRemove}
            onRemove={() => onRemove(item.key)}
          />
        </li>
      ))}
    </ul>
  ) : null;

export const AddAttachmentButton = ({
  onFiles,
  isUploading = false,
  multiple = true,
}: {
  onFiles: (files: File[]) => void;
  isUploading?: boolean;
  multiple?: boolean;
}) => {
  const picker = useAttachmentPicker({
    onFiles,
    multiple,
    disabled: isUploading,
  });

  return (
    <>
      <input
        ref={picker.inputRef}
        type="file"
        accept={EVENT_ATTACHMENT_ACCEPT}
        multiple={multiple}
        className="sr-only"
        tabIndex={-1}
        onChange={picker.handleChange}
      />
      <div {...picker.dropzoneProps}>
        <button
          type="button"
          disabled={isUploading}
          onClick={picker.openBrowser}
          className={cn(
            "flex min-h-14 w-full flex-col items-center justify-center gap-0.5 rounded-lg border border-dashed border-zinc-300 px-3 py-2.5 text-[13px] text-zinc-600 transition-colors hover:border-zinc-400 hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800",
            picker.isDragging &&
              "border-violet-500 bg-violet-50 text-violet-700 dark:border-violet-400 dark:bg-violet-500/10 dark:text-violet-300",
          )}
        >
          <span className="flex items-center gap-2">
            {isUploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Paperclip className="size-4" />
            )}
            {isUploading
              ? "Uploading…"
              : picker.isDragging
                ? "Drop to attach"
                : "Drag files here or click to browse"}
          </span>
          {!isUploading && !picker.isDragging && (
            <span className="text-[11px] text-zinc-400">
              PDF, images, Office, CSV or text · 10MB max
            </span>
          )}
        </button>
      </div>
    </>
  );
};
