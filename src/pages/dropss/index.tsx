"use client";
import React, { useState } from "react";
import DropsList from "./component/DropsList";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Tooltip } from "../drops";

const users = [
  { initials: "JJ", fullName: "John Jerome", email: "john@example.com" },
  { initials: "EO", fullName: "Emily O'Connor", email: "emily@example.com" },
  { initials: "MD", fullName: "Michael Douglas", email: "michael@example.com" },
  { initials: "SO", fullName: "Sarah O'Neil", email: "sarah@example.com" },
];

interface User {
  initials: string;
  fullName: string;
  email: string;
}

const Drops = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const predefinedColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-gray-500",
  ];

  return (
    <div className="">
      <div className=" max-w-5xl mx-auto px-[20px] my-[50px] space-y-[20px]">
        <div className="text-[#919393] flex items-center gap-[10px] text-[0.875rem]">
          <p className="text-[#5e5e5e] tracking-[.1rem]">KHAID</p>
          <p className="p-[4px] border border-[#d5d9db] bg-[#f7fcff] rounded tracking-[.1rem]">
            NEVILLE RECORDS
          </p>
        </div>
        <div className=" grid gap-[20px] md:flex items-end md:justify-between">
          <div>
            <p className="font-extrabold text-5xl text-[#000000]">Jolie</p>
            <div className="mt-[20px] flex items-center gap-[5px] relative">
              {users.map((user, index) => (
                <div key={index} className="relative group">
                  <p
                    className={`${predefinedColors[index % predefinedColors.length]} tracking-[.1rem] text-[12px] font-[700] font-Poppins text-white rounded-full p-4 w-[50px] h-[50px] flex items-center justify-center text-center cursor-pointer`}
                    onClick={() => handleUserClick(user)}
                  >
                    {user.initials}
                  </p>

                  <div className="font-IBM absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 bg-black text-white text-xs  px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 text-nowrap">
                    {user.fullName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DropsList />
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

              <span>MEMBER INFORMATION</span>
            </div>
          }
          visible={selectedUser !== null}
          onHide={() => setSelectedUser(null)}
          breakpoints={{ "960px": "75vw", "640px": "100vw" }}
          style={{ width: "30vw" }}
          headerClassName=" text-[12px] text-[#7c7e81] font-[500]"
          className="custom-dialog-overlay"
        >
          {selectedUser && (
            <div className="space-y-4 font-IBM">
              <p className="text-[30px] text-[#212529] font-[600]">
                {selectedUser.fullName}
              </p>
              <div className=" ">
                <p className="text-[16px] font-[400] text-[#7c7e81]">Email </p>
                <p className=" font-[600] text-[16px] text-[#212529]">
                  {" "}
                  {selectedUser.email}
                </p>
              </div>
              <div className=" text-[16px] font-[400] ">
                <p className="text-[#7c7e81]">Role </p>
                <p className=" text-[#01a733] font-[600]">Agent</p>
              </div>
              <div className=" text-[16px] font-[400] text-[#212529]">
                <p className=" text-[#7c7e81]">Member since </p>
                <p className=" font-[600]">July 20, 2021</p>
              </div>
              <div className=" text-[16px] font-[400] text-[#212529]">
                <p className="text-[#7c7e81]">Last Login</p>
                <p className=" font-[600]">May 2, 2024</p>
              </div>

              <div className=" hidden">
                <div className="flex justify-end space-x-2">
                  <Button
                    label="Close"
                    icon="pi pi-times"
                    className="rounded-full"
                    onClick={() => setSelectedUser(null)}
                  />
                </div>
              </div>
            </div>
          )}
        </Dialog>
      </div>
    </div>
  );
};

export default Drops;
