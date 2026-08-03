import type { ReactNode } from "react";
import {
  mdiCash,
  mdiFolderOpenOutline,
  mdiPlayCircleOutline,
  mdiShieldCheckOutline,
} from "@mdi/js";
import MdiIcon from "@mdi/react";
import { Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface NotificationAction {
  type: string;
  url: string;
}

interface NotificationCardProps {
  timeAgo: string;
  message: string;
  highlight?: string;
  actions?: NotificationAction[];
  iconClass?: string;
  icon: ReactNode;
  iconContainerClassName: string;
  read?: boolean;
  disabledActions?: string[];
  getActionUrl?: (action: NotificationAction) => string;
  onAction?: (action: NotificationAction, url: string) => void;
}

const notificationIcons: Record<string, string> = {
  "mdi-album": mdiPlayCircleOutline,
  "mdi-cash": mdiCash,
  "mdi-folder-open-outline": mdiFolderOpenOutline,
  "mdi-shield-check-outline": mdiShieldCheckOutline,
};

const getMdiIcon = (value?: string) => {
  if (!value) return undefined;

  const parts = value.trim().split(/\s+/);
  const name = parts.find((part) => part.startsWith("mdi-"));

  if (!name || !notificationIcons[name]) return undefined;

  return {
    path: notificationIcons[name],
    color: parts.find((part) => /^#[0-9a-f]{3,8}$/i.test(part)),
  };
};

const isUrl = (str?: string) => {
  if (!str) return false;
  return (
    str.startsWith("http") ||
    str.startsWith("/") ||
    str.includes(".") ||
    str.includes("/")
  );
};

const parseMessage = (text: string) => {
  if (!text) return "";
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <span
          key={index}
          className="font-bold text-neutral-950 dark:text-white"
        >
          {part.slice(2, -2)}
        </span>
      );
    }
    return part;
  });
};

const parseTimeAgo = (text: string) => {
  if (!text) return "";
  const parts = text.split(/(_[^_]+_)/g);
  return parts.map((part, index) => {
    if (part.startsWith("_") && part.endsWith("_")) {
      return (
        <span key={index} className="underline font-bold">
          {part.slice(1, -1)}
        </span>
      );
    }
    return part;
  });
};

export function NotificationCard({
  timeAgo,
  message,
  highlight,
  actions = [],
  iconClass,
  icon,
  iconContainerClassName,
  read,
  disabledActions = ["Pay", "Delete"],
  getActionUrl = (action) => action.url,
  onAction,
}: NotificationCardProps) {
  const copyLink = async (url: string) => {
    await navigator.clipboard.writeText(url);
    toast.success("Link has been copied!");
  };

  const isIconUrl = isUrl(iconClass);
  const mdiIcon = getMdiIcon(iconClass);

  return (
    <div
      className={cn(
        "flex items-start gap-3 border-b border-neutral-100 bg-white px-5 py-3.5 last:border-b-0 dark:border-zinc-800 dark:bg-zinc-950",
        !read && "bg-neutral-50/30 dark:bg-zinc-900/5",
      )}
    >
      {isIconUrl ? (
        <img
          src={iconClass}
          alt="Notification artwork"
          className="w-14 h-[72px] shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div
          className={cn(
            "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl",
            iconContainerClassName,
          )}
          style={mdiIcon?.color ? { color: mdiIcon.color } : undefined}
        >
          {mdiIcon ? <MdiIcon path={mdiIcon.path} size={0.8} /> : icon}
        </div>
      )}

      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500">
          {parseTimeAgo(timeAgo)}
        </p>
        <p className="text-[13px] leading-[18px] text-neutral-800 dark:text-zinc-200">
          {parseMessage(message)}{" "}
          {highlight && (
            <span className="font-bold text-neutral-950 dark:text-white">
              {highlight}
            </span>
          )}
        </p>

        {actions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {actions.map((action, index) => {
              const url = getActionUrl(action);
              const isShare = action.type === "Share";
              const isDownload = action.type === "Download";
              const disabled = disabledActions.includes(action.type);
              const isSecondary = isShare;

              return (
                <Button
                  key={`${action.type}-${index}`}
                  type="button"
                  disabled={disabled}
                  aria-label={isDownload ? "Download" : undefined}
                  onClick={() => {
                    if (isShare) {
                      void copyLink(url);
                      return;
                    }
                    if (onAction) onAction(action, url);
                    else window.open(url, "_blank", "noopener,noreferrer");
                  }}
                  className={cn(
                    "h-8 rounded-[6px] text-xs font-semibold px-4 transition-colors cursor-pointer",
                    isSecondary
                      ? "border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-850"
                      : "bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 border-0 shadow-none",
                    isDownload && "w-8 px-0",
                  )}
                >
                  {isDownload ? <Download className="size-3.5" /> : action.type}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
