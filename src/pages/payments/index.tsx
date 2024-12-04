import React from "react";
import DashboardLayout from "../dashboard/layout";
import PaymentTab from "./component/PaymentTab";
import InvoicesTab from "./component/InvoicesTab";

const Payment = () => {
  return (
    <DashboardLayout>
      <PaymentTab />
      <div className="">
        <InvoicesTab />
      </div>
    </DashboardLayout>
  );
};

export default Payment;
