"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";

import { useAuth } from "@/context/auth-session";
import { getCampaignWallet } from "@/services";
import { Button } from "@/components/ui/button";
import SecurityFraudSection from "./security-fraud-section";

const featureCards = [
  {
    step: 1,
    title: "Connect with trusted DJs",
    image: "/setup-dj.webp",
  },
  {
    step: 2,
    title: "Track every verified play",
    image: "/setup-track.webp",
  },
  {
    step: 3,
    title: "Optimize in real time",
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

  const scrollToSecuritySection = () => {
    document.getElementById("security-fraud")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="bg-background text-foreground">
      <section className="flex min-h-dvh px-4 py-10 sm:h-dvh sm:px-8">
        <div className="mx-auto flex w-full max-w-5xl flex-col">
          <div className="my-auto w-full">
            <header className="text-center">
              <h1 className="text-[25px] font-semibold leading-tight tracking-[-0.025em] sm:text-[27px]">
                Good Morning{isAuthenticated ? `, ${firstName}` : ""}!
              </h1>
              {/* {isAuthenticated && (
            <>
              <p className="mt-3 text-[16px] leading-none text-muted-foreground">
                Your token balance is
              </p>
              <div
                className="mt-[18px] min-h-[52px] text-[50px] font-medium leading-none tracking-[-0.035em] tabular-nums sm:text-[54px]"
                aria-live="polite"
              >
                {isWalletLoading ? (
                  <span className="mx-auto block h-[52px] w-28 animate-pulse rounded-md bg-muted" />
                ) : (
                  formattedBalance
                )}
              </div>
            </>
          )} */}

              <div className="mt-[36px] flex items-center justify-center">
                <Button
                  asChild
                  className="h-11 min-w-[160px] rounded-full px-7 text-sm font-semibold"
                >
                  <Link href="/campaigns/setup/launch">Start Campaign</Link>
                </Button>
              </div>
            </header>

            <section className="mt-[47px]" aria-labelledby="how-it-works-title">
              <h2
                id="how-it-works-title"
                className="mb-[17px] text-center text-[12px] font-medium text-muted-foreground uppercase"
              >
                How it works
              </h2>

              <div className="grid gap-[14px] sm:grid-cols-3">
                {featureCards.map((card) => (
                  <article
                    key={card.title}
                    className="group relative aspect-video overflow-hidden rounded-[4px] bg-none"
                  >
                    <Image
                      src={card.image}
                      alt=""
                      fill
                      sizes="(max-width: 639px) 100vw, (max-width: 1023px) 33vw, 320px"
                      className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.025]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/5" />
                    <span className="absolute left-3 top-4 flex size-[22px] items-center justify-center rounded-full bg-background text-[11px] font-semibold text-foreground shadow-sm">
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
                  className="flex h-[112px] flex-col justify-center rounded-[4px] border border-border bg-card px-[15px] text-card-foreground"
                >
                  <p className="text-[9px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
                    {stat.label}
                  </p>
                  <p className="mt-[18px] text-[38px] font-medium leading-none tracking-[-0.04em]">
                    {stat.value}
                  </p>
                </article>
              ))}
            </section>
          </div>

          <button
            type="button"
            onClick={scrollToSecuritySection}
            aria-controls="security-fraud"
            className="mx-auto mt-8 flex shrink-0 flex-col items-center gap-1 rounded-md px-4 py-2 text-[12px] font-semibold tracking-[0.12em] text-[#2f80ed] uppercase outline-none transition-colors hover:text-[#1769d2] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <span>Security and fraud detection</span>
            <ChevronDown className="size-5" aria-hidden="true" />
          </button>
        </div>
      </section>

      <div id="security-fraud" className="scroll-mt-0 px-4 pb-10 sm:px-8">
        <div className="mx-auto w-full max-w-5xl pt-14">
          <SecurityFraudSection />

          <section
            className="mt-[35px] text-center"
            aria-label="Trusted partners"
          >
            <p className="text-[11px] font-medium text-muted-foreground uppercase">
              Trusted by artistes and labels globally
            </p>
            <div
              className="mt-[36px] flex items-center justify-center gap-[20px] text-muted"
              aria-hidden="true"
            >
              <span className="h-0 w-0 border-x-[20px] border-b-[35px] border-x-transparent border-b-current" />
              <span className="h-[35px] w-[84px] bg-current" />
              <span className="size-[39px] rounded-full bg-current" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
