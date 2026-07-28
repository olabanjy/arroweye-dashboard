import React from "react";
import DashboardLayout from "../dashboard/layout";
import PaymentTab from "./component/PaymentTab";
import Head from "next/head";

const Payment = () => {
  return (
    <>
      <Head>
        <title>Payments - Arroweye</title>
      </Head>
      <DashboardLayout>
        <PaymentTab />
      </DashboardLayout>
    </>
  );
};

export default Payment;
// comment
