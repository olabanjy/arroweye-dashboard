import React from "react";
import Layout from "@/pages/dashboard/layout";
import DashboardTabs from "./component/DashboardTabs";

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <DashboardTabs />
    </Layout>
  );
};

export default Dashboard;
