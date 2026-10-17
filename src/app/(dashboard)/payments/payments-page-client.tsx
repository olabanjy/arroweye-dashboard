"use client";

import { useState } from "react";
import CreateInvoiceSection from "@/components/invoices/create-invoice-section";
import { useCreateInvoice } from "@/hooks/use-create-invoice";
import InvoicesTab from "./component/InvoicesTab";
import Insight from "./component/Insight";

export default function PaymentsPageClient() {
  const [activeTab, setActiveTab] = useState("Manage");
  const invoice = useCreateInvoice();

  return (
    <>
      <div className=" lg:p-[20px]">
        <div>
          {activeTab === "Manage" && (
            <div className="">
              {" "}
              <CreateInvoiceSection invoice={invoice} />
              <InvoicesTab invoice={invoice} />
            </div>
          )}
          {activeTab === "Insights" && <Insight />}
        </div>
      </div>
    </>
  );
}
