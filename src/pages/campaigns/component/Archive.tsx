import React, { useEffect, useState } from "react";
import Table from "./Table";
import { BsCurrencyDollar } from "react-icons/bs";
import { SelectInput } from "@/components/ui/selectinput";
import { getProjects } from "@/services/api";
import { ContentItem } from "@/types/contents";

interface ProjectsProps {
  filterVisible: boolean;
}

const Archive: React.FC<ProjectsProps> = ({ filterVisible }) => {
  const headers: { content: string; align: "left" | "center" | "right" }[] = [
    { content: "Title", align: "left" },
    { content: "Vendor", align: "left" },
    { content: "Subvendor", align: "left" },
    { content: "Start Date", align: "left" },
    { content: "Pin", align: "center" },
    { content: "Manage", align: "center" },
    { content: "Action", align: "center" },
  ];

  const [content, setContent] = useState<ContentItem[] | null>(null);

  useEffect(() => {
    getProjects().then((fetchedContent) => {
      setContent(fetchedContent);
    });
  }, []);

  const filteredContent = content?.filter((item) => item.archived === true);

  return (
    <div className="">
      {filterVisible && (
        <div className="flex items-end gap-[10px] my-[10px]">
          <div className="max-w-[100px] w-full rounded-full">
            <SelectInput
              rounded={true}
              options={[
                { value: "", label: "Investment" },
                { value: "htl", label: "High to Low" },
                { value: "lth", label: "Low to High" },
              ]}
            />
          </div>
          <div className="max-w-[100px] w-full rounded-full">
            <SelectInput
              rounded={true}
              options={[
                { value: "", label: "Revenue" },
                { value: "htl", label: "High to Low" },
                { value: "lth", label: "Low to High" },
              ]}
            />
          </div>
          <p className="cursor-pointer text-[14px] rounded-full px-[16px] py-[4px] hover:bg-orange-500 bg-[#000000] text-white inline">
            Clear Filters
          </p>
        </div>
      )}

      <div className="  mt-[20px]">
        <Table
          headers={headers}
          rows={filteredContent?.map((item, index) => ({
            data: [
              item?.title,
              item?.vendor,
              item?.subvendor,
              item?.created?.slice(0, 10),
              item?.code,
              item?.pin,
              <button
                key={`manage-button-${index}`}
                className="p-[8px] text-blue-600 hover:text-blue-800 "
                onClick={() => alert("Manage action triggered!")}
              >
                Manage
              </button>,
              <div
                key={`action-buttons-${index}`}
                className="flex justify-center gap-2"
              >
                <button
                  className="p-[16px] hover:bg-orange-500 bg-[#000000] text-[#ffffff] rounded-full"
                  onClick={() => alert("Action triggered!")}
                >
                  <BsCurrencyDollar />
                </button>
              </div>,
            ],
          }))}
          emptyState={
            <div className="flex h-[50vh] flex-col items-center justify-center text-center">
              <div className="my-[32px]">
                <p className="text-[20px] font-[600] text-grey-400">No Data</p>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default Archive;
