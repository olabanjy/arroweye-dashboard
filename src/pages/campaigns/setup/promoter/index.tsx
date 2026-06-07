import React, { useEffect, useState } from "react";
import DashboardLayout from "@/pages/dashboard/layout";
import Head from "next/head";
import { Input } from "@/components/ui/input";
import { PromotionGrid } from "@/components/campaigns/PromotionGrid";
import { getCampaignWallet, getPromoterPlans } from "@/services/api";

const PromoterCampaign = () => {
  const [walletDetails, setWalletDetails] = useState<any>({});
  const [promotersData, setPromotersData] = useState<any>([]);

  useEffect(() => {
    getPromoterPlans()
      .then((fetchedContent: any) => {
        console.log("PROMOTER DETAILS", fetchedContent);
        setPromotersData(fetchedContent?.results);
      })
      .catch((err) => {
        console.log("ERR", err);
      });
  }, []);

  useEffect(() => {
    getCampaignWallet()
      .then((fetchedContent: any) => {
        console.log("WALLET DETAILS", fetchedContent);
        setWalletDetails(fetchedContent);
      })
      .catch((err) => {
        console.log("ERR", err);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Promoter Campaigns - Arroweye</title>
      </Head>
      <DashboardLayout>
        <div className="bg-[#F6F6F6] py-7">
          <div className="flex justify-center items-center gap-2 mb-7">
            <p className="text-[#A3A3A3]">Set Budget</p>
            <div className="h-[1px] w-8 bg-[#A3A3A3]" />
            <p>Launch Campaign</p>
          </div>

          <div className="bg-white py-8 mx-5 px-5 lg:px-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] items-center">
              <Input
                className="border-[#9D9A9A]"
                type="text"
                placeholder="Email"
              />
              <Input
                className="border-[#9D9A9A]"
                type="text"
                placeholder="ISRC / UPC"
              />
            </div>

            <div className="mt-10 px-5 py-7 rounded-xl bg-[#F3F4F6] border border-black grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">
              <div className="flex flex-col justify-between items-center min-h-[80px]">
                <p className="text-lg font-medium text-center leading-tight">
                  TOTAL TOKENS
                </p>
                <p className="text-5xl font-medium">
                  {walletDetails?.available_balance || "0"}
                </p>
              </div>

              <div className="flex flex-col justify-between items-center min-h-[80px]">
                <p className="text-lg font-medium text-center leading-tight">
                  TOKENS ALLOCATED
                </p>
                {/* <p className="text-5xl font-medium">{totalTokens || "0"}</p> */}
                <p className="text-5xl font-medium">{"0"}</p>
              </div>

              <div className="flex flex-col justify-between items-center min-h-[80px]">
                <p className="text-lg font-medium text-center leading-tight">
                  TOKENS REMAINING
                </p>
                {/* <p className="text-5xl font-medium">
                  {totalTokens > 0 && walletDetails?.available_balance > 0
                    ? walletDetails.available_balance - totalTokens
                    : 0}
                </p> */}
                <p className="text-5xl font-medium">{"0"}</p>
              </div>

              <div className="flex flex-col justify-between items-center min-h-[80px]">
                <p className="text-lg font-medium text-center leading-tight">
                  DJS SELECTED
                </p>
                <p className="text-5xl font-medium">{"0"}</p>
                {/* <p className="text-5xl font-medium">{totalDJs || 0}</p> */}
              </div>
            </div>

            <div className="pt-10">
              <div className="mb-8">
                <p className="font-bold lg:text-lg">Promoters</p>
                <Input
                  className="border-[#9D9A9A]"
                  type="text"
                  placeholder="Email"
                />
              </div>
              <PromotionGrid data={promotersData} />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default PromoterCampaign;
