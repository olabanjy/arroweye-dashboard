"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { DialogTitle } from "@/components/ui/dialog";
import { resolveEventTheme } from "./schedule-event-badge";

interface EventHeaderProps {
  title: string;
  description?: string | null;
  calendarEventId?: string;
  isDialogTitle?: boolean;
  actions?: React.ReactNode;
}

const EventHeader = ({
  title,
  description,
  calendarEventId,
  isDialogTitle = false,
  actions,
}: EventHeaderProps) => {
  const theme = resolveEventTheme(title, calendarEventId);
  const titleClassName =
    "break-words text-[20px] font-semibold leading-tight text-zinc-950 dark:text-zinc-50";

  return (
    <div className="relative isolate flex items-start gap-3 rounded-2xl p-4">
      {/* Tint on its own layer so the badge colour can fade without fading the content */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10 rounded-2xl opacity-50",
          theme.badge,
        )}
      />
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <span
          className={cn(
            "mt-2 size-2.5 shrink-0 rounded-full ring-4 ring-white/70 dark:ring-zinc-900/50",
            theme.dot,
          )}
        />
        <div className="min-w-0">
          {isDialogTitle ? (
            <DialogTitle className={titleClassName}>{title}</DialogTitle>
          ) : (
            <p className={titleClassName}>{title}</p>
          )}
          {description && (
            <p className="mt-1 line-clamp-2 text-[14px] text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex shrink-0 gap-1.5">{actions}</div>}
    </div>
  );
};

export default EventHeader;
