import React, { useEffect, useState } from "react";
import DashboardLayout from "@/pages/dashboard/layout";
import Head from "next/head";
import AddCampaign from "@/components/campaigns/AddCampaign";
import SetBudget from "@/components/campaigns/SetBudget";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { verifyWalletPayment } from "@/services";

const Setup = () => {
  const router = useRouter();

  const showModal = router.query.showModal === "true";
  const rawReference = router.query.reference;
  const reference = Array.isArray(rawReference)
    ? rawReference[0]
    : rawReference;

  const [verifyStatus, setVerifyStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [walletRefreshToken, setWalletRefreshToken] = useState(0);

  useEffect(() => {
    if (!router.isReady) return;
    if (!reference) return;

    const verifyPayment = async () => {
      const toastId = toast.loading("Verifying payment...");
      setVerifyStatus("loading");
      try {
        await verifyWalletPayment(reference);

        setVerifyStatus("success");
        toast.update(toastId, {
          render: "Payment verified successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        // Re-fetch wallet so the credited balance shows before proceeding
        setWalletRefreshToken((n) => n + 1);

        router.replace(
          {
            pathname: router.pathname,
            query: { ...(showModal && { showModal: "true" }) },
          },
          undefined,
          { shallow: true },
        );
      } catch (error) {
        setVerifyStatus("error");
        toast.update(toastId, {
          render: "Payment verification failed. Please contact support.",
          type: "error",
          isLoading: false,
          autoClose: 4000,
        });
        console.error("Payment verification failed:", error);
      }
    };

    verifyPayment();
  }, [router.isReady, reference]);

  return (
    <>
      <Head>
        <title>Setup Campaigns - Arroweye</title>
      </Head>

      <DashboardLayout>
        <SetBudget refreshToken={walletRefreshToken} />
        {showModal && <AddCampaign />}
      </DashboardLayout>
    </>
  );
};

export default Setup;
