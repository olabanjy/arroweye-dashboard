import React, { useEffect, useState } from "react";
import MomentNotificationCard from "../MomentNotificationCard";
import FirstPlayNotificationCard from "../FirstPlayNotificationCard";
import AirPlayNotificationCard from "../AirPlayNotificationCard";
import ReminderNotificationCard from "../ReminderNotificationCard";
import SocialNotificationCard from "../SocialNotificationCard";
import DspNotificationCard from "../DspNotificationCard";
import NewsNotificationCard from "../NewsNotificationCard";
import WebNotificationCard from "../WebNotificationCard";
import AdsNotificationCard from "../AdsNotificationCard";
import { ContentItem } from "@/types/contents";
import { getNotification } from "@/services/api";

const CampaignNotifications = () => {
  const [content, setContent] = useState<ContentItem[] | null>(null);

  useEffect(() => {
    getNotification().then((fetchedContent) => {
      setContent(fetchedContent);
    });
  }, []);

  console.log(content);

  const handleDownload = () => {
    console.log("Download triggered");
  };

  const handleShare = () => {
    console.log("Share triggered");
  };

  return (
    <div>
      <div className=" space-y-[20px]">
        <MomentNotificationCard
          timeAgo="2 DAYS AGO"
          message=" Relive the moments! Highlights for Run This Town by Alor G have been uploaded "
          onDownload={handleDownload}
          onShare={handleShare}
        />
        <FirstPlayNotificationCard
          timeAgo="2 DAYS AGO"
          message=" Congrats! First play assets for Run This Town by Alor G have been uploaded "
          onDownload={handleDownload}
          onShare={handleShare}
        />

        <AirPlayNotificationCard
          timeAgo="2 DAYS AGO"
          message=" Great job! Airplay data for For Di Road by Alor G has been updated "
          onDownload={handleDownload}
          onShare={handleShare}
        />
        <ReminderNotificationCard
          timeAgo="REMINDER"
          message=" Get ready! Your event Glitch Session Reharsals is coming up in 2 days "
          onDownload={handleDownload}
          onShare={handleShare}
        />
        <SocialNotificationCard
          timeAgo="2 DAYS AGO"
          message=" Good job! Social media data for Diana Knows by Jericho Blackman has been updated "
          onDownload={handleDownload}
          onShare={handleShare}
        />

        <DspNotificationCard
          timeAgo="2 DAYS AGO"
          message=" DSP data for No Road to Remember by Two Makanakis has been updated "
          onDownload={handleDownload}
          onShare={handleShare}
        />
        <NewsNotificationCard
          timeAgo="2 DAYS AGO"
          message=" Great news! Run This Town was just played by DJ Shemztex "
          onDownload={handleDownload}
          onShare={handleShare}
        />
        <WebNotificationCard
          timeAgo="2 DAYS AGO"
          message=" A feature post for Brotherhood (single) was just published on Culture Custodian "
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
    </div>
  );
};

export default CampaignNotifications;
