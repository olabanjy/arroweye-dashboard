import React, { useEffect, useState } from "react";
import DropZoneInput from "./DropZoneInput";
import AssetsNotificationCard from "@/pages/dashboard/component/AssetsNotificationCard";
import DropForm from "./DropForm";
import { ContentItem } from "@/types/contents";
import { getSingleProject } from "@/services/api";
import { useRouter } from "next/router";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import FirstPlayNotificationCard from "@/pages/dashboard/component/FirstPlayNotificationCard";
import SecurityNotificationCard from "@/pages/dashboard/component/SecurityNotificationCard";
import PaymentMomentNotificationCard from "@/pages/dashboard/component/payments/PaymentMomentNotificationCard";
import MilestoneNotificationCard from "@/pages/dashboard/component/MilestoneNotificationCard";

const DropsList = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [dropzoneData, setDropzoneData] = useState<ContentItem | null>(null);
  const [pin, setPin] = useState("");
  const [activeMainTab, setActiveMainTab] = useState("drops");

  const { query } = useRouter();
  const { id } = query;

  const handleMainTabClick = (tab: string) => {
    setActiveMainTab(tab);
  };

  const handleDownload = (link: string) => {
    window.open(link, "_blank");
  };

  const handleShare = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.info("Link copied to clipboard!");
  };

  useEffect(() => {
    if (!!id) {
      getSingleProject(Number(id)).then((fetchedContent: any) => {
        setDropzoneData(fetchedContent);
        setPin(fetchedContent?.pin);
      });
    }
  }, [id]);

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const componentMap: any = {
    Assets: AssetsNotificationCard,
    Campaigns: FirstPlayNotificationCard,
    Security: SecurityNotificationCard,
    Payments: PaymentMomentNotificationCard,
    Milestone: MilestoneNotificationCard,
  };

  const renderContent = () => {
    if (activeMainTab === "updates") {
      const notifications = dropzoneData?.notifications || [];
      if (!notifications.length) {
        return (
          <p className="text-center text-gray-500 p-[20px]">
            No updates available.
          </p>
        );
      }

      return notifications.map((drop: any, index: number) => {
        const Component = componentMap[drop.type] || AssetsNotificationCard;
        return (
          <div key={index} className="p-[20px]">
            <Component
              timeAgo={formatRelativeDate(drop.created)}
              message={drop.content}
              onDownload={() => handleDownload(drop.link)}
              onShare={() => handleShare(drop.link)}
              actions={drop.actions}
              iconClass={drop.icon}
            />
          </div>
        );
      });
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

      return drops.map((drop: any, index: number) => (
        <div key={index} className="p-[20px]">
          <AssetsNotificationCard
            timeAgo={formatRelativeDate(drop.created)}
            message={`New drop from ${drop.first_name} ${drop.last_name}: ${drop.folder_name}`}
            onDownload={() => handleDownload(drop.link)}
            onShare={() => handleShare(drop.link)}
            actions={[
              { type: "Download", url: drop.link },
              { type: "Share", url: drop.link },
            ]}
            iconClass={drop.icon}
          />
        </div>
      ));
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
      <div className="max-h-[800px] h-full overflow-y-auto scrollbar-hide border rounded-[8px] border-[#f4f0f0] p-[20px] hover:bg-green-500 hover:bg-opacity-5 hover:border hover:border-green-500">
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
      </div>
    </div>
  );
};

export default DropsList;
