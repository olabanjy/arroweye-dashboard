import { FC, ReactNode, useEffect } from "react";
import ls from "localstorage-slim";
import Sidebar from "@/pages/dashboard/component/Sidebar";
import TopNav from "@/pages/dashboard/component/topNav";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LayoutProps {
  children: ReactNode;
  withBorder?: boolean;
}

const DashboardLayout: FC<LayoutProps> = ({ children, withBorder = true }) => {
  useEffect(() => {
    const content: any = ls.get("Profile", { decrypt: true });
    const token = content?.access;

    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className=" z-50">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-y-scroll scrollbar-hide flex-grow">
        <TopNav />
        <main
          className={`flex-1 ${
            withBorder ? "border border-gray-100" : ""
          }  mx-[20px] border-none rounded-[8px] mt-[20px]`}
        >
          {children}
        </main>
        <ToastContainer />
      </div>
    </div>
  );
};

export default DashboardLayout;
