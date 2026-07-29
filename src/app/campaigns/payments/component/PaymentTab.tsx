import { useState } from "react";
import Manage from "./Manage";
import Insight from "./Insight";
import InvoicesTab from "./InvoicesTab";

const PaymentTab = () => {
  const [activeTab, setActiveTab] = useState("Manage");
  return (
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
  );
};

export default PaymentTab;
