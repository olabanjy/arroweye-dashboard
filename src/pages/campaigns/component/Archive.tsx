import React, { useEffect, useState } from "react";
import Table from "./Table";
import { SelectInput } from "@/components/ui/selectinput";
import { getProjects, archiveProject } from "@/services/api";
import { ContentItem } from "@/types/contents";
import { Dialog } from "primereact/dialog";
import { Button } from "@/components/ui/button";

interface ProjectsProps {
  filterVisible: boolean;
  searchValue: string;
}

const Archive: React.FC<ProjectsProps> = ({ filterVisible, searchValue }) => {
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const headers: { content: string; align: "left" | "center" | "right" }[] = [
    { content: "Title", align: "left" },
    { content: "Vendor", align: "left" },
    { content: "Subvendor", align: "left" },
    { content: "Start Date", align: "left" },
    { content: "Pin", align: "center" },
    { content: "Code", align: "center" },
    { content: "Action", align: "center" },
  ];

  const [content, setContent] = useState<ContentItem[] | null>(null);
  const [isArchiving, setIsArchiving] = useState<string | null>(null);

  useEffect(() => {
    getProjects().then((fetchedContent) => {
      setContent(fetchedContent);
      setIsLoading(false);
    });
  }, []);

  const filteredContent = content
    ?.filter((item) => item.archived === true)
    ?.filter((item) =>
      item.title?.toLowerCase().includes(searchValue.toLowerCase())
    );

  const handleArchiveSubmit = async (projectId: string, archive: boolean) => {
    try {
      setIsArchiving(projectId);
      await archiveProject(Number(projectId), { archived: archive });
      const updatedContent = await getProjects();
      setContent(updatedContent);
      setEditMode(false);
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
        <div className="text-center flex flex-wrap items-end gap-[5px] md:gap-[10px] my-4">
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
          <p className="max-w-[150px] w-full cursor-pointer text-[14px] rounded-full px-[10px] py-[5px] hover:bg-orange-500 bg-[#000000] text-white inline">
            Clear Filters
          </p>
        </div>
      )}

      <div className="mt-[20px]">
        {isLoading ? (
          <div className="flex h-[50vh] flex-col items-center justify-center text-center">
            <div className="my-[32px]">
              <p className="text-[20px] font-[600] text-grey-400">Loading...</p>
            </div>
          </div>
        ) : (
          <Table
            headers={headers}
            rows={filteredContent?.map((item, index) => ({
              data: [
                item?.title,
                item?.vendor?.organization_name,
                item?.subvendor?.organization_name,
                item?.created?.slice(0, 10) || "-",
                item?.code,
                item?.pin,
                <button
                  key={`manage-button-${index}`}
                  className={`p-[8px] text-blue-600 hover:text-blue-800 ${
                    isArchiving === String(item.id) ? "opacity-50" : ""
                  }`}
                  onClick={() => {
                    setEditMode(true);
                    setIsArchiving(String(item.id));
                  }}
                  disabled={isArchiving === String(item.id)}
                >
                  Restore
                </button>,
              ],
            }))}
            emptyState={
              <div className="flex h-[50vh] flex-col items-center justify-center text-center">
                <div className="my-[32px]">
                  <p className="text-[20px] font-[600] text-grey-400">
                    No Data
                  </p>
                </div>
              </div>
            }
          />
        )}
      </div>

      <div
        className={`custom-dialog-overlay ${
          editMode
            ? "bg-black/30 backdrop-blur-md fixed inset-0 z-50"
            : "hidden"
        }`}
      >
        <Dialog
          visible={editMode}
          onHide={() => {
            setEditMode(false);
            setIsArchiving(null);
          }}
          breakpoints={{ "960px": "75vw", "640px": "100vw" }}
          style={{ width: "30vw" }}
          className="custom-dialog-overlay"
        >
          <div className="space-y-4">
            <p className="text-[16px] font-[400] font-IBM">
              Are you sure you want to unarchive this item?
            </p>

            <div className="flex justify-end space-x-2">
              <Button
                label="Yes"
                onClick={async () => {
                  if (isArchiving) {
                    await handleArchiveSubmit(isArchiving, false);
                  }
                }}
                className="px-[16px] py-[8px] text-white rounded-[8px] bg-blue-500"
              />

              <Button
                label="No"
                onClick={() => {
                  setEditMode(false);
                  setIsArchiving(null);
                }}
                className="px-[16px] py-[8px] text-[#000000] rounded-[8px] bg-slate-100"
              />
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Archive;
