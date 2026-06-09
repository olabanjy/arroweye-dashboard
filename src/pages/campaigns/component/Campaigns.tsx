import React, { useEffect, useState } from "react";
import ls from "localstorage-slim";
import Table from "./Table";
import { BsTrash } from "react-icons/bs";
import { SelectInput } from "@/components/ui/selectinput";
import {
  archiveProject,
  getProjects,
  getCreatedCampaigns,
} from "@/services/api";
import { ContentItem } from "@/types/contents";
import Link from "next/link";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { Dialog } from "primereact/dialog";
import { Button } from "@/components/ui/button";

interface ProjectsProps {
  filterVisible: boolean;
  searchValue: string;
}

const Campaigns: React.FC<ProjectsProps> = ({ filterVisible, searchValue }) => {
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [isAdvertiser, setIsAdvertiser] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState("");

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

  const [copiedPin, setCopiedPin] = useState<string | null>(null);
  const [content, setContent] = useState<ContentItem[] | null>(null);
  const [campaignList, setCampaignList] = useState<any[] | null>(null);
  const [isArchiving, setIsArchiving] = useState<number | null>(null);

  const [investmentFilter, setInvestmentFilter] = useState<any>("");
  const [revenueFilter, setRevenueFilter] = useState<any>("");

  useEffect(() => {
    if (isAdvertiser === null) return; // still resolving

    if (isAdvertiser) {
      setContent([]);
      setIsLoading(false);
      return;
    }

    const fetchProjects = async () => {
      try {
        const fetchedContent = await getProjects();
        setContent(fetchedContent);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [isAdvertiser]);

  const fetchProjects = async () => {
    try {
      const fetchedContent = await getProjects();
      console.log("Projects", fetchedContent);
      setContent(fetchedContent);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdvertiser === null) return; // still resolving

    if (!isAdvertiser) {
      setIsLoading(false);
      return;
    }

    const fetchgetCreatedCampaigns = async () => {
      try {
        const fetchedContent = await getCreatedCampaigns();
        setCampaignList(fetchedContent?.results);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchgetCreatedCampaigns();
  }, [isAdvertiser]);

  useEffect(() => {
    const content: any = ls.get("Profile", { decrypt: true });
    console.log("CONTENT FOR LOGGED IN USER", content);
    setUserRole(content?.user?.user_profile?.role);
    if (content?.user?.user_type === "Advertiser") {
      setIsAdvertiser(true);
    } else {
      setIsAdvertiser(false);
    }
  }, []);

  const handleCopyPin = (pin: string) => {
    navigator.clipboard.writeText(pin);
    setCopiedPin(pin);
    setTimeout(() => setCopiedPin(null), 2000);
  };

  const handleArchiveSubmit = async (projectId: number) => {
    try {
      setIsArchiving(projectId);
      await archiveProject(projectId, { archived: true });
      await fetchProjects();
      setEditMode(false);
    } catch (error) {
      console.error(`Error archiving project ${projectId}:`, error);
    } finally {
      setIsArchiving(null);
    }
  };

  const filteredContent = content
    ?.filter(
      (item) =>
        !item.archived &&
        (item.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.vendor?.organization_name
            ?.toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          item.subvendor?.organization_name
            ?.toLowerCase()
            .includes(searchValue.toLowerCase())),
    )
    .sort((a: any, b: any) => {
      if (investmentFilter === "htl") {
        return b.total_investment - a.total_investment; // High to Low
      } else if (investmentFilter === "lth") {
        return a.total_investment - b.total_investment; // Low to High
      }
      return 0; // No sorting
    })
    .sort((a: any, b: any) => {
      if (revenueFilter === "htl") {
        return b.total_revenue - a.total_revenue; // High to Low
      } else if (revenueFilter === "lth") {
        return a.total_revenue - b.total_revenue; // Low to High
      }
      return 0; // No sorting
    });

  const filteredCampaignList = campaignList
    ?.filter(
      (item) =>
        item.status === "active" &&
        (item.song_title?.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.song_artist?.toLowerCase().includes(searchValue.toLowerCase())),
    )
    .sort((a: any, b: any) => {
      if (investmentFilter === "htl") {
        return b.total_tokens - a.total_tokens;
      } else if (investmentFilter === "lth") {
        return a.total_tokens - b.total_tokens;
      }
      return 0;
    });
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
          <Table
            highlightFirstCell={true}
            headers={campaignHeaders}
            rows={filteredCampaignList
              ?.slice()
              .reverse()
              .map((item, index) => ({
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
                      No Campaigns
                    </p>
                  </div>
                </div>
              )
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
