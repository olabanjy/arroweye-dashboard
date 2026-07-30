import React, { useMemo } from "react";
import {
  Table,
  type TableHeader,
  type TableRow,
} from "@/components/campaigns/table";
import { BsTrash } from "react-icons/bs";
import { SelectInput } from "@/components/ui/selectinput";
import Link from "next/link";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { Dialog } from "primereact/dialog";
import { Button } from "@/components/ui/button";
import { useCampaigns } from "@/hooks/use-campaigns";
import Pagination from "@/pages-old/drops/component/Pagination";

interface ProjectsProps {
  filterVisible: boolean;
  searchValue: string;
}

const PROJECT_HEADERS: TableHeader[] = [
  { content: "Campaigns", align: "left" },
  { content: "Label", align: "left" },
  { content: "Artist", align: "left" },
  { content: "Start Date", align: "left" },
  { content: "Pin", align: "center" },
  { content: "Manage", align: "center" },
  { content: "Action", align: "center" },
];

const ADVERTISER_HEADERS: TableHeader[] = [
  { content: "Campaigns", align: "left" },
  { content: "Artist", align: "left" },
  { content: "Start Date", align: "left" },
  { content: "Manage", align: "center" },
];

const TableEmptyState = ({ label }: { label: string }) => (
  <div className="flex h-[50vh] flex-col items-center justify-center text-center">
    <div className="my-8">
      <p className="text-[20px] font-semibold text-grey-400">{label}</p>
    </div>
  </div>
);

const Campaigns: React.FC<ProjectsProps> = ({ filterVisible, searchValue }) => {
  const {
    isLoading,
    isAdvertiser,
    copiedPin,
    currentPage,
    totalPages,
    isArchiving,
    setIsArchiving,
    investmentFilter,
    setInvestmentFilter,
    revenueFilter,
    setRevenueFilter,
    goToPage,
    handleCopyPin,
    handleArchiveSubmit,
    editMode,
    setEditMode,
    filteredContent,
    filteredCampaignList,
  } = useCampaigns({ searchValue });

  const projectRows = useMemo<TableRow[]>(
    () =>
      filteredContent
        ?.slice()
        .reverse()
        .map((item, index) => ({
          id: item.id ?? index,
          data: [
            <div key={`project-title-${item.id ?? index}`}>
              <Link href={`/campaigns/${item.id}`}>{item?.title}</Link>
            </div>,
            item?.subvendor?.organization_name,
            item?.artist_name,
            item?.created?.slice(0, 10) || "2025-01-13",
            <button
              type="button"
              className="w-[150px] cursor-pointer whitespace-nowrap rounded border bg-white p-2 text-center font-medium md:w-full"
              key={`project-pin-${item.id ?? index}`}
              onClick={() => handleCopyPin(String(item?.pin ?? ""))}
            >
              {copiedPin === String(item?.pin) ? "Copied!" : "Copy PIN"}
            </button>,
            <Link
              href={`/campaigns/${item.id}`}
              key={`project-manage-${item.id ?? index}`}
            >
              <div className="flex justify-center text-black">
                <span className="sr-only">
                  Manage {item?.title ?? "campaign"}
                </span>
                <MdOutlineModeEditOutline size={20} aria-hidden="true" />
              </div>
            </Link>,
            <div
              key={`project-actions-${item.id ?? index}`}
              className="flex justify-center gap-2"
            >
              <button
                type="button"
                aria-label={`Archive ${item?.title ?? "campaign"}`}
                className={`rounded-full text-black ${
                  isArchiving === item.id ? "opacity-50" : ""
                }`}
                onClick={() => {
                  setEditMode(true);
                  setIsArchiving(typeof item.id === "number" ? item.id : null);
                }}
                disabled={isArchiving === item.id}
              >
                <BsTrash size={20} aria-hidden="true" />
              </button>
            </div>,
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

  const advertiserRows = useMemo<TableRow[]>(
    () =>
      filteredCampaignList?.map((item, index) => ({
        id: item.id ?? index,
        data: [
          <div key={`campaign-title-${item.id ?? index}`}>
            <Link href={`/campaigns/${item.id}`}>{item.song_title}</Link>
          </div>,
          item.song_artist,
          item.start_date,
          <Link
            href={`/campaigns/${item.id}`}
            key={`campaign-manage-${item.id ?? index}`}
          >
            <div className="flex justify-center text-black">
              <span className="sr-only">
                Manage {item.song_title ?? "campaign"}
              </span>
              <MdOutlineModeEditOutline size={20} aria-hidden="true" />
            </div>
          </Link>,
        ],
      })) ?? [],
    [filteredCampaignList],
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
              value={investmentFilter}
              onChange={(value) => setInvestmentFilter(value)}
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
              value={revenueFilter}
              onChange={(value) => setRevenueFilter(value)}
            />
          </div>
          <p
            className="max-w-[150px] w-full cursor-pointer text-[14px] rounded-full px-[10px] py-[5px] hover:bg-orange-500 bg-[#000000] text-white inline"
            onClick={() => {
              setInvestmentFilter("");
              setRevenueFilter("");
            }}
          >
            Clear Filters
          </p>
        </div>
      )}
      <div className="mt-5">
        {!isAdvertiser && (
          <Table
            aria-label="Campaign projects"
            highlightFirstCell={true}
            headers={PROJECT_HEADERS}
            rows={projectRows}
            emptyState={
              <TableEmptyState label={isLoading ? "Loading..." : "No Data"} />
            }
          />
        )}

        {isAdvertiser && (
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 rounded-md">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#31bc86] border-t-transparent" />
              </div>
            )}
            <Table
              aria-label="Created campaigns"
              highlightFirstCell={true}
              headers={ADVERTISER_HEADERS}
              rows={advertiserRows}
              emptyState={
                <TableEmptyState
                  label={isLoading ? "Loading..." : "No Campaigns"}
                />
              }
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                if (!isLoading) goToPage(page);
              }}
            />
          </div>
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
          <div className="space-y-4 font-SansFlex">
            <p className="text-[16px] font-[400] font-SansFlex">
              Are you sure you want to archive this item?
            </p>

            <div className="flex justify-end space-x-2">
              <Button
                onClick={async () => {
                  if (isArchiving !== null) {
                    await handleArchiveSubmit(isArchiving);
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
    </>
  );
};

export default Campaigns;
