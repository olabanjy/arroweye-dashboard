"use client";

import { Bell, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CampaignNotifications from "./campaigns/notifications/campaigns/CampaignNotifications";
import MileStonesNotification from "./campaigns/notifications/milestones/MileStonesNotification";
import SecurityNotification from "./campaigns/notifications/security/SecurityNotification";
import AssetsNotification from "./campaigns/notifications/assets/AssetsNotification";
import PaymentsNotification from "./campaigns/notifications/payments/PaymentsNotification";
import { useTopNav } from "@/hooks/use-top-nav";

type NotificationsMenuProps = {
  triggerClassName?: string;
  triggerTabIndex?: number;
};

const NotificationsMenu = ({
  triggerClassName,
  triggerTabIndex,
}: NotificationsMenuProps) => {
  const router = useRouter();
  const {
    notifications,
    notificationScrolled,
    allNotificationsRead,
    isSidebarOpen,
    activeMainTab,
    activeInnerTab,
    setNotificationsOpen,
    handleMainTabClick,
    handleInnerTabClick,
    setNotificationScrolled,
    hasOpenedNotifications,
  } = useTopNav();

  return (
    <DropdownMenu open={isSidebarOpen} onOpenChange={setNotificationsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={triggerClassName}
          aria-label="Open notifications"
          tabIndex={triggerTabIndex}
        >
          <Bell className="size-[18px]!" />
          {!allNotificationsRead && !hasOpenedNotifications && (
            <span className="absolute right-1 top-1 size-2 rounded-full bg-orange-500 ring-2 ring-background" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        id="notification-sidebar"
        align="end"
        sideOffset={10}
        className="z-50 flex h-[min(calc(100vh-72px),760px)] w-[calc(100vw-2rem)] max-w-[380px] flex-col overflow-hidden rounded-[16px] border border-neutral-100 bg-white p-0 text-zinc-950 shadow-xl dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
      >
        <div className="shrink-0">
          <Tabs
            value={activeMainTab}
            onValueChange={handleMainTabClick}
            className="w-full"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 bg-[#f8fafc] px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
              <TabsList className="flex items-center gap-6 bg-transparent p-0">
                <TabsTrigger
                  value="updates"
                  className="bg-transparent p-0 text-sm font-bold text-neutral-400 data-[state=active]:bg-transparent data-[state=active]:text-neutral-900 data-[state=active]:shadow-none dark:data-[state=active]:text-white cursor-pointer transition-colors hover:text-neutral-900 dark:hover:text-white"
                >
                  Updates
                </TabsTrigger>
                <TabsTrigger
                  value="drops"
                  className="bg-transparent p-0 text-sm font-bold text-neutral-400 data-[state=active]:bg-transparent data-[state=active]:text-neutral-900 data-[state=active]:shadow-none dark:data-[state=active]:text-white cursor-pointer transition-colors hover:text-neutral-900 dark:hover:text-white"
                >
                  Drops
                </TabsTrigger>
              </TabsList>
              <button
                type="button"
                onClick={() => setNotificationsOpen(false)}
                className="flex size-6 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-neutral-400 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                aria-label="Close notifications"
              >
                <X size={12} />
              </button>
            </div>
          </Tabs>

          <Tabs
            value={activeInnerTab}
            onValueChange={handleInnerTabClick}
            className="w-full border-b border-neutral-100 bg-white dark:border-zinc-800 dark:bg-zinc-950"
          >
            {activeMainTab === "updates" && (
              <TabsList className="flex items-center gap-8 bg-transparent px-6 py-4">
                <TabsTrigger
                  value="campaign"
                  className="bg-transparent p-0 text-sm font-bold text-neutral-400 data-[state=active]:bg-transparent data-[state=active]:text-neutral-900 data-[state=active]:shadow-none dark:data-[state=active]:text-white cursor-pointer transition-colors hover:text-neutral-900 dark:hover:text-white"
                >
                  Campaigns
                </TabsTrigger>
                <TabsTrigger
                  value="milestones"
                  className="bg-transparent p-0 text-sm font-bold text-neutral-400 data-[state=active]:bg-transparent data-[state=active]:text-neutral-900 data-[state=active]:shadow-none dark:data-[state=active]:text-white cursor-pointer transition-colors hover:text-neutral-900 dark:hover:text-white"
                >
                  Milestones
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="bg-transparent p-0 text-sm font-bold text-neutral-400 data-[state=active]:bg-transparent data-[state=active]:text-neutral-900 data-[state=active]:shadow-none dark:data-[state=active]:text-white cursor-pointer transition-colors hover:text-neutral-900 dark:hover:text-white"
                >
                  Security
                </TabsTrigger>
              </TabsList>
            )}
            {activeMainTab === "drops" && (
              <TabsList className="flex items-center gap-8 bg-transparent px-6 py-4">
                <TabsTrigger
                  value="assets"
                  className="bg-transparent p-0 text-sm font-bold text-neutral-400 data-[state=active]:bg-transparent data-[state=active]:text-neutral-900 data-[state=active]:shadow-none dark:data-[state=active]:text-white cursor-pointer transition-colors hover:text-neutral-900 dark:hover:text-white"
                >
                  Assets
                </TabsTrigger>
                <TabsTrigger
                  value="payment"
                  className="bg-transparent p-0 text-sm font-bold text-neutral-400 data-[state=active]:bg-transparent data-[state=active]:text-neutral-900 data-[state=active]:shadow-none dark:data-[state=active]:text-white cursor-pointer transition-colors hover:text-neutral-900 dark:hover:text-white"
                >
                  Payments
                </TabsTrigger>
              </TabsList>
            )}
          </Tabs>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <div className="px-4 py-4 text-sm text-muted-foreground">
            {activeMainTab === "updates" && activeInnerTab === "campaign" && (
              <CampaignNotifications
                notification={notifications.campaigns}
                notificationScrolled={notificationScrolled}
                setNotificationScrolled={setNotificationScrolled}
              />
            )}
            {activeMainTab === "updates" && activeInnerTab === "milestones" && (
              <MileStonesNotification
                notification={notifications.milestones}
                notificationScrolled={notificationScrolled}
                setNotificationScrolled={setNotificationScrolled}
              />
            )}
            {activeMainTab === "updates" && activeInnerTab === "security" && (
              <SecurityNotification
                notification={notifications.security}
                notificationScrolled={notificationScrolled}
                setNotificationScrolled={setNotificationScrolled}
              />
            )}
            {activeMainTab === "drops" && activeInnerTab === "assets" && (
              <AssetsNotification
                notification={notifications.assets}
                notificationScrolled={notificationScrolled}
                setNotificationScrolled={setNotificationScrolled}
              />
            )}
            {activeMainTab === "drops" && activeInnerTab === "payment" && (
              <PaymentsNotification
                notification={notifications.payments}
                notificationScrolled={notificationScrolled}
                setNotificationScrolled={setNotificationScrolled}
              />
            )}
          </div>
        </ScrollArea>
        {activeMainTab === "drops" && activeInnerTab === "assets" && (
          <>
            <DropdownMenuSeparator />
            <div className="px-4 py-3">
              <Button
                type="button"
                className="h-9 w-full rounded-[6px] bg-zinc-900 text-white hover:bg-orange-500 dark:bg-zinc-900 dark:text-white"
                onClick={() => router.push("/drops")}
              >
                View All Assets
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsMenu;
