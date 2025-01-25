import React from "react";
import Logo from "@assets/arroreyelogoSm.svg";
import Image from "next/image";

const Invoice = () => {
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
        className="w-[400px] px-6 py-[20px] bg-white rounded-2xl shadow-md shadow-slate-400"
      >
        <div className="text-center pb-[10px] border-b border-[#212529] flex items-center justify-between">
          <Image src={Logo} alt="Logo" width={30} height={30} />
          <p className="text-xl font-semibold">Invoice</p>
        </div>

        <div className="mb-4 mt-4 space-y-[10px]">
          <div className="flex justify-between text-[16px]">
            <p className="font-[600]">Date Issued</p>
            <p className="font-[400]">May 6, 2024</p>
          </div>
          <div className="flex justify-between text-[16px]">
            <p className="font-[600]">P.O Number</p>
            <p className="font-[400]">8888896</p>
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
          <div className="text-[#212529] max-h-[70px] overflow-y-auto space-y-2 pr-2">
            <div className="flex justify-between text-[16px]">
              <p className="font-[400]">Spotify Playlist Placement</p>
              <p className="font-[400]">$100</p>
            </div>
            <div className="flex justify-between text-[16px]">
              <p className="font-[400]">YouTube Music Video Promotion</p>
              <p className="font-[400]">$150</p>
            </div>
            <div className="flex justify-between text-[16px]">
              <p className="font-[400]">Instagram Influencer Shoutout</p>
              <p className="font-[400]">$75</p>
            </div>
            <div className="flex justify-between text-[16px]">
              <p className="font-[400]">TikTok Campaign</p>
              <p className="font-[400]">$50</p>
            </div>
            <div className="flex justify-between text-[16px]">
              <p className="font-[400]">Facebook Ad Promotion</p>
              <p className="font-[400]">$90</p>
            </div>
          </div>
        </div>

        <div className="my-4 pt-4 border-t border-[#212529] space-y-[10px]">
          <div className="flex justify-between text-[16px]">
            <p className=" font-[600]">Taxes</p>
            <p className=" font-[400]">$3.25</p>
          </div>
          <div className="flex justify-between text-[16px]">
            <p className=" font-[600]">Total Amount (+ Tax) </p>
            <p className=" font-[400]">$325</p>
          </div>
          <div className="flex justify-between text-[16px]">
            <p className=" font-[600]">Payment Method </p>
            <p className=" font-[400]">Credit Card</p>
          </div>
        </div>

        <div className="text-center text-xs text-gray-400">
          <p>Receipt ID: #123456789</p>
          <p className="mt-2">© 2025 Arroweye.pro</p>
        </div>

        <button
          onClick={handlePrint}
          className="w-full p-[10px] text-center font-[600] text-[16px] mt-2 rounded text-[#ffffff] bg-[#000000] hover:bg-orange-500"
        >
          Download Receipt
        </button>
      </div>
    </div>
  );
};

export default Invoice;
