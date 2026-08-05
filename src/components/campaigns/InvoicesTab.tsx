"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { IoFilter } from "react-icons/io5";
import Archive from "./Archive";
import Campaigns from "./campaigns-table";
import { Button } from "../ui/button";

const InvoicesTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Campaigns" | "Archive">(
    "Campaigns",
  );
  const [filter, setFilter] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    setFilter(false);
  }, [activeTab]);

  return (
    <div className="lg:p-5 ">
      <div className=" ">
        <div className="grid md:flex items-center gap-[20px] md:gap-10">
          <div className="flex gap-5 items-center  ">
            <button
              className={`pb-2.5 text-[18px] transition-all duration-300 ${
                activeTab === "Campaigns"
                  ? "border-b border-[#17845a] text-[#17845a] font-normal"
                  : "font-normal"
              }`}
              onClick={() => setActiveTab("Campaigns")}
            >
              Campaigns
            </button>
            <button
              className={`pb-[10px] text-[18px] transition-all duration-300 ${
                activeTab === "Archive"
                  ? "border-b border-[#17845a] text-[#17845a] font-normal"
                  : "font-normal"
              }`}
              onClick={() => setActiveTab("Archive")}
            >
              Archive
            </button>
          </div>

          <div className="grow">
            <div className="flex items-center justify-end gap-[10px]">
              <div className="grow font-SansFlex">
                <Input
                  type="text"
                  placeholder="Search by title, label and artist..."
                  className=" w-full rounded-full bg-background! font-SansFlex placeholder:font-SansFlex text-[17px] placeholder:text-[17px]"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
              <Button
                className="cursor-pointer rounded-full hover:bg-orange-500 size-10 hover:text-white"
                onClick={() => setFilter(!filter)}
              >
                <IoFilter />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div
          className={`transition-opacity duration-500 ease-in-out ${
            activeTab === "Campaigns" ? "opacity-100" : "opacity-0 absolute"
          }`}
        >
          {activeTab === "Campaigns" && (
            <Campaigns filterVisible={filter} searchValue={searchValue} />
          )}
        </div>
        <div
          className={`transition-opacity duration-500 ease-in-out ${
            activeTab === "Archive" ? "opacity-100" : "opacity-0 absolute"
          }`}
        >
          {activeTab === "Archive" && (
            <Archive searchValue={searchValue} filterVisible={filter} />
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoicesTab;
