import { NotificationCard, type NotificationAction } from "./NotificationCard";
import { notificationIconConfig } from "./notification-icon-config";

interface SecurityNotificationCardProps {
  timeAgo: string;
  message: string;
  highlight?: string;
  onDownload: () => void;
  onShare: () => void;
  actions: NotificationAction[];
  iconClass?: string;
  read?: boolean;
}

export default function SecurityNotificationCard({
  timeAgo,
  message,
  highlight,
  actions,
  iconClass,
  read,
}: SecurityNotificationCardProps) {
  const { Icon, containerClassName } = notificationIconConfig.security;

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
    />
  );
}
