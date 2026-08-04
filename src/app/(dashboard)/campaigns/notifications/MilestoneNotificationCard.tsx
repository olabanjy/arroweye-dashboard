import { NotificationCard, type NotificationAction } from "./NotificationCard";
import { notificationIconConfig } from "./notification-icon-config";

interface MilestoneNotificationCardProps {
  timeAgo: string;
  message: string;
  highlight?: string;
  onDownload: () => void;
  onShare: () => void;
  actions: NotificationAction[];
  iconClass?: string;
  read?: boolean;
}

export default function MilestoneNotificationCard({
  timeAgo,
  message,
  highlight,
  actions,
  iconClass,
  read,
}: MilestoneNotificationCardProps) {
  const { Icon, containerClassName } = notificationIconConfig.milestones;

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
