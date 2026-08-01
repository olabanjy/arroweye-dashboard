import { FolderOpen } from "lucide-react";

import { NotificationCard, type NotificationAction } from "./NotificationCard";

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
  return (
    <NotificationCard
      timeAgo={timeAgo}
      message={message}
      highlight={highlight}
      actions={actions}
      iconClass={iconClass}
      icon={<FolderOpen className="size-5" />}
      iconContainerClassName="bg-lime-200 text-green-700"
      read={read}
      disabledActions={["Manage", "Pay", "Delete"]}
    />
  );
}
