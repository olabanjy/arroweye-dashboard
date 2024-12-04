import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Table from "./Table";
import { BsCurrencyDollar } from "react-icons/bs";

const Invoice = () => {
  const headers = [
    "Project",
    "Code",
    "P.O Code",
    "Vendor",
    "Subvendor",
    "Date",
    "Total",
    "Status",
    "Action",
  ];

  const rows = [
    {
      data: [
        "Johnson EP",
        "98897",
        "099099",
        "Cult Wife Inc",
        "	Neville Records",
        "21/06/2024",
        "$36750.00",
        "Unpaid",

        <div key="action-buttons-1" className="flex justify-center gap-2">
          <div className="p-[16px] hover:bg-orange-500 bg-[#000000] text-[#ffffff] rounded-full">
            <BsCurrencyDollar />
          </div>
        </div>,
      ],
    },
  ];

  return (
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
  );
};

export default Invoice;
