import { mdiBellOffOutline } from "@mdi/js";
import MdiIcon from "@mdi/react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface NotificationEmptyStateProps {
  category: string;
}

export function NotificationEmptyState({
  category,
}: NotificationEmptyStateProps) {
  return (
    <Alert className="px-3 py-2 text-xs [&>svg]:left-3 [&>svg]:top-2.5 [&>svg~*]:pl-5">
      <MdiIcon path={mdiBellOffOutline} size={0.6} />
      <AlertTitle className="mb-0 text-xs">No notifications</AlertTitle>
      <AlertDescription className="text-[11px] leading-4">
        You do not have {category} notifications currently.
      </AlertDescription>
    </Alert>
  );
}
