"use client";

import { useEffect, useMemo, useState } from "react";

export type CampaignOption = {
  value: string;
  label: string;
  id?: number;
  pin?: string;
  code?: string;
};

interface UseCampaignComboboxOptions {
  options: CampaignOption[];
  value?: string;
  onSelect: (value: string) => void;
}

const matchesQuery = (option: CampaignOption, query: string) =>
  [option.label, option.pin, option.code].some((field) =>
    field?.toLowerCase().includes(query),
  );

export const useCampaignCombobox = ({
  options,
  value,
  onSelect,
}: UseCampaignComboboxOptions) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isOpen) setQuery("");
  }, [isOpen]);

  const selected = options.find(
    (option) =>
      option.value === value || option.pin === value || option.code === value,
  );

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter((option) => matchesQuery(option, normalized));
  }, [options, query]);

  const select = (option: CampaignOption) => {
    onSelect(option.value);
    setIsOpen(false);
  };

  return {
    isOpen,
    setIsOpen,
    query,
    setQuery,
    selected,
    filteredOptions,
    select,
  };
};
