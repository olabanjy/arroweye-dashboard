import React from "react";
import AssetsNotificationCard from "../AssetsNotificationCard";

const AssetsNotification: React.FC<any> = ({ notification }) => {
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
              <AssetsNotificationCard
                key={index}
                timeAgo="2 DAYS AGO"
                message={item.content}
                onDownload={handleDownload}
                onShare={handleShare}
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
