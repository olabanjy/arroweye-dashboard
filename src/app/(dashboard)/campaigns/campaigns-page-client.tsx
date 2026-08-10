"use client";

import { useState } from "react";
import InvoicesTab from "@/components/campaigns/InvoicesTab";
import Insight from "@/components/campaigns/Insight";

export default function CampaignsPageClient() {
  const [activeTab, setActiveTab] = useState("manage");

  return (
    <>
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
}
