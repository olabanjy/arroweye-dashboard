"use client";

import React, { useState } from "react";
import { ExternalLink, FileText, Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { EventDrop } from "@/types/event-drops";
import { useDropSearch } from "../hooks/use-drop-search";
import { openDropLink } from "../hooks/use-event-drops";
import { iconClassName, triggerClassName } from "./event-fields";

const iconButtonClassName =
  "flex size-7 shrink-0 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-200 hover:text-zinc-800 disabled:pointer-events-none disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100";

const RemoveButton = ({
  name,
  disabled,
  confirm,
  onRemove,
}: {
  name: string;
  disabled: boolean;
  confirm: boolean;
  onRemove: () => void;
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const trigger = (
    <button
      type="button"
      onClick={confirm ? undefined : onRemove}
      disabled={disabled}
      className={cn(iconButtonClassName, "hover:text-red-600")}
    >
      <X className="size-3.5" />
      <span className="sr-only">Unlink {name}</span>
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
            {name} will be unlinked from this event.
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

export const LinkedDropList = ({
  drops,
  disabled = false,
  confirmRemove = false,
  onRemove,
}: {
  drops: EventDrop[];
  disabled?: boolean;
  /** Ask first when unlinking a saved drop rather than a pending one. */
  confirmRemove?: boolean;
  onRemove: (dropId: number) => void;
}) =>
  drops.length ? (
    <ul className="space-y-1.5">
      {drops.map((drop) => (
        <li
          key={drop.id}
          className="flex items-center gap-2.5 rounded-lg bg-zinc-100 py-1.5 pl-2.5 pr-1.5 dark:bg-zinc-800"
        >
          <FileText className="size-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] text-zinc-900 dark:text-zinc-100">
              {drop.name}
            </p>
            {drop.type && (
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {drop.type}
              </p>
            )}
          </div>
          {drop.link && (
            <button
              type="button"
              onClick={() => openDropLink(drop.link)}
              className={iconButtonClassName}
            >
              <ExternalLink className="size-3.5" />
              <span className="sr-only">Open {drop.name}</span>
            </button>
          )}
          <RemoveButton
            name={drop.name}
            disabled={disabled}
            confirm={confirmRemove}
            onRemove={() => onRemove(drop.id)}
          />
        </li>
      ))}
    </ul>
  ) : null;

export const DropCombobox = ({
  campaignId,
  linkedIds,
  disabled = false,
  isSaving = false,
  onSelect,
}: {
  campaignId?: number | string;
  linkedIds: number[];
  disabled?: boolean;
  isSaving?: boolean;
  onSelect: (drop: EventDrop) => void;
}) => {
  const search = useDropSearch({
    campaignId,
    excludeIds: linkedIds,
    onSelect,
  });

  return (
    <Popover modal open={search.isOpen} onOpenChange={search.setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={search.isOpen}
          disabled={disabled || isSaving || !search.hasCampaign}
          className={cn(
            triggerClassName,
            "justify-between disabled:opacity-60",
          )}
        >
          <span className="flex flex-1 items-center gap-2 truncate text-zinc-400">
            {isSaving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Search className={iconClassName} />
            )}
            {isSaving
              ? "Saving…"
              : search.hasCampaign
                ? "Search attachments"
                : "Select a campaign first"}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width) gap-0 p-0"
      >
        <div className="flex items-center gap-2 border-b border-zinc-200 px-3 dark:border-zinc-700">
          <Search className={iconClassName} />
          <input
            autoFocus
            value={search.query}
            onChange={(e) => search.setQuery(e.target.value)}
            placeholder="Search by name"
            className="h-10 flex-1 bg-transparent text-[14px] outline-none placeholder:text-zinc-400"
          />
          {search.isLoading && (
            <Loader2 className="size-4 animate-spin text-zinc-400" />
          )}
        </div>
        <ul role="listbox" className="max-h-60 overflow-y-auto p-1">
          {search.error ? (
            <li className="px-3 py-2 text-[14px] text-red-500">
              {search.error}
            </li>
          ) : search.results.length === 0 ? (
            <li className="px-3 py-2 text-[14px] text-zinc-500">
              {search.isLoading
                ? "Loading…"
                : "No attachments found for this campaign."}
            </li>
          ) : (
            search.results.map((drop) => (
              <li key={drop.id} role="option" aria-selected={false}>
                <button
                  type="button"
                  onClick={() => search.select(drop)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[14px] hover:bg-zinc-100 dark:hover:bg-zinc-700"
                >
                  <span className="flex-1 truncate">{drop.name}</span>
                  {drop.type && (
                    <span className="max-w-[40%] truncate text-[12px] text-zinc-500">
                      {drop.type}
                    </span>
                  )}
                </button>
              </li>
            ))
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
};
