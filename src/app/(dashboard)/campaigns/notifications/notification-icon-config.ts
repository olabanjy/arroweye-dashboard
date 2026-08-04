import type { ComponentType } from "react";
import {
  mdiCash,
  mdiFolderOpenOutline,
  mdiPlayCircleOutline,
  mdiShieldCheckOutline,
} from "@mdi/js";
import { FileText } from "lucide-react";
import { CgProfile } from "react-icons/cg";
import { FaPlayCircle, FaRegFolderOpen } from "react-icons/fa";
import { GiMusicalNotes } from "react-icons/gi";
import { MdStars } from "react-icons/md";

type NotificationIconComponent = ComponentType<{ className?: string }>;

export type NotificationIconConfig = {
  Icon: NotificationIconComponent;
  containerClassName: string;
  ignoreApiIcon?: boolean;
};

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
    containerClassName:
      "bg-violet-100 text-violet-600 dark:bg-violet-950",
  },
} satisfies Record<string, NotificationIconConfig>;

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
export const mdiNotificationIcons: Record<string, string> = {
  "mdi-album": mdiPlayCircleOutline,
  "mdi-cash": mdiCash,
  "mdi-folder-open-outline": mdiFolderOpenOutline,
  "mdi-shield-check-outline": mdiShieldCheckOutline,
};
