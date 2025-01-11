import { useState } from "react";
import Manage from "./Manage";
import InvoicesTab from "./InvoicesTab";
import Insight from "./Insight";

const ProjectTab = () => {
  const [activeTab, setActiveTab] = useState("Manage");

  return (
    <div className=" lg:p-[20px]">
      <div className="flex gap-[10px] items-center mb-4">
        <button
          className={`px-[16px] py-[4px] rounded-full text-[18px]  ${
            activeTab === "Manage"
              ? "bg-[#e6ff99] text-black font-[500]"
              : " font-[400]"
          }`}
          onClick={() => setActiveTab("Manage")}
        >
          Manage
        </button>
        <button
          className={`px-[16px] py-[4px] rounded-full text-[18px]  ${
            activeTab === "Insights"
              ? "bg-[#e6ff99] text-black font-[500]"
              : " font-[400]"
          }`}
          onClick={() => setActiveTab("Insights")}
        >
          Insights
        </button>
      </div>

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

export default ProjectTab;
