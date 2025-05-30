import React, { useEffect, useState } from "react";
import Table from "./Table";
import { IoIosAddCircle, IoMdCheckmark } from "react-icons/io";
import Modal from "@/pages/component/Modal";
import { LuUserMinus } from "react-icons/lu";
import { getBusiness } from "@/services/api";
import { StaffItem } from "@/types/contents";

const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<StaffItem | null>(null);
  const [content, setContent] = useState<StaffItem[] | null>(null);

  const headers = ["Name", "Vendor", "User", "Role", "Status"];

  useEffect(() => {
    getBusiness().then((fetchedContent) => {
      setContent(fetchedContent);
    });
  }, []);

  useEffect(() => {
    if (selectedUser) {
      console.log("Selected User:", selectedUser);
    }
  }, [selectedUser]);

  const colorPalette = [
    "bg-blue-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-purple-500",
  ];

  const rows = content
    ?.slice()
    .reverse()
    .map((item, index) => ({
      data: [
        {
          content: (
            <div
              key={`action-buttons-${item.id}`}
              className="flex justify-center"
            >
              <div
                className={` font-Poppins  tracking-[.1rem]  font-[700]  text-[12px] cursor-pointer w-[48px] h-[48px] flex items-center justify-center p-[16px] text-white border-[#ffffff] rounded-full ${
                  colorPalette[index % colorPalette.length]
                }`}
                onClick={() => {
                  setSelectedUser(item);
                  setIsModalOpen(true);
                }}
              >
                {item?.staff?.[0]?.fullname?.slice(0, 2).toUpperCase() || "-"}
              </div>
            </div>
          ),
        },
        { content: item.type || " " },
        { content: item?.staff[0]?.fullname || "-" },
        { content: item.staff[0]?.role || " " },
        {
          content: (
            <div
              key={`status-${item.id}`}
              className="flex justify-center gap-2"
            >
              <div className="p-[16px] text-green-500 rounded-full">Active</div>
            </div>
          ),
        },
      ],
    }));

  return (
    <>
      <div className="">
        <Table
          headers={headers}
          rows={rows}
          emptyState={
            <div className="flex h-[50vh] flex-col items-center justify-center text-center">
              <div className="my-[32px]">
                <p className="text-[20px] font-[600] text-grey-400">No Data</p>
              </div>
            </div>
          }
        />
      </div>

      {selectedUser && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          maxWidth="max-w-[300px]"
        >
          <p className="text-[#7c7e81] text-[14px] uppercase font-IBM">
            Member Information
          </p>
          <div className="space-y-[20px] my-[20px]">
            <p className="text-2xl font-bold font-IBM">
              {selectedUser.staff[0].fullname}
            </p>
            <div className="space-y-[10px] font-IBM">
              <div>
                <p className="text-[#818486]">Email</p>
                <p>{selectedUser.staff[0].staff_email || " "}</p>
              </div>
              <div>
                <p className="text-[#818486]">Role</p>
                <p className="text-[#5117ec] font-[600]">
                  {selectedUser.staff[0].role || " "}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="mt-4 px-4 py-2 text-white bg-[#000] rounded-full hover:bg-red-600"
          >
            <LuUserMinus size={14} />
          </button>
        </Modal>
      )}
    </>
  );
};

export default Users;
