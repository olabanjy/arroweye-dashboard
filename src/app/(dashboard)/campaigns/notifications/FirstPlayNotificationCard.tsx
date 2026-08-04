import { NotificationCard, type NotificationAction } from "./NotificationCard";
import { getCampaignIconConfig } from "./notification-icon-config";

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
  const campaignIcon = getCampaignIconConfig(message);
  const { Icon, containerClassName, ignoreApiIcon } = campaignIcon;

  return (
    <NotificationCard
      timeAgo={timeAgo}
      message={message}
      highlight={highlight}
      actions={actions}
      iconClass={ignoreApiIcon ? undefined : iconClass}
      icon={<Icon className="size-5" />}
      iconContainerClassName={containerClassName}
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
