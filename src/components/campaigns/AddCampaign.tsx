import { X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const AddCampaign = () => {
  const router = useRouter();
  return (
    <div className="fixed inset-0 z-10 lg:z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div
        className="absolute top-10 right-5 lg:right-20 cursor-pointer"
        onClick={() => router.push("/campaigns/setup")}
      >
        <X className="text-white lg:w-10 lg:h-10" />
      </div>
      <div className="flex flex-col justify-center items-center gap-24">
        <p className="text-xl font-semibold text-white">LAUNCH YOUR CAMPAIGN</p>

        <div className="flex flex-col justify-center">
          <Link href="/campaigns/setup/custom">
            <button className="py-3 mx-auto w-[200px] rounded-full border border-white text-white">
              Custom
            </button>
          </Link>
          <p className="mt-2 text-white max-w-[200px] text-center italic">
            Choose DJs, cities and spin allocation
          </p>
        </div>

        <div className="flex flex-col justify-center">
          <Link href="/campaigns/setup/promoter">
            <button className="py-3 mx-auto w-[200px] rounded-full bg-white text-black">
              Promoter Plans
            </button>
          </Link>
          <p className="mt-2 text-white max-w-[200px] text-center italic">
            Launch faster with curated DJ networks
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddCampaign;
