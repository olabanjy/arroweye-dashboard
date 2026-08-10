"use client";
import { FC, ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./sidebar";
import TopNav from "./top-nav";
import { usePathname } from "next/navigation";
import { useProtectedRoute } from "./hooks/use-protected-route";
import ScrollToTopButton from "@/components/scroll-to-top-button";
import { Skeleton } from "@/components/ui/skeleton";

interface LayoutProps {
  children: ReactNode;
  withBorder?: boolean;
}

const DashboardInsightSkeleton = () => (
  <div className="space-y-5 rounded-[8px] border p-5">
    <div className="flex items-center justify-between">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-9 w-[120px]" />
    </div>
    <Skeleton className="h-10 w-28 lg:h-14 lg:w-36" />
    <Skeleton className="h-3 w-24" />
    <Skeleton className="mx-auto aspect-square w-full max-w-[350px] rounded-[8px]" />
  </div>
);

const DashboardLayoutClient: FC<LayoutProps> = ({
  children,
  withBorder = true,
}) => {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useProtectedRoute();

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <div className="hidden w-[280px] shrink-0 border-r p-5 md:block">
          <Skeleton className="mb-8 h-10 w-36" />
          <div className="space-y-3">
            {Array.from({ length: 8 }, (_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex h-16 items-center justify-between border-b px-5">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
          <main className="mx-auto mt-5 w-full max-w-6xl space-y-6 px-5">
            <div className="space-y-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-64 max-w-full" />
              <Skeleton className="h-4 w-48 max-w-full" />
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {Array.from({ length: 3 }, (_, index) => (
                <DashboardInsightSkeleton key={index} />
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
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
