import { Star } from "lucide-react";

import { NotificationCard, type NotificationAction } from "./NotificationCard";

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
  return (
    <NotificationCard
      timeAgo={timeAgo}
      message={message}
      highlight={highlight}
      actions={actions}
      iconClass={iconClass}
      icon={<Star className="size-5" />}
      iconContainerClassName="bg-orange-100 text-orange-600"
      read={read}
      disabledActions={["Manage", "Pay", "Delete"]}
    />
  );
}
