import React, { useState } from "react";
import Table from "./Table";
import { BsTrash } from "react-icons/bs";
import { SelectInput } from "@/components/ui/selectinput";
import Link from "next/link";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { Dialog } from "primereact/dialog";
import { Button } from "@/components/ui/button";
import Pagination from "@/pages/drops/component/Pagination";
import { useCampaigns } from "../../../hooks/use-campaigns";

interface ProjectsProps {
  filterVisible: boolean;
  searchValue: string;
}

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

  const headers: { content: string; align: "left" | "center" | "right" }[] = [
    { content: "Campaigns", align: "left" },
    { content: "Label", align: "left" },
    { content: "Artist", align: "left" },
    { content: "Start Date", align: "left" },
    { content: "Pin", align: "center" },
    { content: "Manage", align: "center" },
    { content: "Action", align: "center" },
  ];
  const campaignHeaders: {
    content: string;
    align: "left" | "center" | "right";
  }[] = [
    { content: "Campaigns", align: "left" },
    { content: "Song", align: "left" },
    { content: "Artist", align: "left" },
    { content: "Start Date", align: "left" },
    { content: "Manage", align: "center" },
  ];

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
      <div className="mt-[20px]">
        {!isAdvertiser && (
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
                  item?.subvendor?.organization_name,
                  item?.artist_name,
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
                      <button className="text-[#000000] rounded-full">
                        <MdOutlineModeEditOutline size={20} />
                      </button>
                    </div>
                  </Link>,
                  <div
                    key={`action-buttons-${index}`}
                    className="flex justify-center gap-2"
                  >
                    <button
                      className={`text-[#000000] rounded-full ${isArchiving === item.id ? "opacity-50" : ""}`}
                      onClick={() => {
                        setEditMode(true);
                        setIsArchiving(
                          typeof item.id === "number" ? item.id : null,
                        );
                      }}
                      disabled={isArchiving === item.id}
                    >
                      <BsTrash size={20} />
                    </button>
                  </div>,
                ],
              }))}
            emptyState={
              isLoading ? (
                <div className="flex h-[50vh] flex-col items-center justify-center text-center">
                  <div className="my-[32px]">
                    <p className="text-[20px] font-[600] text-grey-400">
                      Loading...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex h-[50vh] flex-col items-center justify-center text-center">
                  <div className="my-[32px]">
                    <p className="text-[20px] font-[600] text-grey-400">
                      No Data
                    </p>
                  </div>
                </div>
              )
            }
          />
        )}

        {isAdvertiser && (
          <div>
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 rounded-md">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#31bc86] border-t-transparent" />
              </div>
            )}
            <Table
              highlightFirstCell={true}
              headers={campaignHeaders}
              rows={filteredCampaignList?.map((item) => ({
                data: [
                  <div key={`title-${item.id}`}>
                    <Link href={`/campaigns/${item.id}`}>
                      {item.song_title}
                    </Link>
                  </div>,
                  item.song_title,
                  item.song_artist,
                  item.start_date,
                  <Link
                    href={`/campaigns/${item.id}`}
                    key={`manage-${item.id}`}
                  >
                    <div className="flex justify-center">
                      <button className="text-[#000000] rounded-full">
                        <MdOutlineModeEditOutline size={20} />
                      </button>
                    </div>
                  </Link>,
                ],
              }))}
              emptyState={
                <div className="flex h-[50vh] flex-col items-center justify-center text-center">
                  <p className="text-[20px] font-[600] text-grey-400">
                    No Campaigns
                  </p>
                </div>
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
          <div className="space-y-4 font-IBM">
            <p className="text-[16px] font-[400] font-IBM">
              Are you sure you want to archive this item?
            </p>

            <div className="flex justify-end space-x-2">
              <Button
                label="Yes"
                onClick={async () => {
                  if (isArchiving !== null) {
                    await handleArchiveSubmit(isArchiving);
                  }
                }}
                className="px-[16px] py-[8px] text-white rounded-full bg-blue-500"
              />

              <Button
                label="No"
                onClick={() => {
                  setEditMode(false);
                  setIsArchiving(null);
                }}
                className="px-[16px] py-[8px] text-[#000000] rounded-full bg-slate-100"
              />
            </div>
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default Campaigns;
