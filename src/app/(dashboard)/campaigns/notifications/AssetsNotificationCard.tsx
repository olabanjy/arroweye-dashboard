import { NotificationCard, type NotificationAction } from "./NotificationCard";
import { notificationIconConfig } from "./notification-icon-config";

interface AssetsNotificationCardProps {
  timeAgo: string;
  message: string;
  highlight?: string;
  onDownload: () => void;
  onShare: () => void;
  actions: NotificationAction[];
  iconClass?: string;
  read?: boolean;
}

export default function AssetsNotificationCard({
  timeAgo,
  message,
  highlight,
  actions,
  iconClass,
  read,
}: AssetsNotificationCardProps) {
  const { Icon, containerClassName } = notificationIconConfig.assets;

  return (
    <NotificationCard
      timeAgo={timeAgo}
      message={message}
      highlight={highlight}
      actions={actions}
      iconClass={iconClass}
      icon={<Icon className="size-5" />}
      iconContainerClassName={containerClassName}
      read={read}
      disabledActions={["Manage", "Pay", "Delete"]}
    />
  );
}
