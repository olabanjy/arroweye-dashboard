import { useState } from "react";
import Manage from "./Manage";
import InvoicesTab from "./InvoicesTab";
import Insight from "./Insight";

const ProjectTab = () => {
  const [activeTab, setActiveTab] = useState("Manage");

  return (
    <div className=" ">
      <div className="flex gap-[10px] items-center mb-4 lg:ml-[20px] "></div>

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
