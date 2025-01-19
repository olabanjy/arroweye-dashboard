import React from "react";
import MomentNotificationCard from "../MomentNotificationCard";
import ReminderNotificationCard from "../ReminderNotificationCard";
import AdsNotificationCard from "../AdsNotificationCard";

const AssetsNotification = () => {
  const handleDownload = () => {
    console.log("Download triggered");
  };

  const handleShare = () => {
    console.log("Share triggered");
  };
  return (
    <div className=" space-y-[20px]">
      <MomentNotificationCard
        timeAgo="2 DAYS AGO"
        message=" Relive the moments! Highlights for Run This Town by Alor G have been uploaded "
        onDownload={handleDownload}
        onShare={handleShare}
      />

      <ReminderNotificationCard
        timeAgo="REMINDER"
        message=" Get ready! Your event Glitch Session Reharsals is coming up in 2 days "
        onDownload={handleDownload}
        onShare={handleShare}
      />

      <AdsNotificationCard
        timeAgo="ADS BY VIVO"
        message=" An ad about this item by this brand for $100 "
        onDownload={handleDownload}
        onShare={handleShare}
      />
    </div>
  );
};

export default AssetsNotification;
