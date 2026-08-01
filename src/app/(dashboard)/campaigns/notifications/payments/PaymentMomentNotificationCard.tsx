import { FileText } from "lucide-react";

import { NotificationCard, type NotificationAction } from "../NotificationCard";

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
  return (
    <NotificationCard
      timeAgo={timeAgo}
      message={message}
      highlight={highlight}
      actions={actions}
      iconClass={iconClass}
      icon={<FileText className="size-5" />}
      iconContainerClassName="bg-violet-100 text-violet-600 dark:bg-violet-950"
      read={read}
      disabledActions={["Manage", "Pay", "Delete"]}
    />
  );
}
