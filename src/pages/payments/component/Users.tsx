import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Table from "./Table";
import { IoIosAddCircle, IoMdCheckmark } from "react-icons/io";
import Modal from "@/pages/component/Modal";
import { LuUserMinus } from "react-icons/lu";

const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const headers = ["Name", "Vendor", "User", "Role", "Status"];

  const rows = [
    {
      data: [
        <div key="action-buttons-1" className="flex justify-center ">
          <div
            className=" cursor-pointer w-[48px] h-[48px] flex items-center justify-center p-[16px] hover:bg-green-500 hover:text-white border border-green-500 text-green-500 rounded-full"
            onClick={() => setIsModalOpen(true)}
          >
            JP
          </div>
        </div>,
        "Lex Luthor Limited",
        "	John Packson",
        "Lead Admin",

        <div key="action-buttons-1" className="flex justify-center gap-2">
          <div className="p-[16px] hover:bg-green-500 hover:text-white border border-green-500 text-green-500 rounded-full">
            <IoMdCheckmark size={20} />
          </div>
        </div>,
      ],
    },
  ];

  return (
    <>
      <div className="rounded-[16px] border bg-grey-25 p-[16px]">
        <Table
          headers={headers}
          rows={rows}
          emptyState={
            <div className="flex h-[50vh] flex-col items-center justify-center text-center">
              <Image
                src="/product/emptyState.svg"
                width={100}
                height={100}
                alt="empty state"
              />
              <div className="my-[32px]">
                <p className="text-[20px] font-[600] text-grey-400">
                  You have not created any Product
                </p>

                <p className="text-[16px] font-[400] text-grey-400">
                  Start your selling journey by creating your first product
                </p>
              </div>

              <Link href="/products/add-product">
                <Button label="Add Product" />
              </Link>
            </div>
          }
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth=" max-w-[300px]"
      >
        <p className="text-[#7c7e81] text-[14px] uppercase">
          Member Information
        </p>
        <div className=" space-y-[20px] my-[20px]">
          <p className=" text-2xl font-bold"> John Packson</p>
          <div className=" space-y-[10px]">
            <div className="">
              <p className=" text-[#818486]">Email</p>
              <p>john@example.com</p>
            </div>
            <div className="">
              <p className=" text-[#818486]">Role</p>
              <p className=" text-[#5117ec] font-[600]">Lead Admin</p>
            </div>

            <div className="">
              <p className=" text-[#818486]">Vendor</p>
              <p className=" text-[#000000] font-[600]">Lex Luthor Limited</p>
            </div>

            <div className="">
              <p className=" text-[#818486]">Licence/s</p>
              <p className=" text-[#000000] font-[600] flex items-center gap-[5px]">
                1{" "}
                <span>
                  <IoIosAddCircle className="" size={35} />
                </span>
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(false)}
          className="mt-4 px-4 py-2 text-white bg-[#000] rounded hover:bg-red-600"
        >
          <LuUserMinus size={14} />
        </button>
      </Modal>
    </>
  );
};

export default Users;
