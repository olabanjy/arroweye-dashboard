import React from "react";
import { FaGoogleDrive, FaDropbox } from "react-icons/fa";
import { GrOnedrive } from "react-icons/gr";
import { FaCloudArrowUp } from "react-icons/fa6";
import { SiWetransfer } from "react-icons/si";

interface ButtonProps {
  element: React.ReactNode;
  tooltip: string;
}

interface CardProps {
  title: string;
  mainIcon?:
    | "GoogleDrive"
    | "WeTransfer"
    | "OneDrive"
    | "DropBox"
    | "PCloud"
    | null;
  buttons: ButtonProps[];
  userInitials?: string;
  userFullName?: string;
  userEmail?: string;
  userColor?: string;
}

const LibraryCard: React.FC<CardProps> = ({
  title,
  mainIcon = null,
  buttons = [],
}) => {
  // Function to render the appropriate icon based on the mainIcon value
  const renderIcon = () => {
    if (!mainIcon) return null;

    const iconSize = 20;
    const opacity = "30%";
    const iconColor = "#555555";

    switch (mainIcon) {
      case "GoogleDrive":
        return <FaGoogleDrive size={20} color={iconColor} opacity={opacity} />;
      case "WeTransfer":
        return <SiWetransfer size={27} color={iconColor} opacity={opacity} />;
      case "OneDrive":
        return <GrOnedrive size={25} color={iconColor} opacity={opacity} />;
      case "DropBox":
        return <FaDropbox size={22} color={iconColor} opacity={opacity} />;
      case "PCloud":
        return <FaCloudArrowUp size={25} color={iconColor} opacity={opacity} />;
      default:
        return <FaGoogleDrive size={20} color={iconColor} opacity={opacity} />;
    }
  };

  return (
    <div className="hover:bg-[#f0f8ff] hover:bg-opacity-5 hover:border hover:border-[#87CEEB] font-IBM py-[20px] px-[10px] border rounded-[20px] w-full h-[200px] flex flex-col justify-between space-y-[10px] group">
      <p className="px-2 text-[16px] md:text-[18px] font-[500] text-[#212529]">
        {title}
      </p>
      <div className="flex items-center justify-between pl-2">
        {renderIcon()}
        <div className="flex items-center justify-end space-x-2">
          {buttons.map((button, index) => (
            <div
              key={index}
              className="flex items-center justify-center"
              title={button.tooltip}
            >
              {button.element}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LibraryCard;
