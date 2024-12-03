import { FC, ReactNode } from "react";
import Sidebar from "@/pages/dashboard/component/Sidebar";
import TopNav from "@/pages/dashboard/component/topNav";

interface LayoutProps {
  children: ReactNode;
}

const DashboardLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNav />
        <main className="flex-1 border border-gray-100 p-4 mx-[20px] rounded-[8px]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
