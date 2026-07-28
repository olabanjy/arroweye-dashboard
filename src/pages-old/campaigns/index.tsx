import React from "react";
import DashboardLayout from "../dashboard/layout";
import ProjectTab from "./component/ManageTab";
import Head from "next/head";

const Payment = () => {
  return (
    <>
      <Head>
        <title>Campaigns - Arroweye</title>
      </Head>
      <DashboardLayout>
        <ProjectTab />
      </DashboardLayout>
    </>
  );
};

export default Payment;
