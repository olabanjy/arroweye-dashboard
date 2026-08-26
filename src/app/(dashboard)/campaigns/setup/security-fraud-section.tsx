"use client";

import Image from "next/image";
import Icon from "@mdi/react";
import {
  mdiArrowDownCircleOutline,
  mdiArrowUpDown,
  mdiCheck,
  mdiCheckCircleOutline,
  mdiChevronDown,
  mdiClose,
  mdiDownload,
  mdiHeart,
  mdiHeartOutline,
  mdiHomeMapMarker,
  mdiMapMarkerOutline,
  mdiMusicNote,
  mdiOpenInNew,
  mdiWifi,
  mdiWifiOff,
} from "@mdi/js";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type SecurityLink = {
  label: string;
  href: string;
  iconPath: string;
};

type SecurityFeature = {
  title: string;
  description: string;
  image: string;
  accentClassName: string;
  linkClassName: string;
  iconPath: string;
  sideIconPath: string;
  links: SecurityLink[];
  dialogTitle: string;
  dialogDescription: string;
  dialogBenefits: string[];
  dialogLinks: SecurityLink[];
  dialogVisual: "offline" | "geolocation" | "ratings";
};

const securityFeatures: SecurityFeature[] = [
  {
    title: "Offline Detection",
    description:
      "Music doesn't stop when the internet does. Our offline detection system records spins even without an internet connection and automatically syncs them once the device is back online, ensuring no verified performance is ever lost.",
    image:
      "https://res.cloudinary.com/dyueswnzk/image/upload/v1785066311/handsome-stylish-african-american-guy-dressed-bright-jacket-listening-music-headphones-white-background_fywofa.webp",
    accentClassName: "text-[#2f80ed]",
    linkClassName:
      "text-[#0076df] hover:text-[#088bff] focus-visible:outline-[#0076df]",
    iconPath: mdiWifiOff,
    sideIconPath: mdiWifiOff,
    links: [
      {
        label: "Marketplace",
        href: "https://arroweye.shop/",
        iconPath: mdiOpenInNew,
      },
    ],
    dialogTitle: "Poor connectivity shouldn't cost you campaign data.",
    dialogDescription:
      "Our detection engine ensures every verified play is recorded locally and automatically synchronized when the device reconnects.",
    dialogBenefits: [
      "Reliable operation with low or no connectivity",
      "Secure offline caching of verified plays",
      "Timestamp and verification preservation",
      "Automatic cloud synchronization",
    ],
    dialogLinks: [
      {
        label: "Download for iPhone",
        href: "https://apps.apple.com/us/app/spins-pro/id6756712903",
        iconPath: mdiArrowDownCircleOutline,
      },
      {
        label: "Download for Android",
        href: "https://play.google.com/store/apps/details?id=com.arroweye.spins",
        iconPath: mdiArrowDownCircleOutline,
      },
    ],
    dialogVisual: "offline",
  },
  {
    title: "Geolocation",
    description:
      "Without location verification, anyone could claim a song was played anywhere. Our geolocation technology verifies that every detected spin takes place within an approved venue or campaign area, preventing fraud, detecting anomalies, and ensuring every performance is verified and authentic.",
    image:
      "https://res.cloudinary.com/dyueswnzk/image/upload/v1785067276/aerial-drone-vertical-view-rally-support-country-s-european-integration_rbpxhe.webp",
    accentClassName: "text-[#00b894]",
    linkClassName:
      "text-[#048f73] hover:text-[#00b894] focus-visible:outline-[#048f73]",
    iconPath: mdiMapMarkerOutline,
    sideIconPath: mdiHomeMapMarker,
    links: [
      {
        label: "Download for iPhone",
        href: "https://apps.apple.com/us/app/spins-pro/id6756712903",
        iconPath: mdiDownload,
      },
      {
        label: "Download for Android",
        href: "https://play.google.com/store/apps/details?id=com.arroweye.spins",
        iconPath: mdiDownload,
      },
    ],
    dialogTitle: "Every play, exactly where it happened.",
    dialogDescription:
      "Every detected play is verified against its expected location before it's counted, giving labels and artists a trusted view of real-world campaign activity.",
    dialogBenefits: [
      "Venue verification",
      "Anomaly detection",
      "Real-time reporting",
    ],
    dialogLinks: [
      {
        label: "Marketplace",
        href: "https://arroweye.shop/",
        iconPath: mdiOpenInNew,
      },
    ],
    dialogVisual: "geolocation",
  },
  {
    title: "Ratings & Refunds",
    description:
      "We maintain accountability by allowing labels to rate completed campaigns and automatically issue token refunds when agreed performance standards are not met. Every campaign outcome also contributes to each DJ's deliverability score and overall rating, helping labels identify the most reliable performers over time.",
    image:
      "https://res.cloudinary.com/dyueswnzk/image/upload/v1785071432/igor-omilaev-Z2PahC-Fi08-unsplash_v8iuug.webp",
    accentClassName: "text-[#f31285]",
    linkClassName:
      "text-[#f31285] hover:text-[#ff2a8a] focus-visible:outline-[#f31285]",
    iconPath: mdiHeart,
    sideIconPath: mdiHeart,
    links: [
      {
        label: "Marketplace",
        href: "https://arroweye.shop/",
        iconPath: mdiOpenInNew,
      },
    ],
    dialogTitle: "Every campaign leaves a reputation.",
    dialogDescription:
      "Every completed campaign becomes part of a DJ's verified track record, helping artistes and labels discover the most reliable performers over time.",
    dialogBenefits: [
      "Automatic token refunds",
      "Performance-based accountability",
      "Verified ratings",
    ],
    dialogLinks: [
      {
        label: "Marketplace",
        href: "https://arroweye.shop/",
        iconPath: mdiOpenInNew,
      },
    ],
    dialogVisual: "ratings",
  },
];

