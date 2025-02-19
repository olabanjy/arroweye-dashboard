import React, { useEffect, useState } from "react";
import DropZoneInput from "./DropZoneInput";
import AssetsNotificationCard from "@/pages/dashboard/component/AssetsNotificationCard";
import DropForm from "./DropForm";
import { ContentItem } from "@/types/contents";
import { getSingleProject } from "@/services/api";
import { useRouter } from "next/router";

const calculateTimeAgo = (dateString: string): string => {
  const createdDate = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor(
    (now.getTime() - createdDate.getTime()) / 1000
  );

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;

  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

const DropsList = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [dropzoneData, setDropzoneData] = useState<ContentItem | null>(null);
  const [pin, setPin] = useState("");

  const { query } = useRouter();
  const { id } = query;

  const handleDownload = (link: string) => {
    window.open(link, "_blank");
  };

  const handleShare = (link: string) => {
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };

  const handleUnlock = () => {};
  useEffect(() => {
    if (!!id) {
      getSingleProject(Number(id)).then((fetchedContent: any) => {
        setDropzoneData(fetchedContent);
        console.log("fetched", fetchedContent);
        setPin(fetchedContent?.pin);
      });
    }
  }, [id]);

  console.log(dropzoneData);

  return (
    <div className="mt-[50px] grid lg:grid-cols-2 items-start gap-[20px]">
      {/* Left Panel */}
      <div className="border border-[#f4f0f0] max-h-[800px] h-full">
        <div className="border-b border-[#f4f0f0]">
          <p className="border px-[16px] py-[8px] bg-[#f4faff] text-[16px] text-[#212529] font-[900]">
            Drops
          </p>
        </div>
        <div className="h-[600px] overflow-y-auto scrollbar-hide">
          {dropzoneData?.dropzone?.length ? (
            dropzoneData.dropzone.map((drop, index) => (
              <div key={index} className="p-[20px]">
                <AssetsNotificationCard
                  timeAgo={calculateTimeAgo(drop.created)}
                  message={`New drop from ${drop.first_name} ${drop.last_name}: ${drop.folder_name}`}
                  onDownload={() => handleDownload(drop.link)}
                  onShare={() => handleShare(drop.link)}
                  actions={[]}
                />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 p-[20px]">
              No drops available.
            </p>
          )}
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
