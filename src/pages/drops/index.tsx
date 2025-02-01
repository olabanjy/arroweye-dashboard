import React, { useEffect, useState } from "react";
import DashboardLayout from "../dashboard/layout";
import { HiOutlineCube } from "react-icons/hi";
import { IoFilter } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { SelectInput } from "@/components/ui/selectinput";
import { FaGoogleDrive } from "react-icons/fa";
import { IoIosArrowRoundDown } from "react-icons/io";
import { FiInfo, FiMinus } from "react-icons/fi";
import LibraryCard from "./component/LibraryCard";
import { Dialog } from "primereact/dialog";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LuCopy } from "react-icons/lu";

const users = [
  {
    initials: "JJ",
    fullName: "John Jerome Video",
    email: "john@example.com",
    link: "https://example.com/john",
    uploader: "John Jerome",
  },
  {
    initials: "EO",
    fullName: "Emily O'Connor Video",
    email: "emily@example.com",
    link: "https://example.com/emily",
    uploader: "Emily O'Connor",
  },
  {
    initials: "MD",
    fullName: "Michael Douglas Video",
    email: "michael@example.com",
    link: "https://example.com/michael",
    uploader: "Michael Douglas",
  },
  {
    initials: "SO",
    fullName: "Sarah O'Neil Video",
    email: "sarah@example.com",
    link: "https://example.com/sarah",
    uploader: "Sarah O'Neil",
  },
];

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
  fullName: string;
  email: string;
  uploader: string;
}

export const Tooltip = ({ info }: { info: string }) => (
  <div className="relative group flex items-center">
    <FiInfo className="text-gray-400 hover:text-blue-500 cursor-pointer" />
    <div className="absolute left-full ml-2 hidden w-56 p-2 text-xs text-white bg-black rounded-lg group-hover:block z-50 shadow-lg">
      {info}
    </div>
  </div>
);

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const AssetsLibrary = () => {
  const [filter, setFilter] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    setFilter(false);
  }, []);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link).then(() => {
      toast.success("Link has been copied!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    });
  };

  return (
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
            <p className="cursor-pointer text-[14px] rounded-full px-[16px] py-[7px] hover:bg-orange-500 bg-[#000000] text-white inline">
              Clear Filters
            </p>
          </div>
        </div>
      )}
      <div className="mt-[50px] mb-[100px]">
        <div className=" grid place-items-center md:grid-cols-2 lg:grid-cols-3 gap-2 h-full ">
          {users.map((user) => {
            const randomColor = getRandomColor();
            return (
              <div key={user.email} className="group w-full">
                <LibraryCard
                  title={`${user.fullName}`}
                  mainIcon={
                    <FaGoogleDrive className="text-[#cbcbcb]" size={14} />
                  }
                  userInitials={user.initials}
                  userFullName={user.fullName}
                  userEmail={user.email}
                  userColor={randomColor}
                  buttons={[
                    {
                      element: (
                        <div className="hidden group-hover:flex bg-blue-500 rounded-full h-[50px] w-[50px] items-center justify-center cursor-pointer">
                          <IoIosArrowRoundDown
                            className="text-[#fff]"
                            size={24}
                          />
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
                        <div
                          className="border border-[#000] text-[#000] rounded-full h-[50px] w-[50px] flex items-center justify-center cursor-pointer"
                          onClick={() => handleCopyLink(user.link)}
                        >
                          <LuCopy size={14} />
                        </div>
                      ),
                      tooltip: "Copy Link",
                    },
                    {
                      element: (
                        <div
                          className={`${randomColor} rounded-full h-[50px] w-[50px] flex items-center justify-center cursor-pointer font-Poppins`}
                          onClick={() => handleUserClick(user)}
                        >
                          <p className="text-[#fff] text-[16px] font-[600] tracking-[.1rem] ">
                            {user.initials}
                          </p>
                        </div>
                      ),
                      tooltip: user.fullName,
                    },
                  ]}
                />
              </div>
            );
          })}
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
          header={
            <div className="flex items-center gap-2 tracking-[.1rem] text-[12px] text-[#7c7e81] !font-[400] relative">
              <Tooltip info="The total revenue is the overall amount of money generated from the sale of goods or services before any expenses are deducted." />

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
            <div className="space-y-4 text-[#000] font-IBM">
              <p className="text-[30px] font-[600]">{selectedUser.uploader}</p>
              <div className="text-[16px]">
                <p className="font-[400] text-[#7c7e81]">Email: </p>
                <p className="font-[600]">{selectedUser.email}</p>
              </div>
              <div className="text-[16px]">
                <p className="font-[400] text-[#7c7e81]">Role</p>
                <p className="font-[600] text-[#01a733]">Agent</p>
              </div>
              <div className="text-[16px]">
                <p className="font-[400] text-[#7c7e81]">Project</p>
                <p className="font-[600]">Jolie</p>
              </div>
              <div className="text-[16px]">
                <p className="font-[400] text-[#7c7e81]">Member since</p>
                <p className="font-[600]">July 20, 2021</p>
              </div>
              <div className="text-[16px]">
                <p className="font-[400] text-[#7c7e81]">Last login</p>
                <p className="font-[600]">May 2, 2024</p>
              </div>
            </div>
          )}
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AssetsLibrary;
