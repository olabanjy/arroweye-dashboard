import React, { useEffect, useState } from "react";
import Table from "./Table";
import { BsTrash } from "react-icons/bs";
import { SelectInput } from "@/components/ui/selectinput";
import { getProjects } from "@/services/api";
import { ContentItem } from "@/types/contents";
import Link from "next/link";
import { MdOutlineModeEditOutline } from "react-icons/md";

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

  const [copiedPin, setCopiedPin] = useState<string | null>(null);
  const [content, setContent] = useState<ContentItem[] | null>(null);

  useEffect(() => {
    getProjects().then((fetchedContent) => {
      setContent(fetchedContent);
    });
  }, []);

  const handleCopyPin = (pin: string) => {
    navigator.clipboard.writeText(pin);
    setCopiedPin(pin);
    setTimeout(() => setCopiedPin(null), 2000);
  };

  return (
    <>
      {filterVisible && (
        <div className="flex items-end gap-[10px] my-[20px]">
          <div className="max-w-[150px] w-full">
            <SelectInput
              rounded={true}
              options={[
                { value: "", label: "Investment" },
                { value: "htl", label: "High to Low" },
                { value: "lth", label: "Low to High" },
              ]}
            />
          </div>
          <div className="max-w-[150px] w-full">
            <SelectInput
              rounded={true}
              options={[
                { value: "", label: "Revenue" },
                { value: "htl", label: "High to Low" },
                { value: "lth", label: "Low to High" },
              ]}
            />
          </div>
          <p className="cursor-pointer rounded-full px-[16px] py-[4px] hover:bg-orange-500 bg-[#000000] text-white inline">
            Clear Filters
          </p>
        </div>
      )}
      <div className=" mt-[20px]">
        <Table
          highlightFirstCell={true}
          headers={headers}
          rows={content?.map((item, index) => ({
            data: [
              <div key={`manage-button-${index}`}>
                <Link href={`/projects/${item.id}`}>{item?.title}</Link>
              </div>,
              item?.vendor,
              item?.subvendor,
              item?.created?.slice(0, 10) || "January, 2025",
              item?.code,
              <div
                className="p-[8px] text-center border bg-white rounded cursor-pointer font-[500] w-[150px] whitespace-nowrap"
                key={"code"}
                onClick={() => handleCopyPin(String(item?.pin ?? ""))}
              >
                {copiedPin === String(item?.pin) ? "Copied!" : "Copy PIN"}
              </div>,
              <Link
                href={`/projects/${item.id}`}
                key={`manage-button-${index}`}
              >
                <div className="flex justify-center ">
                  <button className=" text-[#000000]  ">
                    <MdOutlineModeEditOutline size={20} />
                  </button>
                </div>
              </Link>,
              <div
                key={`action-buttons-${index}`}
                className="flex justify-center gap-2"
              >
                <button
                  className=" text-[#000000] "
                  onClick={() => alert("Action triggered!")}
                >
                  <BsTrash size={20} />
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
    </>
  );
};

export default Projects;
