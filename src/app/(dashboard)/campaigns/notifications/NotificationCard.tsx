"use client";

import type { ReactNode } from "react";
import { Download, ExternalLink, Share2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

  return (
    <Card
      className={cn(
        "gap-0 rounded-lg py-0 shadow-none",
        !read &&
          "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30",
      )}
    >
      <CardContent className="flex items-start gap-3 p-4">
        <div
          className={cn(
            "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md",
            iconContainerClassName,
          )}
          style={
            iconClass
              ? { backgroundColor: iconClass.split(" ")[2], color: "white" }
              : undefined
          }
        >
          {iconClass ? <i className={cn(iconClass, "text-xl")} /> : icon}
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="text-xs font-medium uppercase text-muted-foreground">
            {timeAgo}
          </p>
          <p className="text-sm leading-6 text-foreground">
            {message}{" "}
            {highlight && <span className="font-semibold">{highlight}</span>}
          </p>

          {actions.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1.5">
              {actions.map((action, index) => {
                const url = getActionUrl(action);
                const isShare = action.type === "Share";
                const isDownload = action.type === "Download";
                const disabled = disabledActions.includes(action.type);

                return (
                  <Button
                    key={`${action.type}-${index}`}
                    type="button"
                    size={isDownload ? "icon" : "default"}
                    variant={isShare ? "outline" : "default"}
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
                  >
                    {isDownload ? (
                      <Download />
                    ) : (
                      <>
                        {isShare ? <Share2 /> : <ExternalLink />}
                        {action.type}
                      </>
                    )}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
