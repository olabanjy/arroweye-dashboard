import React from "react";
import DashboardLayout from "../dashboard/layout";
import { HiOutlineCube } from "react-icons/hi";
import { IoFilter } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { SelectInput } from "@/components/ui/selectinput";
import { IoIosArrowRoundDown } from "react-icons/io";
import { FiInfo, FiMinus } from "react-icons/fi";
import LibraryCard from "./component/LibraryCard";
import { Dialog } from "primereact/dialog";
import { LuCopy } from "react-icons/lu";
import Pagination from "./component/Pagination";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Head from "next/head";
import { useDrops } from "../../hooks/use-drops";

const colors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
];

interface User {
  initials: string;
  user_profile: {
    fullname: string;
    staff_email: string;
    role: string;
    business_name: string;
  };
  created: any;
  last_login: any;
}

export const Tooltip = ({ info }: { info: string }) => (
  <div className="relative group">
    <FiInfo className="text-gray-400 hover:text-blue-500 cursor-pointer" />
    <div className="absolute left-[25px] top-0 transform  ml-1 hidden w-60 p-[12px] text-xs font-[400] text-white bg-black rounded-[4px] group-hover:block z-10 shadow-lg font-SansFlex">
      <div className="absolute left-0 top-[10px] transform -translate-y-1/2 -ml-[6px] border-black  border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-black"></div>
      {info}
    </div>
  </div>
);

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const AssetsLibrary = () => {
  const {
    content,
    currentPage,
    totalPages,
    filter,
    setFilter,
    selectedUser,
    setSelectedUser,
    userLoggedInProfile,
    filters,
    setFilters,
    updateFilters,
    vendorOptions,
    subVendorOptions,
    deleteLoading,
    deleteDialog,
    setDeleteDialog,
    projectPin,
    setProjectPin,
    pinEntered,
    setPinEntered,
    pinError,
    setPinError,
    dropIdToBeDeleted,
    setDropIdToBeDeleted,
    handlePageChange,
    handleUserClick,
    handleCopyLink,
    handleDelete,
  } = useDrops();

  return (
    <>
      <Head>
        <title>Drops - Arroweye</title>
      </Head>
      <DashboardLayout>
        <div className="flex items-center gap-[10px]">
          <HiOutlineCube className="text-[#7e7e7e]" size={24} />
          <p className="font-[900] text-[30px] text-[#000000]">Asset Library</p>
        </div>
        <div className="flex-grow mt-[50px]">
          <div className="flex items-center justify-end gap-[10px]">
            <div className="flex-grow">
              <Input
                type="text"
                placeholder="Search..."
                className="w-full rounded-full font-SansFlex placeholder:font-SansFlex text-[17px] placeholder:text-[17px]"
                value={filters.search}
                onChange={(e: any) => updateFilters("search", e.target.value)}
              />
            </div>
            <div className="flex items-center gap-[5px]">
              <div
                className="cursor-pointer p-[16px] hover:bg-orange-500 bg-[#000000] text-[#ffffff] rounded-full"
                onClick={() => setFilter(!filter)}
              >
                <IoFilter />
              </div>
            </div>
          </div>
        </div>
        {filter && (
          <div className="my-[10px]">
            <div className="flex items-center flex-wrap gap-[10px] mb-[20px]">
              <div className="max-w-[150px] w-full rounded-full">
                <SelectInput
                  placeholder="Year"
                  rounded={true}
                  options={[
                    { value: "2025", label: "2025" },
                    { value: "2024", label: "2024" },
                    { value: "2023", label: "2023" },
                  ]}
                  value={filters.year}
                  onChange={(value: any) => updateFilters("year", value)}
                />
              </div>
              <div className="max-w-[150px] w-full rounded-full">
                <SelectInput
                  placeholder="Month"
                  rounded={true}
                  options={[
                    { value: "1", label: "January" },
                    { value: "2", label: "February" },
                    { value: "3", label: "March" },
                    { value: "4", label: "April" },
                    { value: "5", label: "May" },
                    { value: "6", label: "June" },
                    { value: "7", label: "July" },
                    { value: "8", label: "August" },
                    { value: "8", label: "August" },
                    { value: "9", label: "September" },
                    { value: "10", label: "October" },
                    { value: "11", label: "November" },
                    { value: "12", label: "December" },
                  ]}
                  value={filters.month}
                  onChange={(value: any) => updateFilters("month", value)}
                />
              </div>
              {userLoggedInProfile?.business_type === "Vendor" && (
                <>
                  <div className="max-w-[150px] w-full">
                    <SelectInput
                      placeholder="Vendor"
                      rounded={true}
                      options={vendorOptions}
                      value={filters.vendor}
                      onChange={(value: any) => updateFilters("vendor", value)}
                    />
                  </div>{" "}
                  <div className="max-w-[150px] w-full">
                    <SelectInput
                      placeholder="Sub-Vendor"
                      rounded={true}
                      options={subVendorOptions}
                      value={filters.subvendor}
                      onChange={(value: any) =>
                        updateFilters("subvendor", value)
                      }
                    />
                  </div>
                </>
              )}

              <div className="max-w-[150px] w-full">
                <SelectInput
                  placeholder="Platform"
                  rounded={true}
                  options={[
                    { value: "GoogleDrive", label: "GoogleDrive" },
                    { value: "WeTransfer", label: "WeTransfer" },
                    { value: "OneDrive", label: "OneDrive" },
                    { value: "DropBox", label: "DropBox" },
                    { value: "PCloud", label: "PCloud" },
                  ]}
                  value={filters.platform}
                  onChange={(value: any) => updateFilters("platform", value)}
                />
              </div>
              <p
                className="cursor-pointer text-[14px] rounded-full px-[16px] py-[7px] hover:bg-orange-500 bg-[#000000] text-white inline"
                onClick={() =>
                  setFilters({
                    search: "",
                    year: "",
                    month: "",
                    vendor: "",
                    subvendor: "",
                    platform: "",
                  })
                }
              >
                Clear Filters
              </p>
            </div>
          </div>
        )}
        <div className="mt-[50px] mb-[100px]">
          <div className="grid place-items-center md:grid-cols-2 lg:grid-cols-3 gap-2 h-full mb-10">
            {content?.map((item: any, index: number) => {
              const randomColor = getRandomColor();
              return (
                <div key={index} className="group w-full">
                  <LibraryCard
                    title={`${item.folder_name}`}
                    mainIcon={item.drop_type || "N/A"}
                    userInitials={`${item.first_name.charAt(0)}${item.last_name.charAt(0)}`}
                    userFullName={`${item.first_name}  ${item.last_name}`}
                    userEmail={item.first_name}
                    userColor={"bg-blue-500"}
                    buttons={[
                      {
                        element: (
                          <div
                            className="hidden group-hover:flex bg-blue-500 rounded-full h-[50px] w-[50px] items-center justify-center cursor-pointer"
                            onClick={() => {
                              const ensureHttps = (url: any) => {
                                // Check if URL is already absolute (starts with http:// or https://)
                                if (url.match(/^https?:\/\//)) {
                                  return url;
                                }
                                return `https://${url}`;
                              };

                              window.open(ensureHttps(item.link), "_blank");
                            }}
                          >
                            <IoIosArrowRoundDown
                              className="text-[#fff]"
                              size={24}
                            />
                          </div>
                        ),
                        tooltip: "Redirect",
                      },
                      {
                        element: (
                          <button
                            disabled={deleteLoading}
                            onClick={() => {
                              setDropIdToBeDeleted(item.id);
                              setProjectPin(item.project_pin);
                              setDeleteDialog(true);
                            }}
                            className="border border-[#000] text-[#000] rounded-full h-[50px] w-[50px] flex items-center justify-center cursor-pointer"
                          >
                            <FiMinus size={14} />
                          </button>
                        ),
                        tooltip: "Remove",
                      },
                      {
                        element: (
                          <div
                            className="border border-[#000] text-[#000] rounded-full h-[50px] w-[50px] flex items-center justify-center cursor-pointer"
                            onClick={() => handleCopyLink(item.link)}
                          >
                            <LuCopy size={14} />
                          </div>
                        ),
                        tooltip: "Copy Link",
                      },
                      {
                        element: (
                          <div
                            className={`bg-blue-500 rounded-full h-[50px] w-[50px] flex items-center justify-center cursor-pointer`}
                            onClick={() => handleUserClick(item)}
                          >
                            <p className="text-[#fff] text-[16px] font-[600] tracking-[.1rem] font-Poppins ">
                              {`${item.first_name.charAt(0)}${item.last_name.charAt(0)}`}
                            </p>
                          </div>
                        ),
                        tooltip: `${item.first_name}  ${item.last_name}`,
                      },
                    ]}
                  />
                </div>
              );
            })}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
        <div
          className={`custom-dialog-overlay ${
            selectedUser
              ? "bg-black/30 backdrop-blur-md fixed inset-0 z-50"
              : "hidden"
          }`}
        >
          <Dialog
            header={
              <div className="flex items-center gap-2 tracking-[.1rem] text-[12px] text-[#7c7e81] !font-[400] relative">
                <Tooltip info="This modal contains details about the user who created the drop, including their profile information and other relevant metadata." />

                <span>INFORMATION</span>
              </div>
            }
            visible={selectedUser !== null}
            onHide={() => setSelectedUser(null)}
            breakpoints={{ "960px": "75vw", "640px": "100vw" }}
            style={{ width: "25vw" }}
            className="custom-dialog-overlay"
            headerClassName=" tracking-[.1rem] text-[12px] text-[#7c7e81] !font-[400]"
          >
            {selectedUser && (
              <div className="space-y-4 text-[#000] font-SansFlex">
                <p className="text-[30px] font-[600]">
                  {selectedUser.user.user_profile.fullname}
                </p>
                <div className="text-[16px]">
                  <p className="font-[400] text-[#7c7e81]">Email: </p>
                  <p className="font-[600]">
                    {selectedUser.user.user_profile.staff_email}
                  </p>
                </div>
                <div className="text-[16px]">
                  <p className="font-[400] text-[#7c7e81]">Role</p>
                  <p className="font-[600] text-[#01a733]">
                    {selectedUser.user.user_profile.role}
                  </p>
                </div>
                <div className="text-[16px]">
                  <p className="font-[400] text-[#7c7e81]">Project</p>
                  <p
                    className="font-[600] cursor-pointer"
                    onClick={() => {
                      const baseDomain = window.location.origin;

                      const campaignUrl = `${baseDomain}/campaigns/${selectedUser.project}`;
                      // Open the URL in a new tab
                      window.open(campaignUrl, "_blank");
                    }}
                  >
                    {selectedUser.project_title}
                  </p>
                </div>
                <div className="text-[16px]">
                  <p className="font-[400] text-[#7c7e81]">Member since</p>
                  <p className="font-[600]">
                    {format(parseISO(selectedUser.user.created), "dd MMM yyyy")}
                  </p>
                </div>
                <div className="text-[16px]">
                  <p className="font-[400] text-[#7c7e81]">Last login</p>
                  <p className="font-[600]">
                    {format(
                      parseISO(selectedUser.user.last_login),
                      "dd MMM yyyy",
                    )}
                  </p>
                </div>
              </div>
            )}
          </Dialog>
          <Dialog
            header={
              <div className="flex items-center gap-2 tracking-[.1rem] text-[12px] text-[#7c7e81] !font-[400] relative">
                <Tooltip info="Delete the dropzone selected" />
                <span>DELETE DROP</span>
              </div>
            }
            visible={deleteDialog !== false}
            onHide={() => setDeleteDialog(false)}
            breakpoints={{ "960px": "75vw", "640px": "100vw" }}
            style={{ width: "25vw" }}
            className="custom-dialog-overlay"
            headerClassName=" tracking-[.1rem] text-[12px] text-[#7c7e81] !font-[400]"
          >
            <input
              type="password"
              name="projectPin"
              autoComplete="new-password"
              className={cn(
                "mt-1 block w-full border font-SansFlex border-black bg-white px-4 py-[8px] h-[50px] text-[14px] placeholder:text-[14px] font-[400] text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-[8px]",
                pinError && "border-red-500 focus:ring-red-500",
              )}
              placeholder={"Enter Pin"}
              value={pinEntered}
              onChange={(e) => {
                const newPin = e.target.value;
                setPinEntered(newPin);
                if (newPin.length >= 6) {
                  setPinError(newPin !== projectPin);
                } else {
                  setPinError(false);
                }
              }}
            />
            {pinError && (
              <span className="text-red-500 text-sm mt-1">
                Wrong password entered
              </span>
            )}

            <div className="flex gap-5 items-center mt-5">
              <Button
                label="Cancel"
                className="rounded-full"
                onClick={() => setDeleteDialog(false)}
              />
              <Button
                disabled={pinEntered.length < 6 || pinError}
                label="Delete Drop"
                className={`bg-red-600 ${pinEntered.length < 6 || pinError ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => handleDelete(dropIdToBeDeleted)}
              />
            </div>
          </Dialog>
        </div>
      </DashboardLayout>
    </>
  );
};

export default AssetsLibrary;
