import type { Metadata } from "next";
import SpinsTableComponent from "../(dashboard)/payments/component/SpinsTableComponent";

export const metadata: Metadata = {
  title: "Spins - Arroweye",
};

const SpinsChart = () => {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <SpinsTableComponent />
    </div>
  );
};

export default SpinsChart;
