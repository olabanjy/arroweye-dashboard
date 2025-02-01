import React, { useEffect, useState } from "react";
import Table from "./Table";
import { BsTrash } from "react-icons/bs";
import { SelectInput } from "@/components/ui/selectinput";
import { archiveProject, getProjects } from "@/services/api";
import { ContentItem } from "@/types/contents";
import Link from "next/link";
import { MdOutlineModeEditOutline } from "react-icons/md";

interface ProjectsProps {
  filterVisible: boolean;
  searchValue: string;
}

const Campaigns: React.FC<ProjectsProps> = ({ filterVisible, searchValue }) => {
  const headers: { content: string; align: "left" | "center" | "right" }[] = [
    { content: "Campaigns", align: "left" },
    { content: "Label", align: "left" },
    { content: "Artist", align: "left" },
    { content: "Start Date", align: "left" },
    { content: "PIN", align: "center" },
    { content: "Manage", align: "center" },
    { content: "Action", align: "center" },
  ];

  const [copiedPin, setCopiedPin] = useState<string | null>(null);
  const [content, setContent] = useState<ContentItem[] | null>(null);
  const [isArchiving, setIsArchiving] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const fetchedContent = await getProjects();
      setContent(fetchedContent);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleCopyPin = (pin: string) => {
    navigator.clipboard.writeText(pin);
    setCopiedPin(pin);
    setTimeout(() => setCopiedPin(null), 2000);
  };

  const handleArchiveSubmit = async (projectId: string) => {
    if (!projectId || isArchiving) return;

    setIsArchiving(projectId);

    try {
      await archiveProject(Number(projectId), { archived: true });
      console.log(`Project ${projectId} archived successfully!`);

      fetchProjects();
    } catch (error) {
      console.error(`Error archiving project ${projectId}:`, error);
    } finally {
      setIsArchiving(null);
    }
  };

  const filteredContent = content?.filter(
    (item) =>
      !item.archived &&
      (item.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.vendor?.organization_name
          ?.toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        item.subvendor?.organization_name
          ?.toLowerCase()
          .includes(searchValue.toLowerCase()))
  );

  return (
    <>
      {filterVisible && (
        <div className="text-center flex flex-wrap items-end gap-[5px] md:gap-[10px] my-4">
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
          <p className="max-w-[150px] w-full cursor-pointer text-[14px] rounded-full px-[10px] py-[5px] hover:bg-orange-500 bg-[#000000] text-white inline">
            Clear Filters
          </p>
        </div>
      )}
      <div className="mt-[20px]">
        <Table
          highlightFirstCell={true}
          headers={headers}
          rows={filteredContent
            ?.slice()
            .reverse()
            .map((item, index) => ({
              data: [
                <div key={`manage-button-${index}`}>
                  <Link href={`/campaigns/${item.id}`}>{item?.title}</Link>
                </div>,
                item?.vendor?.organization_name,
                item?.subvendor?.organization_name,
                item?.created?.slice(0, 10) || "2025-01-13",
                <div
                  className="p-[8px] text-center border bg-white rounded cursor-pointer font-[500] w-[150px] md:w-full whitespace-nowrap"
                  key={"code"}
                  onClick={() => handleCopyPin(String(item?.pin ?? ""))}
                >
                  {copiedPin === String(item?.pin) ? "Copied!" : "Copy PIN"}
                </div>,
                <Link
                  href={`/campaigns/${item.id}`}
                  key={`manage-button-${index}`}
                >
                  <div className="flex justify-center">
                    <button className="text-[#000000]">
                      <MdOutlineModeEditOutline size={20} />
                    </button>
                  </div>
                </Link>,
                <div
                  key={`action-buttons-${index}`}
                  className="flex justify-center gap-2"
                >
                  <button
                    className={`text-[#000000] ${isArchiving === item.id ? "opacity-50" : ""}`}
                    onClick={() =>
                      item.id && handleArchiveSubmit(String(item.id))
                    }
                    disabled={isArchiving === item.id}
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

export default Campaigns;
