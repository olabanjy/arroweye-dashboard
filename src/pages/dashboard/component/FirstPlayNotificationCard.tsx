import { FC } from "react";
import { FaPlayCircle } from "react-icons/fa";
import { MdOutlineFileDownload } from "react-icons/md";
import { toast } from "react-toastify";

interface FirstPlayNotificationCardProps {
  timeAgo: string;
  message: string;
  highlight?: string;
  onDownload: () => void;
  onShare: () => void;
  actions: any;
  iconClass?: string;
}

const FirstPlayNotificationCard: FC<FirstPlayNotificationCardProps> = ({
  timeAgo,
  message,
  highlight,
  onDownload,
  onShare,
  actions,
  iconClass,
}) => {
  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link).then(() => {
      toast.success("Link has been copied!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    });
  };
  const getRandomBgColor = () => {
    const colors = [
      "bg-red-200",
      "bg-blue-200",
      "bg-green-200",
      "bg-yellow-200",
      "bg-purple-200",
      "bg-pink-200",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="flex items-start gap-[10px] pb-[20px] border-b">
      {!!iconClass ? (
        <div
          className={`w-8 h-8 rounded px-[10px] py-[4px] flex items-center justify-center ${getRandomBgColor()}`}
        >
          <i className={`${iconClass} text-[#947c01] text-[21px]`} />
        </div>
      ) : (
        <div className="mt-[15px] w-8 h-8 rounded px-[10px] py-[4px] bg-amber-200 flex items-center justify-center">
          <FaPlayCircle className="text-[#947c01] text-[21px]" size={24} />
        </div>
      )}

      <div>
        <p className="font-[600] text-[8px]  text-[#7f7f7f] tracking-[.1rem]">
          {timeAgo}
        </p>
        <p className="font-[400] text-[16px] text-[#000000] leading-[25px]">
          {message} <span className="font-[600]">{highlight}</span>{" "}
        </p>
        {!!actions && actions.length > 0 && (
          <div className="flex items-center gap-[10px] mt-[14px] text-[16px]">
            {actions.map((action: any) =>
              action.type === "Download" ? (
                <div
                  key={action.type} // Add a key for each item
                  className="w-10 h-[30px] rounded px-[10px] py-[4px] bg-[#000000] flex items-center justify-center cursor-pointer"
                  onClick={() => window.open(action.url, "_blank")}
                >
                  <MdOutlineFileDownload className="text-white" size={24} />
                </div>
              ) : action.type === "Share" ? (
                <div
                  key={action.type}
                  className="h-8 rounded px-[10px] py-[8px] border bg-white flex items-center justify-center cursor-pointer"
                  onClick={() => handleCopyLink(action.url)}
                >
                  <p className="text-black">Share</p>
                </div>
              ) : action.type === "Track" ? (
                <div
                  key={action.type} // Add a key for each item
                  className="w-max h-[30px] rounded px-[10px] py-[4px] bg-[#000000] text-white flex items-center justify-center cursor-pointer"
                  onClick={() => window.open(action.url, "_blank")}
                >
                  Track
                </div>
              ) : action.type === "Manage" ? (
                <div
                  key={action.type} // Add a key for each item
                  className="w-max h-[30px] rounded px-[10px] py-[4px] bg-[#000000] text-white flex items-center justify-center cursor-pointer"
                  // onClick={() => window.open(action.url, "_blank")}
                >
                  Manage
                </div>
              ) : action.type === "View" ? (
                <div
                  key={action.type} // Add a key for each item
                  className="w-max h-[30px] rounded px-[10px] py-[4px] bg-[#000000] text-white flex items-center justify-center cursor-pointer"
                  onClick={() => window.open(action.url, "_blank")}
                >
                  View
                </div>
              ) : action.type === "Pay" ? (
                <div
                  key={action.type} // Add a key for each item
                  className="w-max h-[30px] rounded px-[10px] py-[4px] bg-[#000000] text-white flex items-center justify-center cursor-pointer"
                  // onClick={() => window.open(action.url, "_blank")}
                >
                  Pay
                </div>
              ) : action.type === "Delete" ? (
                <div
                  key={action.type} // Add a key for each item
                  className="w-max h-[30px] rounded px-[10px] py-[4px] bg-[#000000] text-white flex items-center justify-center cursor-pointer"
                  // onClick={() => window.open(action.url, "_blank")}
                >
                  Delete
                </div>
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FirstPlayNotificationCard;
