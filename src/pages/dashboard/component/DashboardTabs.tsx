import { useState } from "react";

const DashboardTabs = () => {
  const [activeTab, setActiveTab] = useState("Manage");

  return (
    <div>
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
          <div className="p-4 bg-gray-100 rounded shadow">
            <h2 className="text-xl font-bold mb-2">Manage Tab Content</h2>
          </div>
        )}
        {activeTab === "Insights" && (
          <div className="p-4 bg-gray-100 rounded shadow">
            <h2 className="text-xl font-bold mb-2">Insights Tab Content</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTabs;
