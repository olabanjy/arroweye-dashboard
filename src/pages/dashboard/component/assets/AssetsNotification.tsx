import React from "react";
import AssetsNotificationCard from "../AssetsNotificationCard";
import { formatDistanceToNow } from "date-fns";

const AssetsNotification: React.FC<any> = ({ notification }) => {
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
              <AssetsNotificationCard
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
          <div className="flex flex-col gap-5">
            <p className="lg:text-lg">
              You do not have assets notifications currently
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetsNotification;
