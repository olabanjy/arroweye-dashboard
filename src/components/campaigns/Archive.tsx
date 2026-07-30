import React, { useMemo } from "react";
import {
  Table,
  type TableHeader,
  type TableRow,
} from "@/components/campaigns/table";
import { SelectInput } from "@/components/ui/selectinput";
import { Dialog } from "primereact/dialog";
import { Button } from "@/components/ui/button";
import { useArchive } from "../../../../hooks/use-archive";

interface ProjectsProps {
  filterVisible: boolean;
  searchValue: string;
}

const ARCHIVE_HEADERS: TableHeader[] = [
  { content: "Campaigns", align: "left" },
  { content: "Label", align: "left" },
  { content: "Artist", align: "left" },
  { content: "Start Date", align: "left" },
  { content: "Pin", align: "center" },
  { content: "Action", align: "center" },
];

const Archive: React.FC<ProjectsProps> = ({ filterVisible, searchValue }) => {
  const {
    editMode,
    setEditMode,
    isArchiving,
    setIsArchiving,
    copiedPin,
    isLoading,
    filteredContent,
    handleArchiveSubmit,
    handleCopyPin,
  } = useArchive({ searchValue });

  const rows = useMemo<TableRow[]>(
    () =>
      filteredContent?.map((item, index) => ({
        id: item.id ?? index,
        data: [
          item?.title,
          item?.vendor?.organization_name,
          item?.subvendor?.organization_name,
          item?.created?.slice(0, 10) || "2025-01-13",
          <button
            type="button"
            className="w-[150px] cursor-pointer whitespace-nowrap rounded border bg-white p-2 text-center font-medium md:w-full"
            key={`archive-pin-${item.id ?? index}`}
            onClick={() => handleCopyPin(String(item?.pin ?? ""))}
          >
            {copiedPin === String(item?.pin) ? "Copied!" : "Copy PIN"}
          </button>,
          <button
            type="button"
            key={`restore-button-${item.id ?? index}`}
            className={`p-2 text-blue-600 hover:text-blue-800 ${
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
      })) ?? [],
    [
      copiedPin,
      filteredContent,
      handleCopyPin,
      isArchiving,
      setEditMode,
      setIsArchiving,
    ],
  );

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
            aria-label="Archived campaigns"
            headers={ARCHIVE_HEADERS}
            rows={rows}
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
            <p className="text-[16px] font-[400] font-SansFlex">
              Are you sure you want to unarchive this item?
            </p>

            <div className="flex justify-end space-x-2">
              <Button
                onClick={async () => {
                  if (isArchiving) {
                    await handleArchiveSubmit(isArchiving, false);
                  }
                }}
                className="px-[16px] py-[8px] text-white rounded-full bg-blue-500"
              >
                Yes
              </Button>

              <Button
                onClick={() => {
                  setEditMode(false);
                  setIsArchiving(null);
                }}
                className="px-[16px] py-[8px] text-[#000000] rounded-full bg-slate-100"
              >
                No
              </Button>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Archive;
