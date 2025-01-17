import { FC } from "react";
import { MdStars } from "react-icons/md";

interface MilestoneNotificationCardProps {
  timeAgo: string;
  message: string;
  highlight?: string;
  onDownload: () => void;
  onShare: () => void;
}

const MilestoneNotificationCard: FC<MilestoneNotificationCardProps> = ({
  timeAgo,
  message,
  highlight,
  onShare,
}) => {
  return (
    <div className="flex items-start gap-[10px] pb-[20px] border-b">
      <div className="mt-[15px] w-8 h-8 rounded px-[10px] py-[4px] bg-orange-100 flex items-center justify-center">
        <MdStars className="text-orange-500 text-[21px]" />
      </div>
      <div>
        <p className="font-[600] text-[8px]  text-[#7f7f7f] tracking-[.1rem]">
          {timeAgo}
        </p>
        <p className="font-[400] text-[16px] text-[#000000]">
          {message} <span className="font-[600]">{highlight}</span>{" "}
        </p>
        <div className="flex items-center gap-[10px] mt-[20px] text-[16px]">
          <div
            className="h-8 rounded px-[10px] py-[8px] border bg-black flex items-center justify-center cursor-pointer"
            onClick={onShare}
          >
            <p className="text-[#ffffff]">Track</p>
          </div>
          <div
            className="h-8 rounded px-[10px] py-[8px] border  flex items-center justify-center cursor-pointer"
            onClick={onShare}
          >
            <p className="text-[#000000]">Share</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneNotificationCard;
