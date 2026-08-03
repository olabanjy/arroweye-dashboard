"use client";

import { FC } from "react";
import { Bell, LoaderCircle, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CampaignNotifications from "./campaigns/notifications/campaigns/CampaignNotifications";
import MileStonesNotification from "./campaigns/notifications/milestones/MileStonesNotification";
import SecurityNotification from "./campaigns/notifications/security/SecurityNotification";
import AssetsNotification from "./campaigns/notifications/assets/AssetsNotification";
import PaymentsNotification from "./campaigns/notifications/payments/PaymentsNotification";
import { useTopNav } from "@/hooks/use-top-nav";

const TopNav: FC = () => {
  const {
    router,
    notifications,
    notificationScrolled,
    notificationLoading,
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
    <div className="relative">
      <div className="h-[10px] text-white flex items-center justify-between px-[10px] lg:px-[40px] pt-[50px] relative">
        <div className="text-lg font-semibold opacity-0">Dashboard</div>
        <div className="relative">
          <DropdownMenu
            open={isSidebarOpen}
            onOpenChange={setNotificationsOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="relative mb-[40px] text-foreground md:mb-0"
                aria-label="Open notifications"
              >
                <Bell />
                {!allNotificationsRead && !hasOpenedNotifications && (
                  <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-orange-500 ring-2 ring-background" />
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              id="notification-sidebar"
              align="end"
              sideOffset={10}
              className="z-50 flex h-[min(calc(100vh-72px),760px)] w-[calc(100vw-2rem)] max-w-[380px] flex-col overflow-hidden rounded-[8px] border-zinc-200 bg-white p-0 text-zinc-950 shadow-lg dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            >
              <div className="shrink-0">
                <div className="flex items-center justify-between gap-3 bg-muted/40 p-4">
                  <DropdownMenuLabel className="px-0 py-0 text-sm font-semibold text-foreground">
                    Notifications
                  </DropdownMenuLabel>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      className="rounded-[6px] border-zinc-300 bg-white text-zinc-950 hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                      onClick={() =>
                        setNotificationScrolled(!notificationScrolled)
                      }
                      aria-label="Refresh notifications"
                    >
                      {notificationLoading ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        <RefreshCw />
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="rounded-[6px] text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                      onClick={() => setNotificationsOpen(false)}
                      aria-label="Close notifications"
                    >
                      <X />
                    </Button>
                  </div>
                </div>

                <Tabs
                  value={activeMainTab}
                  onValueChange={handleMainTabClick}
                  className="border-y border-border px-4 py-3"
                >
                  <TabsList className="grid h-9 w-full grid-cols-2 rounded-[6px] bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    <TabsTrigger
                      value="updates"
                      className="h-7 rounded-[4px] text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-900 dark:data-[state=active]:text-zinc-100"
                    >
                      Updates
                    </TabsTrigger>
                    <TabsTrigger
                      value="drops"
                      className="h-7 rounded-[4px] text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-900 dark:data-[state=active]:text-zinc-100"
                    >
                      Drops
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <Tabs
                  value={activeInnerTab}
                  onValueChange={handleInnerTabClick}
                  className="px-4 py-3"
                >
                  {activeMainTab === "updates" && (
                    <TabsList className="grid h-8 w-full grid-cols-3 bg-transparent p-0 text-muted-foreground">
                      <TabsTrigger
                        value="campaign"
                        className="h-8 rounded-none border-b-2 border-transparent px-1 text-xs font-medium data-[state=active]:border-zinc-950 data-[state=active]:text-zinc-950 dark:data-[state=active]:border-zinc-100 dark:data-[state=active]:bg-transparent dark:data-[state=active]:text-zinc-100"
                      >
                        Campaign
                      </TabsTrigger>
                      <TabsTrigger
                        value="milestones"
                        className="h-8 rounded-none border-b-2 border-transparent px-1 text-xs font-medium data-[state=active]:border-zinc-950 data-[state=active]:text-zinc-950 dark:data-[state=active]:border-zinc-100 dark:data-[state=active]:bg-transparent dark:data-[state=active]:text-zinc-100"
                      >
                        Milestones
                      </TabsTrigger>
                      <TabsTrigger
                        value="security"
                        className="h-8 rounded-none border-b-2 border-transparent px-1 text-xs font-medium data-[state=active]:border-zinc-950 data-[state=active]:text-zinc-950 dark:data-[state=active]:border-zinc-100 dark:data-[state=active]:bg-transparent dark:data-[state=active]:text-zinc-100"
                      >
                        Security
                      </TabsTrigger>
                    </TabsList>
                  )}
                  {activeMainTab === "drops" && (
                    <TabsList className="grid h-8 w-full grid-cols-2 bg-transparent p-0 text-muted-foreground">
                      <TabsTrigger
                        value="assets"
                        className="h-8 rounded-none border-b-2 border-transparent text-xs font-medium data-[state=active]:border-zinc-950 data-[state=active]:text-zinc-950 dark:data-[state=active]:border-zinc-100 dark:data-[state=active]:bg-transparent dark:data-[state=active]:text-zinc-100"
                      >
                        Assets
                      </TabsTrigger>
                      <TabsTrigger
                        value="payment"
                        className="h-8 rounded-none border-b-2 border-transparent text-xs font-medium data-[state=active]:border-zinc-950 data-[state=active]:text-zinc-950 dark:data-[state=active]:border-zinc-100 dark:data-[state=active]:bg-transparent dark:data-[state=active]:text-zinc-100"
                      >
                        Payments
                      </TabsTrigger>
                    </TabsList>
                  )}
                </Tabs>
                <Separator />
              </div>

              <ScrollArea className="min-h-0 flex-1">
                <div className="px-4 py-4 text-sm text-muted-foreground">
                  {activeMainTab === "updates" &&
                    activeInnerTab === "campaign" && (
                      <CampaignNotifications
                        notification={notifications.campaigns}
                        notificationScrolled={notificationScrolled}
                        setNotificationScrolled={setNotificationScrolled}
                      />
                    )}
                  {activeMainTab === "updates" &&
                    activeInnerTab === "milestones" && (
                      <MileStonesNotification
                        notification={notifications.milestones}
                        notificationScrolled={notificationScrolled}
                        setNotificationScrolled={setNotificationScrolled}
                      />
                    )}
                  {activeMainTab === "updates" &&
                    activeInnerTab === "security" && (
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
                  {activeMainTab === "drops" &&
                    activeInnerTab === "payment" && (
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
        </div>
      </div>
    </div>
  );
};

export default TopNav;
