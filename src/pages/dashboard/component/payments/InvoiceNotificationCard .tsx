import { FC } from "react";
import { FiFileText } from "react-icons/fi";
import { MdOutlineFileDownload } from "react-icons/md";

interface InvoiceNotificationCardProps {
  timeAgo: string;
  message: string;
  highlight?: string;
  onDownload: () => void;
  onShare: () => void;
}

const InvoiceNotificationCard: FC<InvoiceNotificationCardProps> = ({
  timeAgo,
  message,
  highlight,
  onDownload,
  onShare,
}) => {
  return (
    <div className="flex items-start gap-[10px] pb-[20px] border-b font-IBM">
      <div className="mt-[15px] w-8 h-8 rounded px-[10px] py-[4px] bg-purple-600 bg-opacity-20 flex items-center justify-center">
        <FiFileText className="text-purple-500 text-[21px]" size={24} />
      </div>
      <div>
        <p className="font-[600] text-[8px]  text-[#7f7f7f] tracking-[.1rem]">
          {timeAgo}
        </p>
        <p className="font-[400] text-[16px] text-[#000000] leading-[25px]">
          {message} <span className="font-[600]">{highlight}</span>{" "}
        </p>
        <div className="flex items-center gap-[10px] mt-[14px] text-[16px]">
          <div
            className="w-10 h-[30px] rounded px-[10px] py-[4px] bg-[#000000] flex items-center justify-center cursor-pointer"
            onClick={onDownload}
          >
            <MdOutlineFileDownload className="text-white" size={24} />
          </div>
          <div
            className="h-8 rounded px-[10px] py-[8px] border bg-white flex items-center justify-center cursor-pointer"
            onClick={onShare}
          >
            <p className="text-black">Pay</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceNotificationCard;
