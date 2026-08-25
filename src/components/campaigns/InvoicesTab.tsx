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
        <div className="mb-4 grid items-center gap-[20px] md:flex md:gap-10">
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
                  className="h-auto w-full rounded-full border-border bg-background! text-[17px] text-foreground shadow-none placeholder:text-[17px]"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
              <Button
                type="button"
                size="icon-lg"
                aria-label={filter ? "Hide filters" : "Show filters"}
                className="size-10 shrink-0 self-center rounded-full"
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