const OfflineFlowLine = ({
  active,
  tone = "blue",
}: {
  active: boolean;
  tone?: "blue" | "green";
}) => (
  <span className="relative h-11 w-0.5 shrink-0 overflow-hidden rounded-full bg-border dark:bg-white/20 sm:h-0.5 sm:min-w-6 sm:flex-1">
    <span
      className={`absolute left-1/2 -translate-x-1/2 transition-[top] ease-linear motion-reduce:transition-none sm:hidden ${
        active ? "top-full duration-500" : "-top-5 duration-0"
      } ${
        tone === "green"
          ? "size-3.5 rounded-full bg-[#05b894] shadow-[0_0_12px_rgba(5,184,148,0.75)]"
          : "h-5 w-1 rounded-full bg-gradient-to-b from-transparent via-[#4285f4] to-transparent shadow-[0_0_10px_rgba(66,133,244,0.65)]"
      }`}
    />
    <span
      className={`absolute hidden transition-[left] ease-linear motion-reduce:transition-none sm:block ${
        active ? "left-full duration-500" : "-left-8 duration-0"
      } ${
        tone === "green"
          ? "top-1/2 size-3.5 -translate-y-1/2 rounded-full bg-[#05b894] shadow-[0_0_12px_rgba(5,184,148,0.75)]"
          : "inset-y-[-1px] w-8 rounded-full bg-gradient-to-r from-transparent via-[#4285f4] to-transparent shadow-[0_0_10px_rgba(66,133,244,0.65)]"
      }`}
    />
  </span>
);

