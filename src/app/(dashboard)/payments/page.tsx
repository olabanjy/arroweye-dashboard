import type { Metadata } from "next";
import PaymentsPageClient from "./payments-page-client";

export const metadata: Metadata = {
  title: "Payments - Arroweye",
};

export default function PaymentsPage() {
  return <PaymentsPageClient />;
}
