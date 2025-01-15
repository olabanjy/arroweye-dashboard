import { FC, ReactNode } from "react";
import Sidebar from "@/pages/dashboard/component/Sidebar";
import TopNav from "@/pages/dashboard/component/topNav";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LayoutProps {
  children: ReactNode;
  withBorder?: boolean;
}

const DashboardLayout: FC<LayoutProps> = ({ children, withBorder = true }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-y-scroll scrollbar-hide flex-grow">
        <TopNav />
        <main
          className={`flex-1 ${
            withBorder ? "border border-gray-100" : ""
          } p-4 mx-[20px] border-none rounded-[8px] mt-[20px]`}
        >
          {children}
        </main>
        <ToastContainer />
      </div>
    </div>
  );
};

export default DashboardLayout;
