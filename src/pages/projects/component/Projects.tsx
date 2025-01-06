import React, { useEffect, useState } from "react";
import Image from "next/image";
import Table from "./Table";
import { BsCurrencyDollar } from "react-icons/bs";
import { SelectInput } from "@/components/ui/selectinput";
import { getProjects, getStoredProjects } from "@/services/api";
import { ContentItem } from "@/types/contents";

interface ProjectsProps {
  filterVisible: boolean;
}

const Projects: React.FC<ProjectsProps> = ({ filterVisible }) => {
  const headers: string[] = [
    "Title",
    "Vendor",
    "Subvendor",
    "Date",
    "Code",
    "Pin",
    "Manage",
    "Action",
  ];

  const rows = [
    {
      data: [
        "Arroweye",
        "Johnson",
        "John",
        "21/06/2024",
        "Cult Wife Inc",
        "334343",
        <button
          key="delete-button"
          className="p-[8px] text-red-600 hover:text-red-800"
          onClick={() => alert("Delete action triggered!")}
        >
          Delete
        </button>,
        <div key="action-buttons-1" className="flex justify-center gap-2">
          <button
            className="p-[16px] hover:bg-orange-500 bg-[#000000] text-[#ffffff] rounded-full"
            onClick={() => alert("Action triggered!")}
          >
            <BsCurrencyDollar />
          </button>
        </div>,
      ],
    },
  ];

  const [content, setContent] = useState<ContentItem[] | null>(null);

  useEffect(() => {
    const content = getStoredProjects();

    if (content) {
      setContent(content);
    } else {
      getProjects().then((fetchedContent) => {
        setContent(fetchedContent);
      });
    }
  }, []);
  console.log(content);

  return (
    <div className="rounded-[16px] border bg-grey-25 p-[16px]">
      {filterVisible && (
        <div className="flex items-end gap-[10px] my-[10px]">
          <div className="max-w-[200px] w-full rounded-full">
            <SelectInput
              options={[
                { value: "", label: "Investment" },
                { value: "htl", label: "High to Low" },
                { value: "lth", label: "Low to High" },
              ]}
            />
          </div>
          <div className="max-w-[200px] w-full rounded-full">
            <SelectInput
              options={[
                { value: "", label: "Revenue" },
                { value: "htl", label: "High to Low" },
                { value: "lth", label: "Low to High" },
              ]}
            />
          </div>
          <p className="cursor-pointer rounded-[4px] px-[16px] py-[10px] hover:bg-orange-500 bg-[#000000] text-white inline">
            Clear Filters
          </p>
        </div>
      )}

      <Table
        headers={headers}
        rows={rows}
        emptyState={
          <div className="flex h-[50vh] flex-col items-center justify-center text-center">
            <Image
              src="/product/emptyState.svg"
              width={100}
              height={100}
              alt="empty state"
            />
            <div className="my-[32px]">
              <p className="text-[20px] font-[600] text-grey-400">No Data</p>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default Projects;
