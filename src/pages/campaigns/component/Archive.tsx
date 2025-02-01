import React, { useEffect, useState } from "react";
import Table from "./Table";
// import { BsCurrencyDollar } from "react-icons/bs";
import { SelectInput } from "@/components/ui/selectinput";
import { getProjects, archiveProject } from "@/services/api";
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
  const [isArchiving, setIsArchiving] = useState<string | null>(null);

  useEffect(() => {
    getProjects().then((fetchedContent) => {
      setContent(fetchedContent);
    });
  }, []);

  const filteredContent = content?.filter((item) => item.archived === true);

  const handleArchiveSubmit = async (projectId: string, archive: boolean) => {
    if (!projectId || isArchiving) return;

    setIsArchiving(projectId);

    try {
      await archiveProject(Number(projectId), { archived: archive });
      const updatedContent = await getProjects();
      setContent(updatedContent);
    } catch (error) {
      console.error(
        `Error ${archive ? "archiving" : "unarchiving"} project ${projectId}:`,
        error
      );
    } finally {
      setIsArchiving(null);
    }
  };

  return (
    <div className="">
      {filterVisible && (
        <div className=" text-center flex flex-wrap items-end gap-[5px] md:gap-[10px] my-4">
          <div className="max-w-[150px] w-full rounded-full">
            <SelectInput
              rounded={true}
              options={[
                { value: "", label: "Investment" },
                { value: "htl", label: "High to Low" },
                { value: "lth", label: "Low to High" },
              ]}
            />
          </div>
          <div className="max-w-[150px] w-full rounded-full">
            <SelectInput
              rounded={true}
              options={[
                { value: "", label: "Revenue" },
                { value: "htl", label: "High to Low" },
                { value: "lth", label: "Low to High" },
              ]}
            />
          </div>
          <p className="max-w-[150px] w-full  cursor-pointer text-[14px] rounded-full px-[10px] py-[5px] hover:bg-orange-500 bg-[#000000] text-white inline">
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
              item?.vendor?.organization_name,
              item?.subvendor?.organization_name,
              item?.created?.slice(0, 10),
              item?.code,
              item?.pin,
              <button
                key={`manage-button-${index}`}
                className="p-[8px] text-blue-600 hover:text-blue-800 "
                onClick={() => handleArchiveSubmit(String(item.id), false)}
              >
                Manage
              </button>,
              // <div
              //   key={`action-buttons-${index}`}
              //   className="flex justify-center gap-2"
              // >
              //   <button
              //     className="p-[16px] hover:bg-orange-500 bg-[#000000] text-[#ffffff] rounded-full"
              //     onClick={() => alert("Action triggered!")}
              //   >
              //     <BsCurrencyDollar />
              //   </button>
              // </div>,
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
