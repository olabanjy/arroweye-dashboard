import type { ComponentType } from "react";
import {
  mdiCash,
  mdiFolderOpenOutline,
  mdiPlayCircleOutline,
  mdiShieldCheckOutline,
} from "@mdi/js";
import { Bell, FileText } from "lucide-react";
import { CgProfile } from "react-icons/cg";
import { FaPlayCircle, FaRegFolderOpen } from "react-icons/fa";
import { GiMusicalNotes } from "react-icons/gi";
import { MdStars } from "react-icons/md";
import type { NotificationGroupKey } from "@/types/notifications";

type NotificationIconComponent = ComponentType<{ className?: string }>;

export type NotificationIconConfig = {
  Icon: NotificationIconComponent;
  containerClassName: string;
  ignoreApiIcon?: boolean;
};

export type NotificationIconKey = NotificationGroupKey | "airplay";

// Edit this table to change the default icon and color for each notification kind.
export const notificationIconConfig = {
  assets: {
    Icon: FaRegFolderOpen,
    containerClassName: "bg-[#e6ff99] text-[#01a733]",
  },
  campaigns: {
    Icon: FaPlayCircle,
    containerClassName: "bg-amber-200 text-[#947c01]",
  },
  airplay: {
    Icon: GiMusicalNotes,
    containerClassName: "bg-[#DD2E49] text-white",
    ignoreApiIcon: true,
  },
  security: {
    Icon: CgProfile,
    containerClassName: "bg-slate-200 text-black",
  },
  milestones: {
    Icon: MdStars,
    containerClassName: "bg-orange-100 text-orange-500",
  },
  payments: {
    Icon: FileText,
    containerClassName: "bg-violet-100 text-violet-600 dark:bg-violet-950",
  },
  others: {
    Icon: Bell,
    containerClassName: "bg-sky-100 text-sky-600 dark:bg-sky-950",
  },
} satisfies Record<NotificationIconKey, NotificationIconConfig>;

// Add content-based exceptions here. The first matching rule wins.
export const campaignIconRules = [
  {
    matches: (message: string) => /\bwas played by\b/i.test(message),
    config: notificationIconConfig.airplay,
  },
];

export const getCampaignIconConfig = (
  message: string,
): NotificationIconConfig =>
  campaignIconRules.find((rule) => rule.matches(message))?.config ??
  notificationIconConfig.campaigns;

// Maps icon class names returned by the API to icons rendered by this app.
export const mdiNotificationIcons = {
  "mdi-album": mdiPlayCircleOutline,
  "mdi-cash": mdiCash,
  "mdi-folder-open-outline": mdiFolderOpenOutline,
  "mdi-shield-check-outline": mdiShieldCheckOutline,
};

export type MdiNotificationIconName = keyof typeof mdiNotificationIcons;

const isMdiNotificationIconName = (
  value: string,
): value is MdiNotificationIconName => value in mdiNotificationIcons;

export const getMdiNotificationIcon = (value?: unknown) => {
  if (typeof value !== "string" || !value.trim()) return undefined;

  const parts = value.trim().split(/\s+/);
  const name = parts.find((part) => part.startsWith("mdi-"));

  if (!name || !isMdiNotificationIconName(name)) return undefined;

  return {
    name,
    path: mdiNotificationIcons[name],
    backgroundColor: parts.find((part) => /^#[0-9a-f]{3,8}$/i.test(part)),
  };
};

export const hasMdiNotificationIcon = (
  value: unknown,
  name: MdiNotificationIconName,
) => getMdiNotificationIcon(value)?.name === name;

export const isNotificationIconUrl = (value: unknown): value is string => {
  if (typeof value !== "string") return false;

  const icon = value.trim();
  if (!icon) return false;

  return (
    icon.startsWith("http://") ||
    icon.startsWith("https://") ||
    icon.startsWith("data:image/") ||
    icon.startsWith("blob:") ||
    icon.startsWith("/") ||
    icon.includes("/") ||
    /\.[a-z0-9]{2,5}(?:[?#]|$)/i.test(icon)
  );
};
