import Image from "next/image";
import { FC } from "react";

interface MusicAdsNotificationCardProps {
  timeAgo: string;
  message: string;
  highlight?: string;
  onShare: () => void;
  onDownload: () => void;
}

const MusicAdsNotificationCard: FC<MusicAdsNotificationCardProps> = ({
  timeAgo,
  message,
  highlight,
  onShare,
}) => {
  return (
    <div className="flex items-start gap-[10px] pb-[20px] border-b">
      <div className="max-w-[100px] w-full h-auto flex-shrink-0">
        <div className="relative w-full h-full aspect-square">
          <Image
            src="/assets/image (1).webp"
            alt="Logo"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div>
        <p className="font-[600] text-[8px]  text-[#7f7f7f] tracking-[.1rem]">
          {timeAgo}
        </p>
        <p className="font-[400] text-[16px] text-[#000000] tracking-[.1rem]">
          {message} <span className="font-[600]">{highlight}</span>{" "}
        </p>
        <div className="flex items-center gap-[10px] mt-[20px] text-[16px]">
          <div
            className="h-8 rounded px-[10px] py-[8px] border bg-black flex items-center justify-center cursor-pointer"
            onClick={onShare}
          >
            <p className="text-[#ffffff]">Listen</p>
          </div>
          <div
            className="h-8 rounded px-[10px] py-[8px] border flex items-center justify-center cursor-pointer"
            onClick={onShare}
          >
            <p className="text-[#000000]">Share</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicAdsNotificationCard;
