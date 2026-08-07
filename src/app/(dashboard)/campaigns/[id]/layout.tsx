import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const CampaignDetailLayout = ({ children }: LayoutProps) => {
  return children;
};

export default CampaignDetailLayout;
