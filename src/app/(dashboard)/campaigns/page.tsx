"use client";
import { useState } from "react";
import Head from "next/head";
import InvoicesTab from "@/components/campaigns/InvoicesTab";
import Insight from "@/components/campaigns/Insight";

const Campaigns = () => {
  const [activeTab, setActiveTab] = useState("manage");
  return (
    <>
      <Head>
        <title>Campaigns - Arroweye</title>
      </Head>

      <div className=" ">
        <div className="flex gap-2.5 items-center mb-4 lg:ml-5"></div>

        <div>
          {activeTab === "manage" && (
            <div className="">
              {/* <Manage /> */}

              {/* render the invoices for campaigns created */}
              <InvoicesTab />
            </div>
          )}
          {activeTab === "insights" && <Insight />}
        </div>
      </div>
    </>
  );
};

export default Campaigns;
