import { UserRound } from "lucide-react";

import { NotificationCard, type NotificationAction } from "./NotificationCard";

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
  return (
    <NotificationCard
      timeAgo={timeAgo}
      message={message}
      highlight={highlight}
      actions={actions}
      iconClass={iconClass}
      icon={<UserRound className="size-5" />}
      iconContainerClassName="bg-muted text-foreground"
      read={read}
    />
  );
}
