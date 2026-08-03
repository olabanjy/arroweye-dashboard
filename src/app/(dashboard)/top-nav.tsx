"use client";

import { FC } from "react";
import NotificationsMenu from "./notifications-menu";

const TopNav: FC = () => {
  return (
    <div className="relative">
      <div className="relative flex h-[10px] items-center justify-between px-[10px] pt-[50px] text-white lg:px-[40px]">
        <div className="text-lg font-semibold opacity-0">Dashboard</div>
        <div className="relative">
          <NotificationsMenu triggerClassName="relative mb-[40px] text-foreground md:mb-0" />
        </div>
      </div>
    </div>
  );
};

export default TopNav;
