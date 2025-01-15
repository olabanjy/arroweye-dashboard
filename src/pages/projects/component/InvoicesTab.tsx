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
    <div className="lg:p-[20px] ">
      <div className=" ">
        <div className="grid md:flex items-center gap-[20px] md:gap-[40px]">
          <div className="flex gap-[20px] items-center  ">
            <button
              className={`pb-[10px] text-[18px] transition-all duration-300 ${
                activeTab === "Projects"
                  ? "border-b border-[#17845a] text-[#17845a] font-[400]"
                  : "font-[400]"
              }`}
              onClick={() => setActiveTab("Projects")}
            >
              Projects
            </button>
            <button
              className={`pb-[10px] text-[18px] transition-all duration-300 ${
                activeTab === "Archive"
                  ? "border-b border-[#17845a] text-[#17845a] font-[400]"
                  : "font-[400]"
              }`}
              onClick={() => setActiveTab("Archive")}
            >
              Archive
            </button>
          </div>

          <div className="flex-grow ">
            <div className="flex items-center justify-end gap-[10px]">
              <div className="flex-grow font-IBM">
                <Input
                  type="text"
                  placeholder="Search by title, subvendor and date..."
                  className=" w-full rounded-full font-IBM placeholder:font-IBM text-[17px] placeholder:text-[17px]"
                />
              </div>
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

      <div className="relative">
        <div
          className={`transition-opacity duration-500 ease-in-out ${
            activeTab === "Projects" ? "opacity-100" : "opacity-0 absolute"
          }`}
        >
          {activeTab === "Projects" && <Projects filterVisible={filter} />}
        </div>
        <div
          className={`transition-opacity duration-500 ease-in-out ${
            activeTab === "Archive" ? "opacity-100" : "opacity-0 absolute"
          }`}
        >
          {activeTab === "Archive" && <Archive filterVisible={filter} />}
        </div>
      </div>
    </div>
  );
};

export default InvoicesTab;
