import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getLoggedInUser } from "@/services";

export const useTopNav = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any>({
    campaigns: [],
    milestones: [],
    security: [],
    assets: [],
    payments: [],
  });
  const [notificationScrolled, setNotificationScrolled] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [allNotificationsRead, setAllNotificationsRead] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState("updates");
  const [activeInnerTab, setActiveInnerTab] = useState("campaign");
  const [hasOpenedNotifications, setHasOpenedNotifications] = useState(false);
  const [knownUnreadIds, setKnownUnreadIds] = useState<Set<number>>(new Set());

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const next = !prev;
      if (next) {
        setHasOpenedNotifications(true);
      }
      return next;
    });
  };

  const handleMainTabClick = (tab: string) => {
    setActiveMainTab(tab);
    setActiveInnerTab(tab === "updates" ? "campaign" : "assets");
  };

  const handleInnerTabClick = (tab: string) => {
    setActiveInnerTab(tab);
  };

  const triggerRefresh = () => {
    setNotificationScrolled((prev) => !prev);
  };

  useEffect(() => {
    setNotificationLoading(true);
    getLoggedInUser().then((user) => {
      const groupedNotifications = user.notifications.reduce(
        (acc: any, notification: any) => {
          const type = notification.type.toLowerCase();
          return {
            ...acc,
            [type]: [...(acc[type] || []), notification],
          };
        },
        {
          campaigns: [],
          milestones: [],
          security: [],
          assets: [],
          payments: [],
        },
      );

      setNotifications(groupedNotifications);
      setNotificationLoading(false);
    });
  }, [notificationScrolled]);

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
    toggleSidebar,
    handleMainTabClick,
    handleInnerTabClick,
    triggerRefresh,
    setNotificationScrolled,
    hasOpenedNotifications,
  };
};
