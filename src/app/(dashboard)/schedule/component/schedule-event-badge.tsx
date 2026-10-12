"use client";

import React, { useMemo } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface EventColorTheme {
  name: string;
  badge: string;
  dot: string;
  title: string;
  time: string;
  hover: string;
}

export const EVENT_THEMES: Record<string, EventColorTheme> = {
  pink: {
    name: "pink",
    badge:
      "bg-[#fdecf4] dark:bg-pink-950/40 border border-pink-200/40 dark:border-pink-900/30",
    dot: "bg-[#f32a7c]",
    title: "text-[#9d174d] dark:text-pink-200",
    time: "text-[#be185d] dark:text-pink-300",
    hover: "hover:bg-[#fbdde9] dark:hover:bg-pink-950/60",
  },
  blue: {
    name: "blue",
    badge:
      "bg-[#e2edff] dark:bg-blue-950/40 border border-blue-200/40 dark:border-blue-900/30",
    dot: "bg-[#1f81e8]",
    title: "text-[#1e40af] dark:text-blue-200",
    time: "text-[#3b82f6] dark:text-blue-300",
    hover: "hover:bg-[#d4e4fd] dark:hover:bg-blue-950/60",
  },
  green: {
    name: "green",
    badge:
      "bg-[#ddf8ee] dark:bg-emerald-950/40 border border-emerald-200/40 dark:border-emerald-900/30",
    dot: "bg-[#12a374]",
    title: "text-[#065f46] dark:text-emerald-200",
    time: "text-[#059669] dark:text-emerald-300",
    hover: "hover:bg-[#cef3e5] dark:hover:bg-emerald-950/60",
  },
  purple: {
    name: "purple",
    badge:
      "bg-[#f3e8ff] dark:bg-purple-950/40 border border-purple-200/40 dark:border-purple-900/30",
    dot: "bg-[#8b5cf6]",
    title: "text-[#6b21a8] dark:text-purple-200",
    time: "text-[#9333ea] dark:text-purple-300",
    hover: "hover:bg-[#ead5ff] dark:hover:bg-purple-950/60",
  },
  amber: {
    name: "amber",
    badge:
      "bg-[#fef3c7] dark:bg-amber-950/40 border border-amber-200/40 dark:border-amber-900/30",
    dot: "bg-[#f59e0b]",
    title: "text-[#92400e] dark:text-amber-200",
    time: "text-[#d97706] dark:text-amber-300",
    hover: "hover:bg-[#fde68a] dark:hover:bg-amber-950/60",
  },
};

export function resolveEventTheme(
  title: string = "",
  id: string | number = "",
): EventColorTheme {
  const normalized = (title || "").toLowerCase();

  if (
    normalized.includes("artist") ||
    normalized.includes("call") ||
    normalized.includes("strategy") ||
    normalized.includes("interview") ||
    normalized.includes("pink")
  ) {
    return EVENT_THEMES.pink;
  }

  if (
    normalized.includes("songwriting") ||
    normalized.includes("session") ||
    normalized.includes("writing") ||
    normalized.includes("shoot") ||
    normalized.includes("video") ||
    normalized.includes("blue")
  ) {
    return EVENT_THEMES.blue;
  }

  if (
    normalized.includes("studio") ||
    normalized.includes("vocal") ||
    normalized.includes("vocals") ||
    normalized.includes("track") ||
    normalized.includes("audio") ||
    normalized.includes("record") ||
    normalized.includes("green")
  ) {
    return EVENT_THEMES.green;
  }

  if (
    normalized.includes("rehearsal") ||
    normalized.includes("performance") ||
    normalized.includes("live") ||
    normalized.includes("meeting") ||
    normalized.includes("review") ||
    normalized.includes("purple")
  ) {
    return EVENT_THEMES.purple;
  }

  if (
    normalized.includes("release") ||
    normalized.includes("deadline") ||
    normalized.includes("launch") ||
    normalized.includes("amber") ||
    normalized.includes("yellow")
  ) {
    return EVENT_THEMES.amber;
  }

  const key = `${id || ""}-${title || ""}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const themeList = [
    EVENT_THEMES.pink,
    EVENT_THEMES.blue,
    EVENT_THEMES.green,
    EVENT_THEMES.purple,
    EVENT_THEMES.amber,
  ];
  const idx = Math.abs(hash) % themeList.length;
  return themeList[idx];
}

export interface ScheduleEventBadgeProps {
  title: string;
  start?: Date | null;
  eventId?: string | number;
  isAllDay?: boolean;
  viewType?: string;
}

export const ScheduleEventBadge: React.FC<ScheduleEventBadgeProps> = ({
  title,
  start,
  eventId,
  isAllDay = false,
  viewType = "dayGridMonth",
}) => {
  const theme = useMemo(
    () => resolveEventTheme(title, eventId),
    [title, eventId],
  );

  // FullCalendar's own timeText is abbreviated ("9a"), so format the start time here.
  const formattedTime = useMemo(() => {
    if (isAllDay || !start) return "";
    return format(start, start.getMinutes() ? "h:mma" : "ha");
  }, [start, isAllDay]);

  const isTimeGridView = viewType.startsWith("timeGrid");

  return (
    <div
      className={cn(
        "group flex w-full select-none items-center justify-between overflow-hidden rounded-lg px-2.5 py-1 text-xs transition-colors",
        theme.badge,
        theme.hover,
        isTimeGridView && "h-full py-1.5",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-1.5">
        <span
          className={cn("size-2 shrink-0 rounded-full", theme.dot)}
          aria-hidden="true"
        />
        <span
          className={cn(
            "truncate text-[11px] font-semibold leading-tight tracking-tight sm:text-xs",
            theme.title,
          )}
        >
          {title}
        </span>
      </div>

      {formattedTime && (
        <span
          className={cn(
            "ml-1.5 shrink-0 text-[10px] font-medium tabular-nums leading-tight tracking-tight sm:text-[11px]",
            theme.time,
          )}
        >
          {formattedTime}
        </span>
      )}
    </div>
  );
};

export default ScheduleEventBadge;
