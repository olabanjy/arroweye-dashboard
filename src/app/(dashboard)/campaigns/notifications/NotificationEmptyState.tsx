import { BellOff } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface NotificationEmptyStateProps {
  category: string;
}

export function NotificationEmptyState({
  category,
}: NotificationEmptyStateProps) {
  return (
    <Alert>
      <BellOff />
      <AlertTitle>No notifications</AlertTitle>
      <AlertDescription>
        You do not have {category} notifications currently.
      </AlertDescription>
    </Alert>
  );
}
