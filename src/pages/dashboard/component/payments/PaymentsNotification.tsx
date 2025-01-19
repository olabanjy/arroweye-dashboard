import React from "react";
import AdsNotificationCard from "../AdsNotificationCard";
import PaymentMomentNotificationCard from "./PaymentMomentNotificationCard";
import InvoiceNotificationCard from "./InvoiceNotificationCard ";

const PaymentsNotification = () => {
  const handleDownload = () => {
    console.log("Download triggered");
  };

  const handleShare = () => {
    console.log("Share triggered");
  };
  return (
    <div className=" space-y-[20px]">
      <PaymentMomentNotificationCard
        timeAgo="2 DAYS AGO"
        message="MOU-Run-This-Town (PO-4564) has been uploaded for Run This Town "
        onDownload={handleDownload}
        onShare={handleShare}
      />
      <AdsNotificationCard
        timeAgo="ADS BY VIVO"
        message=" An ad about this item by this brand for $100 "
        onDownload={handleDownload}
        onShare={handleShare}
      />

      <InvoiceNotificationCard
        timeAgo="2 DAYS AGO"
        message="INV-3434-Run-This-Town (PO-4564) has been uploaded for Run This Town"
        onDownload={handleDownload}
        onShare={handleShare}
      />
    </div>
  );
};

export default PaymentsNotification;
