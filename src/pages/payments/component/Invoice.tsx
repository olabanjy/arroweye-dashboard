import React, { useEffect, useState } from "react";
import Table from "./Table";
import { BsTrash } from "react-icons/bs";
import { TbCurrencyDollar } from "react-icons/tb";
import { getInvoice } from "@/services/api";
import { ContentItem } from "@/types/contents";
import Link from "next/link";

const Invoice = () => {
  const headers = [
    <div key="project-header" className=" text-start">
      {" "}
      Campaign
    </div>,
    // <div key="project-Code" className=" text-start">
    //   {" "}
    //   Code
    // </div>,
    <div key="project-PoCode" className=" text-start">
      {" "}
      P.O Code
    </div>,
    <div key="project-Label" className=" text-start">
      {" "}
      Label
    </div>,
    <div key="project-Artist" className=" text-start">
      {" "}
      Artist
    </div>,
    <div key="project-date" className=" text-start">
      {" "}
      Date
    </div>,
    <div key="project-Total" className=" text-start">
      {" "}
      Total
    </div>,
    <div key="project-Status" className=" text-center">
      {" "}
      Status
    </div>,
    <div key="project-Action" className=" text-center">
      {" "}
      Action
    </div>,
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

  const toggleStatus = (id: unknown) => {
    setContent(
      (prevContent) =>
        prevContent?.map((item) =>
          item.id === id
            ? {
                ...item,
                status: item.status === "Unpaid" ? "Paid" : "Unpaid",
              }
            : item
        ) || []
    );
  };

  const rows =
    content
      ?.slice()
      .reverse()
      .map((item, index) => ({
        data: [
          {
            content: (
              <div key={`manage-button-${index}`} className=" text-start">
                <Link href={`/payments/${item.id}`}>
                  {item?.project?.title}
                </Link>
              </div>
            ),
            className: "bg-[#2ea879] text-white text-center ",
          },
          // { content: item?.project?.code },
          { content: <div className=" text-start">{item?.po_code} </div> },
          {
            content: (
              <div className=" text-start">
                {item?.project?.vendor?.organization_name}
              </div>
            ),
          },
          {
            content: (
              <div className=" text-start">
                {item?.project?.subvendor?.organization_name}
              </div>
            ),
          },
          {
            content: (
              <div className=" text-start">{item?.created?.slice(0, 10)}</div>
            ),
          },
          {
            content: (
              <div className=" text-start">{`${getCurrencySymbol(item?.currency ?? "")}${item.total?.toLocaleString()}`}</div>
            ),
          },
          {
            content: (
              <div
                onClick={() => item.id && toggleStatus(item.id)}
                className={`cursor-pointer text-center ${item.status !== "Unpaid" && "text-[#000000]"}`}
              >
                {item.status}
              </div>
            ),
            className: ` text-white text-center border-none ${item.status === "Unpaid" ? "bg-[#ff0000]" : " bg-[#90ee90] text-[#000000]"}`,
          },
          {
            content: (
              <div
                key={`action-buttons-${index}`}
                className="flex justify-center gap-2"
              >
                {item.status === "Unpaid" ? (
                  <div
                    onClick={() => item.id && toggleStatus(item.id)}
                    className="p-[12px]  border border-[#2ea879] bg-[#ffffff] text-[#2ea879] rounded-full cursor-pointer"
                  >
                    <TbCurrencyDollar size={16} />
                  </div>
                ) : (
                  <div
                    onClick={() => item.id && toggleStatus(item.id)}
                    className="p-[16px] text-[#000000] cursor-pointer"
                  >
                    <BsTrash size={16} />
                  </div>
                )}
              </div>
            ),
          },
        ],
      })) || [];

  return (
    <div className="">
      <Table
        headers={headers}
        rows={rows}
        highlightFirstCell={true}
        emptyState={
          <div className="flex h-[50vh] flex-col items-center justify-center text-center">
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
