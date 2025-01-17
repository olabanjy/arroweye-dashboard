import React from "react";
import AccessedSecurityNotificationCard from "../AccessedSecurityNotificationCard";
import ArchivedSecurityNotificationCard from "../ArchivedSecurityNotificationCard";
import ViewSecurityNotificationCard from "../ViewSecurityNotificationCard";
import MusicAdsNotificationCard from "../MusicAdsNotificationCard";
import SecurityNotificationCard from "../SecurityNotificationCard";

const SecurityNotification = () => {
  const handleDownload = () => {
    console.log("Download triggered");
  };

  const handleShare = () => {
    console.log("Share triggered");
  };
  return (
    <div>
      <div className=" space-y-[20px]">
        <SecurityNotificationCard
          timeAgo="2 DAYS AGO"
          message=" Your team member Kolapo Oladapo just clocked in "
          onDownload={handleDownload}
          onShare={handleShare}
        />

        <ViewSecurityNotificationCard
          timeAgo="2 DAYS AGO"
          message=" Your team member Kolapo Oladapo just clocked in "
          onDownload={handleDownload}
          onShare={handleShare}
        />
        <ArchivedSecurityNotificationCard
          timeAgo="2 DAYS AGO"
          message="  Your team member Kolapo Oladapo archived Jolie "
          onDownload={handleDownload}
          onShare={handleShare}
        />
        <AccessedSecurityNotificationCard
          timeAgo="2 DAYS AGO"
          message=" Your account has just been accessed by someone "
          onDownload={handleDownload}
          onShare={handleShare}
        />

        <MusicAdsNotificationCard
          timeAgo="ADS BY VIVO"
          message=" Out now! Listen to HEIS by Afrobeats superstar Rema "
          onDownload={handleDownload}
          onShare={handleShare}
        />
        <ViewSecurityNotificationCard
          timeAgo="2 DAYS AGO"
          message=" Your team member Kolapo Oladapo just clocked in "
          onDownload={handleDownload}
          onShare={handleShare}
        />
        <ArchivedSecurityNotificationCard
          timeAgo="2 DAYS AGO"
          message="  Your team member Kolapo Oladapo archived Jolie "
          onDownload={handleDownload}
          onShare={handleShare}
        />
        <AccessedSecurityNotificationCard
          timeAgo="2 DAYS AGO"
          message=" Your account has just been accessed by someone "
          onDownload={handleDownload}
          onShare={handleShare}
        />
      </div>
    </div>
  );
};

export default SecurityNotification;
