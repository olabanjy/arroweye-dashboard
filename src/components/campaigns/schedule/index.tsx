import React from "react";
import DashboardLayout from "../dashboard/layout";
import Schedule from "./component/Schedule";
import Head from "next/head";

const SchedulePage = () => {
  return (
    <>
      <Head>
        <title>Schedules - Arroweye</title>
      </Head>
      <DashboardLayout>
        <Schedule isDateClickEnabled={true} isSchedulePage={true} />
      </DashboardLayout>
    </>
  );
};

export default SchedulePage;
