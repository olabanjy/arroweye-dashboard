"use client";
import { FC, ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./sidebar";
import TopNav from "./top-nav";
import { usePathname } from "next/navigation";
import { useProtectedRoute } from "./hooks/use-protected-route";
import ScrollToTopButton from "@/components/scroll-to-top-button";

interface LayoutProps {
  children: ReactNode;
  withBorder?: boolean;
}

const DashboardLayoutClient: FC<LayoutProps> = ({ children, withBorder = true }) => {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useProtectedRoute();

  if (isLoading || !isAuthenticated) {
    return (
      <div id="preloader">
        <h1 className="pine-bold text-lg"></h1>
        <div id="preloader_line"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className=" z-50">
        <Sidebar />
      </div>
      <div
        id="dashboard-scroll-container"
        className="flex-1 flex flex-col overflow-y-scroll scrollbar-hide flex-grow"
      >
        <TopNav />
        <main
          className={`w-full max-w-6xl mx-auto ${withBorder ? "border border-gray-100" : ""} ${
            pathname !== "/campaigns/spins-notifications" &&
            pathname !== "/campaigns/setup/custom" &&
            pathname !== "/campaigns/setup/promoter"
              ? "mx-[20px]"
              : ""
          } border-none rounded-xl mt-5`}
        >
          {children}
        </main>
        <ToastContainer />
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default DashboardLayoutClient;