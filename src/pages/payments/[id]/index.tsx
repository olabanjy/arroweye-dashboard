import React, { useEffect, useState } from "react";
import Logo from "@assets/arroreyelogoSm.svg";
import Image from "next/image";
import { getPaymentInvoice } from "@/services/api";
import { ContentItem } from "@/types/contents";
import { useRouter } from "next/router";

const Invoice = () => {
  const [content, setContent] = useState<ContentItem | null>(null);

  const { query } = useRouter();
  const { id } = query;

  useEffect(() => {
    getPaymentInvoice(Number(id)).then((fetchedContent) => {
      setContent(fetchedContent);
    });
  }, [id]);

  const handlePrint = () => {
    const originalContent = document.body.innerHTML;
    const invoiceContent = document.getElementById("invoice")?.outerHTML;

    if (invoiceContent) {
      document.body.innerHTML = `
        <html>
          <head>
            <title>Print Invoice</title>
            <style>
              /* General styles for printing */
              @media print {
                body {
                  margin: 0;
                  padding: 0;
                  background: white;
                  -webkit-print-color-adjust: exact;
                }
                #invoice {
                  box-shadow: none;
                  width: 100%;
                  margin: auto;
                }
              }
              /* Custom styling for invoice */
              .invoice {
                width: 400px;
                margin: auto;
                padding: 20px;
                background: #ffffff;
                border-radius: 20px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                font-family: 'IBM Plex Sans', sans-serif;
              }
            </style>
          </head>
          <body>${invoiceContent}</body>
        </html>
      `;

      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#ffffff] font-IBM">
      <div
        id="invoice"
        className="w-[400px] px-6 py-[20px] bg-white rounded-2xl shadow-custom shadow-slate-400"
      >
        <div className="text-center pb-[10px] border-b border-[#212529] flex items-center justify-between">
          <Image src={Logo} alt="Logo" width={30} height={30} />
          <p className="text-xl font-semibold">Invoice</p>
        </div>

        <div className="mb-4 mt-4 space-y-[10px]">
          <div className="flex justify-between text-[16px]">
            <p className="font-[600]">Date Issued</p>
            <p className="font-[400]">{content?.created?.slice(0, 10)}</p>
          </div>
          <div className="flex justify-between text-[16px]">
            <p className="font-[600]">P.O Number</p>
            <p className="font-[400]">{content?.po_code}</p>
          </div>
          <div className="flex justify-between text-[16px]">
            <p className="font-[600]">Invoice Number</p>
            <p className="font-[400]">INV-20240506-001</p>
          </div>
          <div className="flex justify-between text-[16px]">
            <p className="font-[600]">Customer</p>
            <p className="font-[400]">Neville Records Limited</p>
          </div>
          <div className="flex justify-between text-[16px]">
            <p className="font-[600]">Email</p>
            <p className="font-[400]">johndoe@example.com</p>
          </div>
        </div>

        <div className="text-[16px]">
          <p className="font-[600] mb-2">Services</p>
          <div
            className="text-[#212529] max-h-[70px] overflow-y-auto scrollbar-tiny space-y-2 pr-2"
            style={{ scrollbarWidth: "thin" }}
          >
            {content?.items?.map((item, index) => (
              <div className="flex justify-between text-[16px]" key={index}>
                <p className="font-[400]">{item.service.name}</p>
                <p className="font-[400]">{item.service.cost}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="my-4 pt-4 border-t border-[#212529] space-y-[10px]">
          <div className="flex justify-between text-[16px]">
            <p className=" font-[600]">Taxes</p>
            <p className=" font-[400]">
              {content?.currency === "USD"
                ? "$"
                : content?.currency === "Naira"
                  ? "₦"
                  : content?.currency}
              {content?.tax_amount?.toLocaleString()}
            </p>
          </div>
          <div className="flex justify-between text-[16px]">
            <p className=" font-[600]">Total Amount (+ Tax) </p>
            <p className=" font-[400]">
              {content?.currency === "USD"
                ? "$"
                : content?.currency === "Naira"
                  ? "₦"
                  : content?.currency}
              {content?.total?.toLocaleString()}
            </p>
          </div>
          <div className="flex justify-between text-[16px]">
            <p className=" font-[600]">Payment Method </p>
            <p className=" font-[400]">Credit Card</p>
          </div>
        </div>

        <div className="text-center text-xs text-gray-400">
          <p>Receipt ID: #123456789</p>
        </div>

        {content?.status === "Unpaid" ? (
          <button
            onClick={handlePrint}
            disabled
            className=" w-full p-[10px] text-center font-[600] text-[16px] mt-2 rounded text-[#ffffff] bg-[#c4c3c3] transition-all duration-700 ease-in-out transform "
          >
            UnPaid
          </button>
        ) : (
          <button
            onClick={handlePrint}
            className="w-full p-[10px] text-center font-[600] text-[16px] mt-2 rounded text-[#ffffff] bg-[#000000] hover:bg-orange-500 transition-all duration-700 ease-in-out transform "
          >
            Download Receipt
          </button>
        )}
      </div>
    </div>
  );
};

export default Invoice;
