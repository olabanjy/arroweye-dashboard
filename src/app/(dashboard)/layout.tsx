"use client";
import { FC, ReactNode, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/context/auth-session";
import Sidebar from "./sidebar";
import TopNav from "./top-nav";
import { usePathname, useRouter } from "next/navigation";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface LayoutProps {
  children: ReactNode;
  withBorder?: boolean;
}

const DashboardLayout: FC<LayoutProps> = ({ children, withBorder = true }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated]);

  return (
    <div className="flex h-screen overflow-hidden">
      <ReactQueryDevtools />
      <div className=" z-50">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-y-scroll scrollbar-hide flex-grow">
        <TopNav />
        <main
          className={`flex-1 ${withBorder ? "border border-gray-100" : ""} ${
            pathname !== "/campaigns/spins-notifications" &&
            pathname !== "/campaigns/setup/custom" &&
            pathname !== "/campaigns/setup/promoter"
              ? "mx-[20px]"
              : ""
          } border-none rounded-[8px] mt-[20px]`}
        >
          {children}
        </main>
        <ToastContainer />
      </div>
    </div>
  );
};

export default DashboardLayout;
