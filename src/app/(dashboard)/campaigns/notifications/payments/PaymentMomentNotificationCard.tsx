import { NotificationCard, type NotificationAction } from "../NotificationCard";
import { notificationIconConfig } from "../notification-icon-config";

interface PaymentMomentNotificationCardProps {
  timeAgo: string;
  message: string;
  highlight?: string;
  onDownload: () => void;
  onShare: () => void;
  actions: NotificationAction[];
  iconClass?: string;
  read?: boolean;
}

export default function PaymentMomentNotificationCard({
  timeAgo,
  message,
  highlight,
  actions,
  iconClass,
  read,
}: PaymentMomentNotificationCardProps) {
  const { Icon, containerClassName } = notificationIconConfig.payments;

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
