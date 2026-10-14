"use client";

import React from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useCampaignCombobox,
  type CampaignOption,
} from "../hooks/use-campaign-combobox";
import { iconClassName, triggerClassName } from "./event-fields";

interface CampaignComboboxProps {
  options: CampaignOption[];
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

const CampaignCombobox = ({
  options,
  value,
  onChange,
  error,
}: CampaignComboboxProps) => {
  const combobox = useCampaignCombobox({ options, value, onSelect: onChange });

  return (
    <div className="space-y-2 font-SansFlex">
      <Popover modal open={combobox.isOpen} onOpenChange={combobox.setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={combobox.isOpen}
            className={cn(
              triggerClassName,
              "justify-between",
              error && "border-red-500",
            )}
          >
            <span
              className={cn(
                "flex-1 truncate",
                !combobox.selected && "text-zinc-400",
              )}
            >
              {combobox.selected?.label ?? "Select campaign"}
            </span>
            <ChevronDown className="size-4 opacity-50" />
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
              value={combobox.query}
              onChange={(e) => combobox.setQuery(e.target.value)}
              placeholder="Search by name or code"
              className="h-10 flex-1 bg-transparent text-[14px] outline-none placeholder:text-zinc-400"
            />
          </div>
          <ul role="listbox" className="max-h-60 overflow-y-auto p-1">
            {combobox.filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-[14px] text-zinc-500">
                No campaigns found.
              </li>
            ) : (
              combobox.filteredOptions.map((option) => {
                const isSelected = option.value === combobox.selected?.value;
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <button
                      type="button"
                      onClick={() => combobox.select(option)}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[14px] hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    >
                      <span className="flex-1 truncate">{option.label}</span>
                      <span className="text-[12px] text-zinc-500">
                        {option.value}
                      </span>
                      <Check
                        className={cn(
                          "size-4",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default CampaignCombobox;
