"use client";
import React, { useEffect, useState } from "react";
import Table from "./Table";
import { BsTrash } from "react-icons/bs";
import { TbCurrencyDollar } from "react-icons/tb";
import { getInvoice, initializePayment } from "@/services";
import { ContentItem } from "@/types/contents";
import Link from "next/link";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Invoice = ({ amountFilter, statusFilter, searchText }: any) => {
  const headers = [
    <div key="project-header" className=" text-start">
      {" "}
      Campaign
    </div>,
    <div key="project-PoCode" className=" text-start">
      {" "}
      P.O Code
    </div>,
    <div key="project-PoCode" className=" text-start">
      {" "}
      Invoice Type
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
    null,
  );

  const [email, setEmail] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [reference, setReference] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [initializingInvoiceId, setInitializingInvoiceId] = useState<
    number | string | null
  >(null);

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
    setIsLoading(true);
    getInvoice()
      .then((fetchedContent) => {
        console.log("fetchedContent", fetchedContent);
        setContent(fetchedContent);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Apply filters whenever content, amountFilter, statusFilter, or searchText changes
  useEffect(() => {
    if (!content) return;

    let result = [...content];

    // Apply search filter if searchText is not empty
    if (searchText && searchText.trim() !== "") {
      const searchTerm = searchText.toLowerCase().trim();
      result = result.filter((item) => {
        const title = item?.project?.title?.toLowerCase() || "";
        const label =
          item?.project?.subvendor?.organization_name?.toLowerCase() || "";
        const artist =
          (
            item?.project?.artist_name ||
            item?.project?.subvendor?.organization_name
          )?.toLowerCase() || "";

        return (
          title.includes(searchTerm) ||
          label.includes(searchTerm) ||
          artist.includes(searchTerm)
        );
      });
    }

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
        result.sort((a, b) => (b.total || 0) - (a.total || 0));
      } else if (amountFilter === "lth") {
        // Low to high sorting
        result.sort((a, b) => (a.total || 0) - (b.total || 0));
      }
    }

    setFilteredContent(result);
  }, [content, amountFilter, statusFilter, searchText]);

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
      "width=500,height=600,scrollbars=yes,resizable=yes,location=yes",
    );

    if (!popup || popup.closed || typeof popup.closed === "undefined") {
      toast.error(
        "Popup blocked! Please allow popups for this site and try again.",
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

  const toggleStatus = async (item: any) => {
    if (!item?.id) return;

    setInitializingInvoiceId(item.id);
    const invoiceReference = generateInvoiceReference();
    const payload = {
      email: item?.project?.subvendor?.owner_email,
      reference: invoiceReference,
      invoice_id: item?.id,
    };

    try {
      const response = await initializePayment(payload);
      console.log(response);

      if (response?.authorization_url) {
        openPaystackPopup(response.authorization_url);
        toast.info("Payment generated");
      } else {
        toast.error("Error occurred");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error occurred");
    } finally {
      setInitializingInvoiceId(null);
    }
  };

  const loadingRows = Array.from({ length: 5 }, () => ({
    data: headers.map((_, cellIndex) => ({
      content: (
        <Skeleton
          className={`mx-auto h-4 ${
            cellIndex === 0
              ? "w-[150px]"
              : cellIndex === headers.length - 1
                ? "h-8 w-8 rounded-full"
                : "w-[90px]"
          }`}
        />
      ),
      className: "border bg-card dark:bg-card",
    })),
  }));

  const rows = isLoading
    ? loadingRows
    : (filteredContent || [])
        .slice()
        .reverse()
        .map((item: any, index) => ({
          data: [
            {
              content: (
                <div key={`manage-button-${index}`} className=" text-start">
                  <Link href={`/payments/${item.id}`}>
                    {item?.project?.title}
                  </Link>
                </div>
              ),
              className:
                "bg-[#2ea879] text-white text-center dark:bg-[#17954c]",
            },
            { content: <div className=" text-start">{item?.po_code} </div> },
            {
              content: <div className=" text-start">{item?.invoice_type} </div>,
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
                  className="cursor-pointer text-center"
                >
                  {item.status}
                </div>
              ),
              className: `border-none text-center ${
                item.status === "Unpaid"
                  ? "bg-destructive text-white"
                  : "bg-emerald-100 text-black dark:bg-emerald-500/20 dark:text-white"
              }`,
            },
            {
              content: (
                <div
                  key={`action-buttons-${index}`}
                  className="flex justify-center gap-2"
                >
                  {item.status === "Unpaid" ? (
                    <button
                      type="button"
                      onClick={() => {
                        setInvoiceId(item?.id);
                        setEmail(item?.project?.subvendor?.owner_email);
                        item.id && toggleStatus(item);
                      }}
                      disabled={initializingInvoiceId === item.id}
                      className="p-[12px]  border border-[#2ea879] bg-card text-[#2ea879] rounded-full cursor-pointer disabled:cursor-wait disabled:opacity-70 dark:border-[#31bc86] dark:text-[#73d79c]"
                    >
                      {initializingInvoiceId === item.id ? (
                        <LoaderCircle size={16} className="animate-spin" />
                      ) : (
                        <TbCurrencyDollar size={16} />
                      )}
                    </button>
                  ) : (
                    <div
                      // onClick={() => item.id && toggleStatus(item.id)}
                      className="p-[16px] text-foreground cursor-pointer"
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
              <p className="text-[20px] font-[600] text-muted-foreground">
                No Data
              </p>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default Invoice;
