import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getNotifications, notificationQueryKey } from "@/services";
import { groupNotifications } from "@/types/notifications";
import { useAuth } from "@/context/auth-session";

export type NotificationMainTab = "updates" | "drops";
export type NotificationInnerTab =
  | "campaign"
  | "milestones"
  | "security"
  | "others"
  | "assets"
  | "payment";

const isMainTab = (value: string): value is NotificationMainTab =>
  value === "updates" || value === "drops";

const isInnerTab = (value: string): value is NotificationInnerTab =>
  [
    "campaign",
    "milestones",
    "security",
    "others",
    "assets",
    "payment",
  ].includes(value);

export const useTopNav = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const {
    data: notificationItems = [],
    isLoading,
    isError: notificationError,
    refetch: refetchNotifications,
  } = useQuery({
    queryKey: notificationQueryKey,
    queryFn: getNotifications,
    enabled: isAuthenticated && !isAuthLoading,
    staleTime: 60_000,
  });
  const notificationLoading = isAuthLoading || isLoading;

  const retryNotifications = useCallback(() => {
    void refetchNotifications();
  }, [refetchNotifications]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMainTab, setActiveMainTab] =
    useState<NotificationMainTab>("updates");
  const [activeInnerTab, setActiveInnerTab] =
    useState<NotificationInnerTab>("campaign");
  const [hasOpenedNotifications, setHasOpenedNotifications] = useState(false);
  const knownUnreadIds = useRef<Set<number>>(new Set());

  const notifications = useMemo(
    () => groupNotifications(notificationItems),
    [notificationItems],
  );

  const allNotifications = useMemo(
    () => Object.values(notifications).flat(),
    [notifications],
  );

  const allNotificationsRead = allNotifications.every(
    (notification) => notification.read !== false,
  );

  const setNotificationsOpen = (open: boolean) => {
    setIsSidebarOpen(open);
    if (open) setHasOpenedNotifications(true);
  };

  const handleMainTabClick = (tab: string) => {
    if (!isMainTab(tab)) return;

    setActiveMainTab(tab);
    setActiveInnerTab(tab === "updates" ? "campaign" : "assets");
  };

  const handleInnerTabClick = (tab: string) => {
    if (isInnerTab(tab)) setActiveInnerTab(tab);
  };

  useEffect(() => {
    const unreadIds = allNotifications
      .filter((notification) => notification.read === false)
      .map((notification) => notification.id);
    const hasNewUnread = unreadIds.some(
      (id) => !knownUnreadIds.current.has(id),
    );

    if (hasNewUnread) setHasOpenedNotifications(false);
    unreadIds.forEach((id) => knownUnreadIds.current.add(id));
  }, [allNotifications]);

  useEffect(() => {
    if (!isSidebarOpen) return;

    const handleScroll = (event: Event) => {
      const target = event.target as HTMLElement;
      const sidebarEl = document.getElementById("notification-sidebar");
      if (!sidebarEl?.contains(target)) setIsSidebarOpen(false);
    };

    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [isSidebarOpen]);

  return {
    notifications,
    notificationLoading,
    notificationError,
    retryNotifications,
    allNotificationsRead,
    isSidebarOpen,
    activeMainTab,
    activeInnerTab,
    setNotificationsOpen,
    handleMainTabClick,
    handleInnerTabClick,
    hasOpenedNotifications,
  };
};
