"use client";
import React, { useEffect, useState } from "react";
import { ContentItem } from "@/types/contents";
import { NotificationCard } from "@/app/(dashboard)/campaigns/notifications/NotificationCard";
import { DropzoneUploadDialog } from "@/app/(dashboard)/campaigns/notifications/dropzone-upload-dialog";
import {
  isApiNotification,
  type NotificationByType,
} from "@/types/notifications";
import { useParams } from "next/navigation";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DropsListProps {
  isAdvertiser: boolean | null;
  content?: ContentItem | null;
  onAssetsChanged?: () => void | Promise<void>;
}

type MainTab = "updates" | "drops";

const DropsList: React.FC<DropsListProps> = ({
  isAdvertiser,
  content,
  onAssetsChanged,
}) => {
  const [dropzoneData, setDropzoneData] = useState<ContentItem | null>(null);
  const [activeMainTab, setActiveMainTab] = useState<MainTab>("drops");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const params = useParams<{ id: string }>();
  const id = params?.id;

  const handleMainTabClick = (tab: MainTab) => {
    setActiveMainTab(tab);
  };

  useEffect(() => {
    setDropzoneData(content ?? null);
  }, [content]);

  useEffect(() => {
    setUploadDialogOpen(false);
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
              Assets
            </p>
          </div>
        </div>
        <div className="h-[600px] overflow-y-auto scrollbar-hide">
          {renderContent()}
        </div>
      </div>

      {/* Right Panel */}
      {isAdvertiser === false && (
        <div className="flex min-h-52 flex-col items-center justify-center rounded-[8px] border border-dashed border-green-500/60 bg-green-500/5 p-6 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
            <UploadCloud className="size-6" />
          </span>
          <p className="mt-4 text-[18px] font-medium">Drop em!</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Add a Google Drive, Dropbox, WeTransfer, OneDrive, or pCloud link to
            this campaign.
          </p>
          <Button
            type="button"
            className="mt-5 rounded-full bg-zinc-950 px-5 text-white hover:bg-orange-500 dark:bg-zinc-100 dark:text-zinc-950"
            onClick={() => setUploadDialogOpen(true)}
          >
            Upload asset
          </Button>
        </div>
      )}

      {id && (
        <DropzoneUploadDialog
          open={uploadDialogOpen}
          projectId={id}
          onOpenChange={setUploadDialogOpen}
          onUploaded={() => {
            void onAssetsChanged?.();
          }}
        />
      )}
    </div>
  );
};

export default DropsList;
