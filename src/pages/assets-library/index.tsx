import React, { useEffect, useState } from "react";
import DashboardLayout from "../dashboard/layout";
import { HiOutlineCube } from "react-icons/hi";
import { IoFilter } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { SelectInput } from "@/components/ui/selectinput";
import { FaGoogleDrive, FaRegCopy } from "react-icons/fa";
import { IoIosArrowRoundDown } from "react-icons/io";
import { FiMinus } from "react-icons/fi";
import LibraryCard from "./component/LibraryCard";
import { Dialog } from "primereact/dialog";

const users = [
  { initials: "JJ", fullName: "John Jerome", email: "john@example.com" },
  { initials: "EO", fullName: "Emily O'Connor", email: "emily@example.com" },
  { initials: "MD", fullName: "Michael Douglas", email: "michael@example.com" },
  { initials: "SO", fullName: "Sarah O'Neil", email: "sarah@example.com" },
];

const userColors = [
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
  fullName: string;
  email: string;
}

const AssetsLibrary = () => {
  const [filter, setFilter] = useState<boolean>(false);

  useEffect(() => {
    setFilter(false);
  }, []);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center gap-[10px]">
        <HiOutlineCube className="text-[#7e7e7e]" size={24} />
        <p className="font-[600] text-[24px]">Asset Library</p>
      </div>
      <div className="flex-grow">
        <div className="flex items-center justify-end gap-[10px]">
          <div className="flex-grow">
            <Input
              type="text"
              placeholder="Search by title, label and artist..."
              className="w-full rounded-full font-IBM placeholder:font-IBM text-[17px] placeholder:text-[17px]"
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
                  { value: "2024", label: "2024" },
                  { value: "2023", label: "2023" },
                ]}
              />
            </div>
            <div className="max-w-[150px] w-full rounded-full">
              <SelectInput
                placeholder="Month"
                rounded={true}
                options={[
                  { value: "january", label: "January" },
                  { value: "february", label: "February" },
                ]}
              />
            </div>
            <div className="max-w-[150px] w-full">
              <SelectInput
                placeholder="Vendor"
                rounded={true}
                options={[{ value: "naville", label: "NAVILLE" }]}
              />
            </div>
            <div className="max-w-[150px] w-full">
              <SelectInput
                placeholder="Sub-Vendor"
                rounded={true}
                options={[{ value: "naville", label: "NAVILLE" }]}
              />
            </div>
            <div className="max-w-[150px] w-full">
              <SelectInput
                placeholder="Platform"
                rounded={true}
                options={[{ value: "naville", label: "NAVILLE" }]}
              />
            </div>
          </div>

          <p className="cursor-pointer text-[14px] rounded-full px-[16px] py-[4px] hover:bg-orange-500 bg-[#000000] text-white inline">
            Clear Filters
          </p>
        </div>
      )}
      <div className="mt-[20px]">
        <div className="flex flex-wrap gap-4 h-full">
          {users.map((user, index) => (
            <LibraryCard
              key={user.email}
              title={`Asset by ${user.fullName}`}
              mainIcon={<FaGoogleDrive className="text-[#cbcbcb]" size={14} />}
              userInitials={user.initials}
              userFullName={user.fullName}
              userEmail={user.email}
              userColor={userColors[index % userColors.length]}
              buttons={[
                {
                  element: (
                    <div className="bg-blue-500 rounded-full h-[50px] w-[50px] flex items-center justify-center cursor-pointer">
                      <IoIosArrowRoundDown className="text-[#fff]" size={24} />
                    </div>
                  ),
                  tooltip: "Download",
                },
                {
                  element: (
                    <div className="border border-[#000] text-[#000] rounded-full h-[50px] w-[50px] flex items-center justify-center cursor-pointer">
                      <FiMinus size={14} />
                    </div>
                  ),
                  tooltip: "Remove",
                },
                {
                  element: (
                    <div className="border border-[#000] text-[#000] rounded-full h-[50px] w-[50px] flex items-center justify-center cursor-pointer">
                      <FaRegCopy size={14} />
                    </div>
                  ),
                  tooltip: "Copy Link",
                },
                {
                  element: (
                    <div className="bg-blue-500 rounded-full h-[50px] w-[50px] flex items-center justify-center cursor-pointer">
                      <p
                        className="text-[#fff] text-[16px] font-[600]"
                        onClick={() => handleUserClick(user)}
                      >
                        {user.initials}
                      </p>
                    </div>
                  ),
                  tooltip: user.fullName,
                },
              ]}
            />
          ))}
        </div>
      </div>
      <div
        className={`custom-dialog-overlay ${
          selectedUser
            ? "bg-black/30 backdrop-blur-md fixed inset-0 z-50"
            : "hidden"
        }`}
      >
        <Dialog
          header=" Information"
          visible={selectedUser !== null}
          onHide={() => setSelectedUser(null)}
          breakpoints={{ "960px": "75vw", "640px": "100vw" }}
          style={{ width: "30vw" }}
          className="custom-dialog-overlay"
        >
          {selectedUser && (
            <div className="space-y-4 text-[#000]">
              <p className="text-3xl font-bold">{selectedUser.fullName}</p>
              <div className=" text-[14px]">
                <p className="text-[14px]">Email: </p>
                <p className=" font-bold"> {selectedUser.email}</p>
              </div>
              <div className=" text-[14px]">
                <p className="text-[14px]">Role </p>
                <p className=" font-bold">Agent</p>
              </div>
              <div className=" text-[14px]">
                <p className="text-[14px]">Project </p>
                <p className=" font-bold">Jolie </p>
              </div>
              <div className=" text-[14px]">
                <p className="text-[14px]">Member since </p>
                <p className=" font-bold">July 20, 2021</p>
              </div>
              <div className=" text-[14px]">
                <p className="text-[14px]">Last login</p>
                <p className=" font-bold">May 2, 2024</p>
              </div>
            </div>
          )}
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AssetsLibrary;
