"use client";

import Head from "next/head";
import { format, parseISO } from "date-fns";
import { FiInfo, FiMinus } from "react-icons/fi";
import { HiOutlineCube } from "react-icons/hi";
import { IoFilter } from "react-icons/io5";
import { IoIosArrowRoundDown } from "react-icons/io";
import { LuCopy } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDrops } from "../../../hooks/use-drops";
import LibraryCard from "./component/library-card";
import Pagination from "./component/pagination";

type SelectOption = {
  label: string;
  value: string | number;
};

const emptyFilters = {
  search: "",
  year: "",
  month: "",
  vendor: "",
  subvendor: "",
  platform: "",
};

const yearOptions: SelectOption[] = [
  { value: "2025", label: "2025" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
];

const monthOptions: SelectOption[] = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const platformOptions: SelectOption[] = [
  { value: "GoogleDrive", label: "GoogleDrive" },
  { value: "WeTransfer", label: "WeTransfer" },
  { value: "OneDrive", label: "OneDrive" },
  { value: "DropBox", label: "DropBox" },
  { value: "PCloud", label: "PCloud" },
];

const ensureHttps = (url: string) => {
  if (url.match(/^https?:\/\//)) {
    return url;
  }

  return `https://${url}`;
};

const InfoTooltip = ({ info }: { info: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        type="button"
        className="inline-flex text-muted-foreground transition-colors hover:text-primary"
      >
        <FiInfo />
        <span className="sr-only">More information</span>
      </button>
    </TooltipTrigger>
    <TooltipContent side="right" className="max-w-60">
      {info}
    </TooltipContent>
  </Tooltip>
);

const FilterSelect = ({
  placeholder,
  options,
  value,
  onChange,
}: {
  placeholder: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
}) => (
  <Select value={value || undefined} onValueChange={onChange}>
    <SelectTrigger className="h-[42px] rounded-full border-border bg-background text-primary shadow-none">
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      {options.map((option) => (
        <SelectItem
          key={`${placeholder}-${option.value}`}
          value={String(option.value)}
        >
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

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
      <div className="flex items-center gap-[10px]">
        <HiOutlineCube className="text-primary" size={24} />
        <p className="text-[30px] text-primary">Asset Library</p>
      </div>
      <div className="mt-12.5 grow">
        <div className="flex items-center justify-end gap-2.5">
          <div className="grow">
            <Input
              type="text"
              placeholder="Search..."
              className="h-12 w-full rounded-full border-border bg-background text-[17px] text-foreground placeholder:text-[17px]"
              value={filters.search}
              onChange={(e) => updateFilters("search", e.target.value)}
            />
          </div>
          <Button
            type="button"
            size="icon-lg"
            aria-label={filter ? "Hide filters" : "Show filters"}
            className="size-12 rounded-full"
            onClick={() => setFilter(!filter)}
          >
            <IoFilter />
          </Button>
        </div>
      </div>
      {filter && (
        <div className="my-2.5">
          <div className="mb-5 flex flex-wrap items-center gap-2.5">
            <div className="w-full max-w-[150px]">
              <FilterSelect
                placeholder="Year"
                options={yearOptions}
                value={filters.year}
                onChange={(value) => updateFilters("year", value)}
              />
            </div>
            <div className="w-full max-w-[150px]">
              <FilterSelect
                placeholder="Month"
                options={monthOptions}
                value={filters.month}
                onChange={(value) => updateFilters("month", value)}
              />
            </div>
            {userLoggedInProfile?.business_type === "Vendor" && (
              <>
                <div className="w-full max-w-[150px]">
                  <FilterSelect
                    placeholder="Vendor"
                    options={vendorOptions}
                    value={filters.vendor}
                    onChange={(value) => updateFilters("vendor", value)}
                  />
                </div>
                <div className="w-full max-w-[150px]">
                  <FilterSelect
                    placeholder="Sub-Vendor"
                    options={subVendorOptions}
                    value={filters.subvendor}
                    onChange={(value) => updateFilters("subvendor", value)}
                  />
                </div>
              </>
            )}
            <div className="w-full max-w-[150px]">
              <FilterSelect
                placeholder="Platform"
                options={platformOptions}
                value={filters.platform}
                onChange={(value) => updateFilters("platform", value)}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-[42px] rounded-full px-4"
              onClick={() => setFilters(emptyFilters)}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}
      <div className="mb-[100px] mt-[50px]">
        <div className="mb-10 grid h-full place-items-center gap-2 md:grid-cols-2 lg:grid-cols-3">
          {content?.map((item: any, index: number) => (
            <div key={index} className="group w-full">
              <LibraryCard
                title={`${item.folder_name}`}
                mainIcon={item.drop_type || "N/A"}
                userInitials={`${item.first_name.charAt(0)}${item.last_name.charAt(0)}`}
                userFullName={`${item.first_name}  ${item.last_name}`}
                userEmail={item.first_name}
                userColor="bg-blue-500"
                buttons={[
                  {
                    element: (
                      <Button
                        type="button"
                        size="icon-lg"
                        aria-label="Open drop link"
                        className="hidden size-[50px] rounded-full bg-blue-500 text-white hover:bg-blue-600 group-hover:inline-flex"
                        onClick={() =>
                          window.open(ensureHttps(item.link), "_blank")
                        }
                      >
                        <IoIosArrowRoundDown size={24} />
                      </Button>
                    ),
                    tooltip: "Download",
                  },
                  {
                    element: (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-lg"
                        aria-label="Remove drop"
                        disabled={deleteLoading}
                        className="size-[50px] rounded-full"
                        onClick={() => {
                          setDropIdToBeDeleted(item.id);
                          setProjectPin(item.project_pin);
                          setDeleteDialog(true);
                        }}
                      >
                        <FiMinus size={14} />
                      </Button>
                    ),
                    tooltip: "Delete Drop",
                  },
                  {
                    element: (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-lg"
                        aria-label="Copy drop link"
                        className="size-[50px] rounded-full"
                        onClick={() => handleCopyLink(item.link)}
                      >
                        <LuCopy size={14} />
                      </Button>
                    ),
                    tooltip: "Copy Link",
                  },
                  {
                    element: (
                      <Button
                        type="button"
                        size="icon-lg"
                        aria-label={`View ${item.first_name} ${item.last_name}`}
                        className="size-[50px] rounded-full bg-blue-500 text-white hover:bg-blue-600"
                        onClick={() => handleUserClick(item)}
                      >
                        <span className="font-Poppins text-[16px] font-[600] tracking-[.1rem]">
                          {`${item.first_name.charAt(0)}${item.last_name.charAt(0)}`}
                        </span>
                      </Button>
                    ),
                    tooltip: `${item.first_name}  ${item.last_name}`,
                  },
                ]}
              />
            </div>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      <Dialog
        open={selectedUser !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedUser(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <InfoTooltip info="This modal contains details about the user who created the drop, including their profile information and other relevant metadata." />
              <DialogTitle className="text-[12px] font-[400] uppercase tracking-[.1rem] text-muted-foreground">
                Information
              </DialogTitle>
            </div>
            <DialogDescription className="sr-only">
              Details about the user who created this drop.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 font-SansFlex text-foreground">
              <p className="text-[30px] font-[600]">
                {selectedUser.user.user_profile.fullname}
              </p>
              <div className="text-[16px]">
                <p className="font-[400] text-muted-foreground">Email:</p>
                <p className="font-[600]">
                  {selectedUser.user.user_profile.staff_email}
                </p>
              </div>
              <div className="text-[16px]">
                <p className="font-[400] text-muted-foreground">Role</p>
                <p className="font-[600] text-[#01a733]">
                  {selectedUser.user.user_profile.role}
                </p>
              </div>
              <div className="text-[16px]">
                <p className="font-[400] text-muted-foreground">Project</p>
                <button
                  type="button"
                  className="text-left font-[600] text-primary underline-offset-4 hover:underline"
                  onClick={() => {
                    const campaignUrl = `${window.location.origin}/campaigns/${selectedUser.project}`;
                    window.open(campaignUrl, "_blank");
                  }}
                >
                  {selectedUser.project_title}
                </button>
              </div>
              <div className="text-[16px]">
                <p className="font-[400] text-muted-foreground">Member since</p>
                <p className="font-[600]">
                  {format(parseISO(selectedUser.user.created), "dd MMM yyyy")}
                </p>
              </div>
              <div className="text-[16px]">
                <p className="font-[400] text-muted-foreground">Last login</p>
                <p className="font-[600]">
                  {format(
                    parseISO(selectedUser.user.last_login),
                    "dd MMM yyyy",
                  )}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={deleteDialog !== false}
        onOpenChange={(open) => {
          if (!open) setDeleteDialog(false);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <InfoTooltip info="Delete the dropzone selected" />
              <DialogTitle className="text-[12px] font-[400] uppercase tracking-[.1rem] text-muted-foreground">
                Delete Drop
              </DialogTitle>
            </div>
            <DialogDescription className="sr-only">
              Confirm the project pin before deleting this drop.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="password"
            name="projectPin"
            autoComplete="new-password"
            className="h-[50px] border-border bg-transparent text-foreground"
            placeholder="Enter Pin"
            value={pinEntered}
            error={pinError ? "Wrong password entered" : undefined}
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
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => setDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={pinEntered.length < 6 || pinError}
              className="rounded-full bg-red-600 text-white hover:bg-red-700"
              onClick={() => handleDelete(dropIdToBeDeleted)}
            >
              Delete Drop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssetsLibrary;
