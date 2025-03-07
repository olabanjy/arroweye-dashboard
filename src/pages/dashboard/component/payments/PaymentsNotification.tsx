import React from "react";
import PaymentMomentNotificationCard from "./PaymentMomentNotificationCard";
import { formatDistanceToNow } from "date-fns";

const PaymentsNotification: React.FC<any> = ({ notification }) => {
  const handleDownload = () => {
    console.log("Download triggered");
  };

  const handleShare = () => {
    console.log("Share triggered");
  };

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div>
      <div className=" space-y-[20px]">
        {!!notification && notification.length > 0 ? (
          notification?.map((item: any, index: number) => {
            return (
              <PaymentMomentNotificationCard
                key={index}
                timeAgo={formatRelativeDate(item.created)}
                message={item.content}
                onDownload={handleDownload}
                onShare={handleShare}
                actions={item.actions}
                iconClass={item.icon}
              />
            );
          })
        ) : (
          <div className="flex flex-col gap-10">
            <p className="lg:text-lg">
              You do not have payment notifications currently
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsNotification;
