import React from "react";
import MusicAdsNotificationCard from "../MusicAdsNotificationCard";
import MilestoneNotificationCard from "../MilestoneNotificationCard";

const MileStonesNotification = () => {
  const handleDownload = () => {
    console.log("Download triggered");
  };

  const handleShare = () => {
    console.log("Share triggered");
  };
  return (
    <div>
      <div className=" space-y-[20px]">
        <MilestoneNotificationCard
          timeAgo="2 DAYS AGO"
          message=" New milestone! Run This Town just hit 1,000,000 impressions on radio "
          onDownload={handleDownload}
          onShare={handleShare}
        />

        <MusicAdsNotificationCard
          timeAgo="ADS BY VIVO"
          message=" Out now! Listen to HEIS by Afrobeats superstar Rema "
          onDownload={handleDownload}
          onShare={handleShare}
        />
        <MilestoneNotificationCard
          timeAgo="2 DAYS AGO"
          message=" New milestone! Run This Town just hit 1,000,000 impressions on radio "
          onDownload={handleDownload}
          onShare={handleShare}
        />

        <MusicAdsNotificationCard
          timeAgo="ADS BY VIVO"
          message=" Out now! Listen to HEIS by Afrobeats superstar Rema "
          onDownload={handleDownload}
          onShare={handleShare}
        />
        <MilestoneNotificationCard
          timeAgo="2 DAYS AGO"
          message=" New milestone! Run This Town just hit 1,000,000 impressions on radio "
          onDownload={handleDownload}
          onShare={handleShare}
        />

        <MusicAdsNotificationCard
          timeAgo="ADS BY VIVO"
          message=" Out now! Listen to HEIS by Afrobeats superstar Rema "
          onDownload={handleDownload}
          onShare={handleShare}
        />
        <MilestoneNotificationCard
          timeAgo="2 DAYS AGO"
          message=" New milestone! Run This Town just hit 1,000,000 impressions on radio "
          onDownload={handleDownload}
          onShare={handleShare}
        />

        <MusicAdsNotificationCard
          timeAgo="ADS BY VIVO"
          message=" Out now! Listen to HEIS by Afrobeats superstar Rema "
          onDownload={handleDownload}
          onShare={handleShare}
        />
        <MilestoneNotificationCard
          timeAgo="2 DAYS AGO"
          message=" New milestone! Run This Town just hit 1,000,000 impressions on radio "
          onDownload={handleDownload}
          onShare={handleShare}
        />

        <MusicAdsNotificationCard
          timeAgo="ADS BY VIVO"
          message=" Out now! Listen to HEIS by Afrobeats superstar Rema "
          onDownload={handleDownload}
          onShare={handleShare}
        />
      </div>
    </div>
  );
};

export default MileStonesNotification;
