import React, { useEffect, useState } from "react";
import Table from "./Table";
import { BsTrash } from "react-icons/bs";
import { TbCurrencyDollar } from "react-icons/tb";
import { getInvoice, initializePayment } from "@/services/api";
import { ContentItem } from "@/types/contents";
import Link from "next/link";
import { toast } from "react-toastify";

const Invoice = ({ amountFilter, statusFilter }: any) => {
  const headers = [
    <div key="project-header" className=" text-start">
      {" "}
      Campaign
    </div>,
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
  const [filteredContent, setFilteredContent] = useState<ContentItem[] | null>(
    null
  );

  const [email, setEmail] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [reference, setReference] = useState("");

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
      console.log("fetchedContent", fetchedContent);
      setContent(fetchedContent);
    });
  }, []);

  // Apply filters whenever content, amountFilter, or statusFilter changes
  useEffect(() => {
    if (!content) return;

    let result = [...content];

    // Apply status filter if it exists
    if (
      statusFilter &&
      (statusFilter === "Paid" || statusFilter === "Unpaid")
    ) {
      result = result.filter((item) => item.status === statusFilter);
    }

    // Apply amount filter if it exists
    if (amountFilter) {
      if (amountFilter === "htl") {
        // High to low sorting
        result.sort((a, b) => (a.total || 0) - (b.total || 0));
      } else if (amountFilter === "lth") {
        // Low to high sorting
        result.sort((a, b) => (b.total || 0) - (a.total || 0));
      }
    }

    setFilteredContent(result);
  }, [content, amountFilter, statusFilter]);

  const generateInvoiceReference = () => {
    const timestamp = Date.now();
    const randomSuffix = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    return `INV-${timestamp}-${randomSuffix}`;
  };

  const openPaystackPopup = (authorizationUrl: string) => {
    const popup = window.open(
      authorizationUrl,
      "paystack-payment",
      "width=500,height=600,scrollbars=yes,resizable=yes,location=yes"
    );

    if (!popup || popup.closed || typeof popup.closed === "undefined") {
      toast.warning(
        "Popup blocked! Please allow popups for this site and try again."
      );
      return;
    }

    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
      }
    }, 1000);

    setTimeout(() => {
      if (!popup.closed) {
        popup.close();
        clearInterval(checkClosed);
      }
    }, 900000);
  };

  const toggleStatus = (item: any) => {
    const paymentToast = toast.loading("Initializing payment...");

    const invoiceReference = generateInvoiceReference();
    const payload = {
      email: item?.project?.subvendor?.owner_email,
      reference: invoiceReference,
      invoice_id: item?.id,
    };
    initializePayment(payload)
      .then((response) => {
        console.log(response);
        openPaystackPopup(response.authorization_url);
        toast.update(paymentToast, {
          render: "Payment generated",
          isLoading: false,
          type: "success",
        });
      })
      .catch((err) => {
        console.log(err);
        toast.update(paymentToast, {
          render: "Error occured",
          isLoading: false,
          type: "error",
        });
      });
  };

  const rows = (filteredContent || [])
    .slice()
    .reverse()
    .map((item: any, index) => ({
      data: [
        {
          content: (
            <div key={`manage-button-${index}`} className=" text-start">
              <Link href={`/payments/${item.id}`}>{item?.project?.title}</Link>
            </div>
          ),
          className: "bg-[#2ea879] text-white text-center ",
        },
        { content: <div className=" text-start">{item?.po_code} </div> },
        {
          content: (
            <div className=" text-start">
              {item?.project?.subvendor?.organization_name}
            </div>
          ),
        },
        {
          content: (
            <div className="text-start">
              {item?.project?.artist_name ||
                item?.project?.subvendor?.organization_name}
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
              // onClick={() => item.id && toggleStatus(item.id)}
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
                  onClick={() => {
                    setInvoiceId(item?.id);
                    setEmail(item?.project?.subvendor?.owner_email);
                    item.id && toggleStatus(item);
                  }}
                  className="p-[12px]  border border-[#2ea879] bg-[#ffffff] text-[#2ea879] rounded-full cursor-pointer"
                >
                  <TbCurrencyDollar size={16} />
                </div>
              ) : (
                <div
                  // onClick={() => item.id && toggleStatus(item.id)}
                  className="p-[16px] text-[#000000] cursor-pointer"
                >
                  <BsTrash size={16} />
                </div>
              )}
            </div>
          ),
        },
      ],
    }));

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