const OfflineFlowCube = ({
  final = false,
  active = false,
  tone = "blue",
}: {
  final?: boolean;
  active?: boolean;
  tone?: "blue" | "green";
}) => {
  const isVerified = final && active;
  const isGreen = tone === "green";

  return (
    <span
      className={`relative block size-[62px] shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transform-none motion-reduce:transition-none ${
        active ? "scale-[1.03]" : "scale-100"
      }`}
    >
      <span
        className={`absolute inset-0 z-10 grid place-items-center border transition-colors duration-300 ${
          isVerified
            ? isGreen
              ? "border-[#048f73] bg-[#05b894] text-white"
              : "border-[#2563eb] bg-[#4285f4] text-white"
            : active
              ? "border-border bg-muted text-muted-foreground dark:border-zinc-400/60 dark:bg-zinc-700 dark:text-zinc-200"
              : "border-border bg-muted text-muted-foreground dark:border-zinc-400/60 dark:bg-zinc-700 dark:text-zinc-300"
        }`}
      >
        {final ? (
          <Icon
            path={mdiCheck}
            className={`size-5 transition-[opacity,transform] duration-300 ${
              active ? "scale-100 opacity-100" : "scale-70 opacity-0"
            }`}
            aria-hidden="true"
          />
        ) : (
          <Icon
            path={mdiMusicNote}
            className={`size-5 transition-[opacity,transform] duration-300 ${
              active ? "scale-100 opacity-100" : "scale-70 opacity-0"
            }`}
            aria-hidden="true"
          />
        )}
      </span>
      <span
        className={`absolute -top-[15px] left-0 h-[15px] w-full origin-bottom -skew-x-[45deg] border transition-colors duration-300 ${
          isVerified
            ? isGreen
              ? "border-[#048f73] bg-[#05b894]"
              : "border-[#3d7ceb] bg-[#63a0ff]"
            : active
              ? "border-border bg-background dark:border-zinc-400/60 dark:bg-zinc-500"
              : "border-border bg-background dark:border-zinc-400/60 dark:bg-zinc-500"
        }`}
      />
      <span
        className={`absolute -right-[15px] top-0 h-full w-[15px] origin-left -skew-y-[45deg] border transition-colors duration-300 ${
          isVerified
            ? isGreen
              ? "border-[#048f73] bg-[#05b894]"
              : "border-[#255bb6] bg-[#2f69cb]"
            : active
              ? "border-border bg-muted dark:border-zinc-400/60 dark:bg-zinc-800"
              : "border-border bg-muted dark:border-zinc-400/60 dark:bg-zinc-800"
        }`}
      />
    </span>
  );
};

