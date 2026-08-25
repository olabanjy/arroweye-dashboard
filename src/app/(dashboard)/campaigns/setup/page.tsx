"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/context/auth-session";
import { getCampaignWallet } from "@/services";
import SecurityFraudSection from "./security-fraud-section";

const featureCards = [
  {
    step: 1,
    title: "Discover DJs",
    image: "/setup-dj.webp",
  },
  {
    step: 2,
    title: "Build your campaign",
    image: "/setup-track.webp",
  },
  {
    step: 3,
    title: "Fund and launch",
    image: "/setup-optimize.webp",
  },
];

const platformStats = [
  { label: "Campaigns completed", value: "40" },
  { label: "Active campaigns", value: "15" },
  { label: "Total DJs", value: "100+" },
];

const getFirstName = (name?: string, email?: string) => {
  const value = name?.trim() || email?.split("@")[0] || "there";
  return value.split(/[\s._-]+/)[0];
};

export default function CreateContent() {
  const { isAuthenticated, user, userProfile } = useAuth();
  const { data: walletData, isLoading: isWalletLoading } = useQuery({
    queryKey: ["wallet"],
    queryFn: getCampaignWallet,
    enabled: isAuthenticated,
  });

  const firstName = getFirstName(userProfile?.fullname, user?.email);
  const tokenBalance = Number(walletData?.available_balance) || 0;
  const formattedBalance = new Intl.NumberFormat("en-NG").format(tokenBalance);

  return (
    <div className="flex min-h-full items-center justify-center bg-white px-4 py-10 text-black sm:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <header className="text-center">
          <h1 className="text-[25px] font-semibold leading-tight tracking-[-0.025em] sm:text-[27px]">
            Good Morning{isAuthenticated ? `, ${firstName}` : ""}!
          </h1>
          {isAuthenticated && (
            <>
              <p className="mt-3 text-[16px] leading-none text-[#929292]">
                Your token balance is
              </p>
              <div
                className="mt-[18px] min-h-[52px] text-[50px] font-medium leading-none tracking-[-0.035em] tabular-nums sm:text-[54px]"
                aria-live="polite"
              >
                {isWalletLoading ? (
                  <span className="mx-auto block h-[52px] w-28 animate-pulse rounded-md bg-[#ededed]" />
                ) : (
                  formattedBalance
                )}
              </div>
            </>
          )}

          <div className="mt-[36px] flex items-center justify-center">
            <Link
              href="/campaigns/setup/budget"
              className="inline-flex h-[30px] min-w-[117px] items-center justify-center rounded-full border border-black bg-black px-4 text-[10px] font-medium text-white transition-[background-color,color,transform] duration-150 ease-out hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black active:scale-[0.97]"
            >
              Start Campaign
            </Link>
          </div>
        </header>

        <section className="mt-[47px]" aria-labelledby="how-it-works-title">
          <h2
            id="how-it-works-title"
            className="mb-[17px] text-center text-[12px] font-medium text-[#969090] uppercase"
          >
            How it works
          </h2>

          <div className="grid gap-[14px] sm:grid-cols-3">
            {featureCards.map((card) => (
              <article
                key={card.title}
                className="group relative aspect-video overflow-hidden rounded-[4px] bg-[#d7d7d7]"
              >
                <Image
                  src={card.image}
                  alt=""
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 33vw, 320px"
                  className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.025]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/5" />
                <span className="absolute right-3 top-4 flex size-[22px] items-center justify-center rounded-full bg-white text-[11px] font-semibold text-black shadow-sm">
                  {card.step}
                </span>
                <h3 className="absolute inset-x-[10px] bottom-[10px] text-[12px] font-semibold leading-tight text-white">
                  {card.title}
                </h3>
              </article>
            ))}
          </div>
        </section>

        <section
          className="mt-[19px] grid gap-[14px] sm:grid-cols-3"
          aria-label="Platform statistics"
        >
          {platformStats.map((stat) => (
            <article
              key={stat.label}
              className="flex h-[112px] flex-col justify-center rounded-[4px] border border-[#d7d7d7] px-[15px]"
            >
              <p className="text-[9px] font-medium tracking-[0.12em] text-[#aaa4a4] uppercase">
                {stat.label}
              </p>
              <p className="mt-[18px] text-[38px] font-medium leading-none tracking-[-0.04em]">
                {stat.value}
              </p>
            </article>
          ))}
        </section>

        <SecurityFraudSection />

        <section
          className="mt-[35px] text-center"
          aria-label="Trusted partners"
        >
          <p className="text-[11px] font-medium text-[#9f9999] uppercase">
            Trusted by artistes and labels globally
          </p>
          <div
            className="mt-[36px] flex items-center justify-center gap-[20px] text-[#dadada]"
            aria-hidden="true"
          >
            <span className="h-0 w-0 border-x-[20px] border-b-[35px] border-x-transparent border-b-current" />
            <span className="h-[35px] w-[84px] bg-current" />
            <span className="size-[39px] rounded-full bg-current" />
          </div>
        </section>
      </div>
    </div>
  );
}
