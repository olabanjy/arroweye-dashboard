import React from "react";
import SecurityNotificationCard from "../SecurityNotificationCard";

const SecurityNotification: React.FC<any> = ({ notification }) => {
  const handleDownload = () => {
    console.log("Download triggered");
  };

  const handleShare = () => {
    console.log("Share triggered");
  };
  return (
    <div>
      <div className=" space-y-[20px]">
        {!!notification && notification.length > 0 ? (
          notification?.map((item: any, index: number) => {
            return (
              <SecurityNotificationCard
                key={index}
                timeAgo="2 DAYS AGO"
                message={item.content}
                onDownload={handleDownload}
                onShare={handleShare}
              />
            );
          })
        ) : (
          <div className="flex flex-col gap-10">
            <p className="lg:text-lg">
              You do not have security notifications currently
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityNotification;
