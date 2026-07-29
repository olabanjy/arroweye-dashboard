"use client";
import { useState } from "react";
import Head from "next/head";
import Manage from "./component/Manage";
import InvoicesTab from "./component/InvoicesTab";
import Insight from "./component/Insight";

const Campaigns = () => {
  const [activeTab, setActiveTab] = useState("Manage");
  return (
    <>
      <Head>
        <title>Campaigns - Arroweye</title>
      </Head>

      <div className=" ">
        <div className="flex gap-2.5 items-center mb-4 lg:ml-5"></div>

        <div>
          {activeTab === "Manage" && (
            <div className="">
              {/* <Manage /> */}

              {/* render the invoices for campaigns created */}
              <InvoicesTab />
            </div>
          )}
          {activeTab === "Insights" && <Insight />}
        </div>
      </div>
    </>
  );
};

export default Campaigns;
