import { useState } from "react";
import Manage from "./Manage";
import InvoicesTab from "./InvoicesTab";
import Insight from "./Insight";

const ProjectTab = () => {
  const [activeTab, setActiveTab] = useState("Manage");

  return (
    <div className=" p-[20px]">
      <div className="flex gap-[10px] items-center mb-4">
        <button
          className={`px-[16px] py-[4px] rounded-full text-[20px]  ${
            activeTab === "Manage"
              ? "bg-[#e6ff99] text-black font-[600]"
              : " font-[500]"
          }`}
          onClick={() => setActiveTab("Manage")}
        >
          Manage
        </button>
        <button
          className={`px-[16px] py-[4px] rounded-full text-[20px]  ${
            activeTab === "Insights"
              ? "bg-[#e6ff99] text-black font-[600]"
              : " font-[500]"
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
