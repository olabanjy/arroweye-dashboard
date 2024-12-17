import React from "react";
import { FaGoogleDrive } from "react-icons/fa";

interface ButtonProps {
  element: React.ReactNode;
  tooltip: string;
}

interface CardProps {
  title: string;
  mainIcon?: React.ReactNode;
  buttons: ButtonProps[];
  userInitials: string;
  userFullName: string;
  userEmail: string;
  userColor: string;
}

const LibraryCard: React.FC<CardProps> = ({
  title,
  mainIcon,
  buttons = [],
}) => {
  return (
    <div className="py-[20px] px-[10px] border rounded-[8px] min-w-[300px] max-w-[350px] h-[200px] flex flex-col justify-between space-y-[10px] group">
      <p className="text-[16px] md:text-[18px]">{title}</p>

      <div className="flex items-center justify-between">
        {mainIcon || <FaGoogleDrive className="text-[#cbcbcb]" size={14} />}
        <div className="flex items-center justify-end">
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
