"use client";
import { useState } from "react";
import Head from "next/head";
import Manage from "./component/Manage";
import InvoicesTab from "./component/InvoicesTab";
import Insight from "./component/Insight";

const Payment = () => {
  const [activeTab, setActiveTab] = useState("Manage");
  return (
    <>
      <Head>
        <title>Payments - Arroweye</title>
      </Head>

      <div className=" lg:p-[20px]">
        <div>
          {activeTab === "Manage" && (
            <div className="">
              {" "}
              <Manage />
              <InvoicesTab />
            </div>
          )}
          {activeTab === "Insights" && <Insight />}
        </div>
      </div>
    </>
  );
};

export default Payment;
