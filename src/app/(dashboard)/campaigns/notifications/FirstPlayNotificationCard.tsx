import { ChartNoAxesCombined, PlayCircle } from "lucide-react";

import { NotificationCard, type NotificationAction } from "./NotificationCard";

interface FirstPlayNotificationCardProps {
  timeAgo: string;
  message: string;
  highlight?: string;
  onDownload: () => void;
  onShare: () => void;
  actions: NotificationAction[];
  iconClass?: string;
  read?: boolean;
}

const getSpinUrl = (url: string) =>
  url.replace(/\/spins\/spin\/([^/?#]+)/, "/spins/$1");

export default function FirstPlayNotificationCard({
  timeAgo,
  message,
  highlight,
  actions,
  iconClass,
  read,
}: FirstPlayNotificationCardProps) {
  const isSpinNotification = iconClass === "mdi mdi-album #088cff";
  const isSocialMediaUpdate = /social media data/i.test(message);

  return (
    <NotificationCard
      timeAgo={timeAgo}
      message={message}
      highlight={highlight}
      actions={actions}
      iconClass={iconClass}
      icon={
        isSocialMediaUpdate ? (
          <ChartNoAxesCombined className="size-5" />
        ) : (
          <PlayCircle className="size-5" />
        )
      }
      iconContainerClassName="bg-amber-100 text-amber-700"
      read={read}
      getActionUrl={(action) =>
        isSpinNotification && ["Share", "View"].includes(action.type)
          ? getSpinUrl(action.url)
          : action.url
      }
      onAction={(action, url) => {
        if (action.type === "View" && isSpinNotification) {
          localStorage.setItem(
            "spinNotification",
            JSON.stringify({ content: message, timeAgo }),
          );
          window.dispatchEvent(new Event("spinNotificationUpdate"));
        }

        window.open(url, "_blank", "noopener,noreferrer");
      }}
    />
  );
}
