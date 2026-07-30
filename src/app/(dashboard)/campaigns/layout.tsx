"use client";

import { FC, ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const CampaignsLayout: FC<LayoutProps> = ({ children }) => {
  return children;
};

export default CampaignsLayout;