const SecurityDialogVisual = ({
  variant,
}: {
  variant: SecurityFeature["dialogVisual"];
}) => {
  const [rating, setRating] = useState(1);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (variant === "ratings") {
      setRating(1);
      const secondHeartTimer = window.setTimeout(() => setRating(2), 250);
      const thirdHeartTimer = window.setTimeout(() => setRating(3), 650);

      return () => {
        window.clearTimeout(secondHeartTimer);
        window.clearTimeout(thirdHeartTimer);
      };
    }

    const events =
      variant === "offline"
        ? [250, 800, 1200, 1700, 2100, 2600]
        : [250, 800, 1350, 1950, 2200];
    const loopDuration = variant === "offline" ? 4000 : 3600;
    let timers: number[] = [];

    const runSequence = () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers = [];
      setStage(0);

      events.forEach((delay, index) => {
        timers.push(window.setTimeout(() => setStage(index + 1), delay));
      });
    };

    runSequence();
    const loop = window.setInterval(runSequence, loopDuration);

    return () => {
      window.clearInterval(loop);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [variant]);

  if (variant === "ratings") {
    return (
      <div
        className="mx-auto mt-6 mb-12 flex items-center justify-center gap-3 sm:gap-[18px]"
        aria-label={`Selected rating: ${rating} out of 5`}
      >
        {Array.from({ length: 5 }, (_, index) => {
          const value = index + 1;
          const isSelected = value <= rating;

          return (
            <button
              key={value}
              type="button"
              aria-label={`Rate ${value} out of 5`}
              onClick={() => setRating(value)}
              className="rounded-full p-1 outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-[#f31285] focus-visible:ring-offset-2"
            >
              <Icon
                path={isSelected ? mdiHeart : mdiHeartOutline}
                className={`size-9 transition-colors sm:size-14 ${
                  isSelected
                    ? "animate-in text-[#f31285] zoom-in-50 duration-300"
                    : "text-muted"
                }`}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === "geolocation") {
    return (
      <div
        className="mx-auto mt-6 mb-10 flex w-full max-w-[620px] flex-col items-center gap-4 px-1 sm:flex-row sm:gap-9"
        aria-hidden="true"
      >
        <Icon
          path={mdiMapMarkerOutline}
          className={`size-10 shrink-0 transition-[color,transform] duration-300 sm:size-[60px] ${
            stage >= 5
              ? "scale-105 text-[#05b894]"
              : "text-muted-foreground/50 dark:text-zinc-400"
          }`}
        />
        <OfflineFlowLine active={stage === 1} tone="green" />
        <OfflineFlowCube active={stage >= 2} tone="green" />
        <OfflineFlowLine active={stage === 3} tone="green" />
        <OfflineFlowCube final active={stage >= 4} tone="green" />
      </div>
    );
  }

  return (
    <div
      className="mx-auto mt-6 mb-10 flex w-full max-w-[680px] flex-col items-center gap-4 px-1 sm:flex-row sm:gap-7"
      aria-hidden="true"
    >
      <Icon
        path={mdiWifiOff}
        className="size-10 shrink-0 text-muted-foreground/50 dark:text-zinc-400 sm:size-[60px]"
      />
      <OfflineFlowLine active={stage === 1} />
      <OfflineFlowCube active={stage >= 2} />
      <OfflineFlowLine active={stage === 3} />
      <span
        className={`relative shrink-0 transition-[color,transform] duration-300 ${
          stage >= 4
            ? "scale-105 text-[#4285f4]"
            : "text-muted-foreground/50 dark:text-zinc-400"
        }`}
      >
        <Icon path={mdiWifi} className="size-10 sm:size-[60px]" />
        <Icon
          path={mdiArrowUpDown}
          className="absolute -right-2 -bottom-1 size-5 text-background sm:size-6"
        />
      </span>
      <OfflineFlowLine active={stage === 5} />
      <OfflineFlowCube final active={stage >= 6} />
    </div>
  );
};

const SecurityFeatureDialog = ({
  open,
  onOpenChange,
  feature,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: SecurityFeature;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent
      showCloseButton={false}
      overlayClassName="bg-black/45 backdrop-blur-[2px]"
      aria-describedby="security-feature-dialog-description"
      className="max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[850px] gap-0 overflow-y-auto bg-popover px-6 py-9 text-popover-foreground shadow-[0_20px_60px_rgba(0,0,0,0.25)] ring-0 sm:max-w-[850px] sm:px-10 sm:py-10"
    >
      <DialogClose asChild>
        <button
          type="button"
          aria-label={`Close ${feature.title} details`}
          className="absolute top-6 right-6 grid size-10 place-items-center rounded-[10px] text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Icon path={mdiClose} className="size-6" aria-hidden="true" />
        </button>
      </DialogClose>

      <SecurityDialogVisual variant={feature.dialogVisual} />

      <DialogTitle
        className={`text-[clamp(20px,2vw,23px)] leading-tight font-bold ${feature.accentClassName}`}
      >
        {feature.dialogTitle}
      </DialogTitle>
      <DialogDescription
        id="security-feature-dialog-description"
        className={`mt-4 text-[clamp(17px,1.8vw,23px)] leading-[1.55] ${feature.accentClassName}`}
      >
        {feature.dialogDescription}
      </DialogDescription>

      <ul className="mt-8 space-y-2 text-[15px] leading-tight text-foreground sm:text-[17px]">
        {feature.dialogBenefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-4">
            <Icon
              path={mdiCheckCircleOutline}
              className="mt-0.5 size-[22px] shrink-0"
              aria-hidden="true"
            />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      <div className="mt-9 flex flex-col items-start gap-4 text-[17px]">
        {feature.dialogLinks.map((link) => {
          return (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 ${feature.linkClassName}`}
            >
              {link.label}
              <Icon
                path={link.iconPath}
                className="size-5"
                aria-hidden="true"
              />
            </a>
          );
        })}
      </div>
    </DialogContent>
  </Dialog>
);

export default function SecurityFraudSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFeatureDialogOpen, setIsFeatureDialogOpen] = useState(false);
  const activeFeature = securityFeatures[activeIndex];

  return (
    <section
      className="bg-background text-left text-foreground"
      aria-labelledby="security-fraud-title"
    >
      <div className="grid gap-7 lg:grid-cols-2 lg:items-center">
        <div className="relative min-h-[400px] overflow-hidden rounded-[8px] bg-muted">
          <Image
            key={activeFeature.image}
            src={activeFeature.image}
            alt=""
            fill
            sizes="(max-width: 1023px) 100vw, 496px"
            className="animate-in object-cover fade-in duration-300"
          />

          <button
            type="button"
            onClick={() => setIsFeatureDialogOpen(true)}
            aria-label={`Open ${activeFeature.title} details`}
            className="absolute bottom-4 left-4 grid size-[60px] place-items-center rounded-full bg-background shadow-[0_8px_20px_rgba(0,0,0,0.18)] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <span className="absolute inset-0 animate-ping rounded-full border border-white/70" />
            <span className="absolute inset-0 animate-ping rounded-full border border-white/70 [animation-delay:800ms]" />
            <Icon
              path={activeFeature.sideIconPath}
              size={1}
              className={`relative z-10 ${activeFeature.accentClassName}`}
            />
          </button>
        </div>

        <div className="min-w-0 mb-auto">
          <div className="overflow-hidden rounded-[8px] border border-border">
            {securityFeatures.map((feature, index) => {
              const isActive = activeIndex === index;

              return (
                <article
                  key={feature.title}
                  className="border-b border-border last:border-b-0"
                >
                  <button
                    type="button"
                    className="flex w-full items-center gap-2.5 bg-card px-5 py-[15px] text-left transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
                    aria-expanded={isActive}
                    aria-controls={`security-feature-${index}`}
                    onClick={() => setActiveIndex(index)}
                  >
                    <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-primary-foreground">
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1 text-[14px] font-semibold text-card-foreground">
                      {feature.title}
                    </span>
                    <Icon
                      path={mdiChevronDown}
                      className={`size-4 shrink-0 text-card-foreground transition-transform duration-300 ${
                        isActive ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  <div
                    id={`security-feature-${index}`}
                    className={`grid bg-muted/40 transition-[grid-template-rows] duration-300 ease-out ${
                      isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 py-[15px]">
                        <div className="mb-3 flex items-center gap-2 lg:hidden">
                          <Icon
                            path={feature.iconPath}
                            className={`size-4 ${feature.accentClassName}`}
                            aria-hidden="true"
                          />
                          <span
                            className={`text-[11px] font-semibold uppercase ${feature.accentClassName}`}
                          >
                            Verified protection
                          </span>
                        </div>
                        <p className="text-[13px] leading-[1.6] text-foreground">
                          {feature.description}
                        </p>

                        <div className="mt-6 mb-2 flex flex-wrap gap-x-4 gap-y-2">
                          {feature.links.map((link) => {
                            return (
                              <a
                                key={link.label}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[13px] text-primary underline-offset-4 hover:text-primary/80 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                              >
                                {link.label}
                                <Icon
                                  path={link.iconPath}
                                  className="size-3.5"
                                  aria-hidden="true"
                                />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <SecurityFeatureDialog
        open={isFeatureDialogOpen}
        onOpenChange={setIsFeatureDialogOpen}
        feature={activeFeature}
      />
    </section>
  );
}
