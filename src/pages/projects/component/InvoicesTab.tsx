import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { IoFilter } from "react-icons/io5";
import Projects from "./Projects";
import Archive from "./Archive";

const InvoicesTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Projects" | "Archive">(
    "Projects"
  );
  const [filter, setFilter] = useState<boolean>(false);

  useEffect(() => {
    setFilter(false);
  }, [activeTab]);

  return (
    <div className="lg:p-[20px]">
      <div className=" grid md:flex items-start gap-[20px] md:gap-[40px]">
        <div className="flex gap-[10px] items-center  lg:mb-4">
          <button
            className={`pb-[10px] text-[20px] ${
              activeTab === "Projects"
                ? "border-b border-[#17845a] text-[#17845a] font-[600]"
                : "font-[500]"
            }`}
            onClick={() => setActiveTab("Projects")}
          >
            Projects
          </button>
          <button
            className={`pb-[10px] text-[20px] ${
              activeTab === "Archive"
                ? "border-b border-[#17845a] text-[#17845a] font-[600]"
                : "font-[500]"
            }`}
            onClick={() => setActiveTab("Archive")}
          >
            Archive
          </button>
        </div>

        <div className="flex-grow">
          <div className="flex items-center justify-end gap-[10px]">
            <div className="flex-grow">
              <Input
                type="text"
                placeholder="Search by title, subvendor and date..."
                className="w-full rounded-full"
              />
            </div>
            <div className="flex items-center gap-[5px]">
              <div
                className="cursor-pointer p-[16px] hover:bg-orange-500 bg-[#000000] text-[#ffffff] rounded-full"
                onClick={() => setFilter(!filter)}
              >
                <IoFilter />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        {activeTab === "Projects" && <Projects filterVisible={filter} />}
        {activeTab === "Archive" && <Archive filterVisible={filter} />}
      </div>
    </div>
  );
};

export default InvoicesTab;
