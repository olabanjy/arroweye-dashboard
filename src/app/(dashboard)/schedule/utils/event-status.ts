import type { EventStatus } from "@/types/api";

export type EventStatusOption = {
  value: EventStatus;
  label: string;
  dotClassName: string;
  pillClassName: string;
  tileClassName: string;
};

export const EVENT_STATUS_OPTIONS: EventStatusOption[] = [
  {
    value: "confirmed",
    label: "Confirmed",
    dotClassName: "bg-green-500",
    pillClassName:
      "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300",
    tileClassName: "bg-green-50 dark:bg-green-950/40",
  },
  {
    value: "tentative",
    label: "Tentative",
    dotClassName: "bg-amber-400",
    pillClassName:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    tileClassName: "bg-amber-50 dark:bg-amber-950/40",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    dotClassName: "bg-red-500",
    pillClassName:
      "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300",
    tileClassName: "bg-red-50 dark:bg-red-950/40",
  },
];

export const getEventStatusOption = (status?: string | null) =>
  EVENT_STATUS_OPTIONS.find((option) => option.value === status);
