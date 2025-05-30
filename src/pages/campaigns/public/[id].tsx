import React, { useState } from "react";
import DashboardLayout from "../../dashboard/layout";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import InsightChart from "../component/InsightChart";
import Moments from "./component/Moments";
import { Tooltip } from "@/pages/drops";

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

const ProjectDetailsPublic = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <DashboardLayout>
      <div className="space-y-[20px]">
        <div className="text-[#919393] flex items-center gap-[10px]">
          <p className="text-[#5e5e5e] text-[0.875rem]">KHAID</p>
          <p className="p-[4px] border border-[#d5d9db] bg-[#f7fcff] rounded">
            NEVILLE RECORDS
          </p>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="font-extrabold text-5xl text-[#000000]">Jolie</p>
            <div className="mt-[20px] flex items-center gap-[10px]">
              {users.map((user, index) => (
                <div key={index} className="relative group">
                  <p
                    className=" font-IBM bg-red-500 text-white rounded-full p-4 w-[50px] h-[50px] flex items-center justify-center text-center cursor-pointer"
                    onClick={() => handleUserClick(user)}
                  >
                    {user.initials}
                  </p>
                  <div className="absolute bottom-[-30px] left-0 bg-black text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity font-IBM">
                    {user.fullName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className=" ">
          <InsightChart />
          <Moments />
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

              <span>MEMBER INFORMATION</span>
            </div>
          }
          visible={selectedUser !== null}
          onHide={() => setSelectedUser(null)}
          breakpoints={{ "960px": "75vw", "640px": "100vw" }}
          style={{ width: "30vw" }}
          className="custom-dialog-overlay"
        >
          {selectedUser && (
            <div className="space-y-4">
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
                <p className="text-[14px]">Member since </p>
                <p className=" font-bold">July 20, 2021</p>
              </div>
              <div className=" text-[14px]">
                <p className="text-[14px]">Last login</p>
                <p className=" font-bold">May 2, 2024</p>
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
    </DashboardLayout>
  );
};

export default ProjectDetailsPublic;
