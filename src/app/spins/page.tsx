import type { Metadata } from "next";
import DashboardLayoutClient from "../(dashboard)/dashboard-layout-client";
import SpinsTableComponent from "../(dashboard)/payments/component/SpinsTableComponent";

export const metadata: Metadata = {
  title: "Spins - Arroweye",
};

const SpinsChart = () => {
  return (
    <DashboardLayoutClient requireAuth={false}>
      <div className="min-h-screen bg-background text-foreground">
        <SpinsTableComponent />
      </div>
    </DashboardLayoutClient>
  );
};

export default SpinsChart;
