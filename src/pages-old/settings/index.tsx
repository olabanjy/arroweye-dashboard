import React from "react";
import DashboardLayout from "../dashboard/layout";
import Setting from "./component/Setting";
import Head from "next/head";

const Settings = () => {
  return (
    <>
      <Head>
        <title>Settings - Arroweye</title>
      </Head>
      <DashboardLayout>
        <Setting />
      </DashboardLayout>
    </>
  );
};

export default Settings;
