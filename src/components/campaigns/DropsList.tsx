"use client";
import React, { useEffect, useState } from "react";
import { ContentItem } from "@/types/contents";
import { NotificationCard } from "@/app/(dashboard)/campaigns/notifications/NotificationCard";
import {
  isApiNotification,
  type NotificationByType,
} from "@/types/notifications";
import { useParams } from "next/navigation";

interface DropsListProps {
  isAdvertiser: boolean | null;
  content?: ContentItem | null;
}

type MainTab = "updates" | "drops";

const DropsList: React.FC<DropsListProps> = ({ isAdvertiser, content }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [dropzoneData, setDropzoneData] = useState<ContentItem | null>(null);
  const [activeMainTab, setActiveMainTab] = useState<MainTab>("drops");

  const params = useParams<{ id: string }>();
  const id = params?.id;

  const handleMainTabClick = (tab: MainTab) => {
    setActiveMainTab(tab);
  };

  useEffect(() => {
    if (content && !dropzoneData) {
      setDropzoneData(content);
    }
  }, [content, dropzoneData]);

  useEffect(() => {
    setDropzoneData(null);
  }, [id]);

  const renderContent = () => {
    if (activeMainTab === "updates") {
      const rawNotifications: unknown = dropzoneData?.notifications;
      const notifications = Array.isArray(rawNotifications)
        ? rawNotifications.filter(isApiNotification)
        : [];
      if (!notifications.length) {
        return (
          <p className="text-center text-gray-500 p-[20px]">
            No updates available.
          </p>
        );
      }

      return notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ));
    }

    if (activeMainTab === "drops") {
      const drops = dropzoneData?.dropzone || [];
      if (!drops.length) {
        return (
          <p className="text-center text-gray-500 p-[20px]">
            No drops available.
          </p>
        );
      }

      return drops.map((drop, index) => {
        const item: NotificationByType<"Assets"> = {
          id: index + 1,
          type: "Assets",
          icon: "",
          content: `New drop from ${drop.first_name} ${drop.last_name}: ${drop.folder_name}`,
          actions: [
            { type: "Download", url: drop.link },
            { type: "Share", url: drop.link },
          ],
          created: drop.created,
          read: true,
        };

        return (
          <NotificationCard key={`${drop.link}-${index}`} notification={item} />
        );
      });
    }

    return null;
  };

  return (
    <div className="mt-[50px] grid lg:grid-cols-2 items-start gap-[20px]">
      {/* Left Panel */}
      <div className="border border-[#f4f0f0] max-h-[800px] h-full">
        <div className="border-b border-[#f4f0f0]">
          <div className="flex items-center gap-[20px] text-[16px] p-4 bg-[#f4faff]">
            <p
              className={`cursor-pointer ${
                activeMainTab === "updates"
                  ? "text-[#000000] font-[500]"
                  : "text-[#767676] font-[400]"
              }`}
              onClick={() => handleMainTabClick("updates")}
            >
              Updates
            </p>
            <p
              className={`cursor-pointer ${
                activeMainTab === "drops"
                  ? "text-[#000000] font-[500]"
                  : "text-[#767676] font-[400]"
              }`}
              onClick={() => handleMainTabClick("drops")}
            >
              Drops
            </p>
          </div>
        </div>
        <div className="h-[600px] overflow-y-auto scrollbar-hide">
          {renderContent()}
        </div>
      </div>

      {/* Right Panel */}
      {/* <div className="max-h-[800px] h-full overflow-y-auto scrollbar-hide border rounded-[8px] border-[#f4f0f0] p-[20px] hover:bg-green-500 hover:bg-opacity-5 hover:border hover:border-green-500">
        {!isUnlocked ? (
          <DropZoneInput
            pin={pin}
            setIsUnlocked={setIsUnlocked}
            onUnlock={() => {
              console.log("Unlocked!");
            }}
          />
        ) : (
          <DropForm setDropzoneData={setDropzoneData} />
        )}
      </div> */}
    </div>
  );
};

export default DropsList;
