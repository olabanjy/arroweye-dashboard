import React, { useEffect, useState } from "react";
import Image from "next/image";
import Table from "./Table";
import { BsCurrencyDollar } from "react-icons/bs";
import { getInvoice } from "@/services/api";
import { ContentItem } from "@/types/contents";

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

  const [content, setContent] = useState<ContentItem[] | null>(null);
  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "Dollars":
        return "$";
      case "Naira":
        return "₦";
      case "Ethereum":
        return "Ξ";
      default:
        return "";
    }
  };

  useEffect(() => {
    getInvoice().then((fetchedContent) => {
      setContent(fetchedContent);
    });
  }, []);

  const rows =
    content?.map((item, index) => ({
      data: [
        item.project.title,
        item.project.code,
        item.po_code,
        item.project.vendor,
        item.project.subvendor,
        item.createdAt,
        `${getCurrencySymbol(item.currency)}${item.total}`,
        item.status,
        <div
          key={`action-buttons-${index}`}
          className="flex justify-center gap-2"
        >
          <div className="p-[16px] hover:bg-orange-500 bg-[#000000] text-[#ffffff] rounded-full">
            <BsCurrencyDollar />
          </div>
        </div>,
      ],
    })) || [];

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
              <p className="text-[20px] font-[600] text-grey-400">No Data</p>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default Invoice;
