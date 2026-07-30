"use client";

import { useEffect, useRef, useState } from "react";
import AddCampaign from "@/components/campaigns/AddCampaign";
import SetBudget from "@/components/campaigns/SetBudget";
import { verifyWalletPayment } from "@/services";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const SetupContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const showModal = searchParams.get("showModal") === "true";
  const reference = searchParams.get("reference");

  const [walletRefreshToken, setWalletRefreshToken] = useState(0);
  const verifiedReferenceRef = useRef<string | null>(null);

  useEffect(() => {
    if (!reference) return;
    if (verifiedReferenceRef.current === reference) return;

    verifiedReferenceRef.current = reference;

    const verifyPayment = async () => {
      toast.loading("Verifying payment...", { id: "verify-wallet-payment" });

      try {
        await verifyWalletPayment(reference);

        toast.success("Payment verified successfully!", {
          id: "verify-wallet-payment",
        });

        setWalletRefreshToken((n) => n + 1);
        router.replace(`${pathname}${showModal ? "?showModal=true" : ""}`, {
          scroll: false,
        });
      } catch (error) {
        toast.error("Payment verification failed. Please contact support.", {
          id: "verify-wallet-payment",
        });
        console.error("Payment verification failed:", error);
      }
    };

    verifyPayment();
  }, [pathname, reference, router, showModal]);

  return (
    <>
      <SetBudget refreshToken={walletRefreshToken} />
      {showModal && <AddCampaign />}
    </>
  );
};

export default SetupContent;
