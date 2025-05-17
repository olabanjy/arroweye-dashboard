import React, { useEffect } from "react";
import DashboardLayout from "../dashboard/layout";
import ProjectTab from "./component/ManageTab";
import Head from "next/head";
import { toast } from "react-toastify";

const Payment = () => {
  useEffect(() => {
    toast.loading("Test Text");
  }, []);

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
