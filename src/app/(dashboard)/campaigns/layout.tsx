"use client";

import { FC, ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const CampaignsLayout: FC<LayoutProps> = ({ children }) => {
  return <div className="flex h-screen overflow-hidden">{children}</div>;
};

export default CampaignsLayout;
