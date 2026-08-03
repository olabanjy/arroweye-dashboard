import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getLoggedInUser } from "@/services";

const notificationTypeAliases: Record<string, string> = {
  campaign: "campaigns",
  campaigns: "campaigns",
  milestone: "milestones",
  milestones: "milestones",
  security: "security",
  drop: "assets",
  drops: "assets",
  asset: "assets",
  assets: "assets",
  payment: "payments",
  payments: "payments",
};

const normalizeNotificationType = (type: unknown) => {
  const normalizedType = String(type ?? "").trim().toLowerCase();
  return notificationTypeAliases[normalizedType] ?? normalizedType;
};

export const useTopNav = () => {
  const router = useRouter();
  const {
    data: loggedInUser,
    isFetching: notificationLoading,
    refetch: refetchNotifications,
  } = useQuery<any>({
    queryKey: ["user", "notifications"],
    queryFn: getLoggedInUser,
    staleTime: 60_000,
  });
  const [notificationScrolled, setNotificationScrolled] = useState(false);
  const [allNotificationsRead, setAllNotificationsRead] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState("updates");
  const [activeInnerTab, setActiveInnerTab] = useState("campaign");
  const [hasOpenedNotifications, setHasOpenedNotifications] = useState(false);
  const [knownUnreadIds, setKnownUnreadIds] = useState<Set<number>>(new Set());

  const notifications = useMemo(
    () =>
      (loggedInUser?.notifications ?? []).reduce(
        (grouped: any, notification: any) => {
          const type = normalizeNotificationType(notification.type);

          if (!type) return grouped;

          grouped[type] = [...(grouped[type] || []), notification];
          return grouped;
        },
        {
          campaigns: [],
          milestones: [],
          security: [],
          assets: [],
          payments: [],
        },
      ),
    [loggedInUser],
  );

  const refreshNotifications = useCallback<Dispatch<SetStateAction<boolean>>>(
    (value) => {
      setNotificationScrolled(value);
      void refetchNotifications();
    },
    [refetchNotifications],
  );

  const setNotificationsOpen = (open: boolean) => {
    setIsSidebarOpen(open);

    if (open) {
      setHasOpenedNotifications(true);
    }
  };

  const toggleSidebar = () => {
    setNotificationsOpen(!isSidebarOpen);
  };

  const handleMainTabClick = (tab: string) => {
    setActiveMainTab(tab);
    setActiveInnerTab(tab === "updates" ? "campaign" : "assets");
  };

  const handleInnerTabClick = (tab: string) => {
    setActiveInnerTab(tab);
  };

  const triggerRefresh = () => {
    refreshNotifications((prev) => !prev);
  };

  const areAllItemsReadInAllArrays = (notification: any): boolean => {
    if (!notification) {
      return true;
    }

    const arrayKeys = Object.keys(notification).filter(
      (key) => Array.isArray(notification[key]) && notification[key].length > 0,
    );

    if (arrayKeys.length === 0) {
      return true;
    }

    for (const key of arrayKeys) {
      const array = notification[key];
      const hasReadableItems = array.some((item: any) => "read" in item);

      if (hasReadableItems) {
        const allRead = array.every((item: any) => {
          return !("read" in item) || item.read === true;
        });

        if (!allRead) {
          return false;
        }
      }
    }

    return true;
  };

  const getUnreadNotificationIds = (notificationObj: any): Set<number> => {
    const ids = new Set<number>();
    if (!notificationObj) return ids;
    Object.keys(notificationObj).forEach((key) => {
      const array = notificationObj[key];
      if (Array.isArray(array)) {
        array.forEach((item: any) => {
          if ("read" in item && item.read === false) {
            ids.add(item.id);
          }
        });
      }
    });
    return ids;
  };

  useEffect(() => {
    const unreadIds = getUnreadNotificationIds(notifications);
    const hasNewUnread = Array.from(unreadIds).some(
      (id) => !knownUnreadIds.has(id),
    );

    if (hasNewUnread) {
      setHasOpenedNotifications(false);
      setKnownUnreadIds((prev) => {
        const next = new Set(prev);
        unreadIds.forEach((id) => next.add(id));
        return next;
      });
    }

    const allRead = areAllItemsReadInAllArrays(notifications);
    setAllNotificationsRead(allRead);
  }, [notifications]);

  useEffect(() => {
    if (!isSidebarOpen) return;

    const handleScroll = (event: Event) => {
      const target = event.target as HTMLElement;
      const sidebarEl = document.getElementById("notification-sidebar");
      if (sidebarEl && sidebarEl.contains(target)) {
        return;
      }
      setIsSidebarOpen(false);
    };

    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isSidebarOpen]);

  return {
    router,
    notifications,
    notificationScrolled,
    notificationLoading,
    allNotificationsRead,
    isSidebarOpen,
    activeMainTab,
    activeInnerTab,
    setNotificationsOpen,
    toggleSidebar,
    handleMainTabClick,
    handleInnerTabClick,
    triggerRefresh,
    setNotificationScrolled: refreshNotifications,
    hasOpenedNotifications,
  };
};
