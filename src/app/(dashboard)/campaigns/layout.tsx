import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const CampaignsLayout = ({ children }: LayoutProps) => {
  return children;
};

export default CampaignsLayout;
