"use client";

import { FC } from "react";
import { FaRegBell } from "react-icons/fa";
import { IoIosClose, IoIosRefresh } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
              <button
                type="button"
                className="text-primary cursor-pointer mb-[40px] md:mb-0 relative outline-none"
                aria-label="Open notifications"
              >
                <FaRegBell size={27} />
                {!allNotificationsRead && !hasOpenedNotifications && (
                  <span className="w-2 h-2 bg-[#ffa500] absolute top-0 right-0 rounded-full" />
                )}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              id="notification-sidebar"
              align="end"
              sideOffset={10}
              className="w-[350px] h-[calc(100vh-72px)] overflow-hidden bg-white p-0 shadow-lg z-50 border border-gray-200 rounded-[8px] flex flex-col scrollbar-hide scrollbar-hide::-webkit-scrollbar"
            >
              <div className="sticky top-0 z-50">
                <div className="flex items-center text-[#000000] justify-between p-4 border-b bg-[#f4faff]">
                  <div className="flex items-center gap-[20px] text-[16px]">
                    <p
                      className={`cursor-pointer ${
                        activeMainTab === "updates"
                          ? "text-[#000000] font-[500]"
                          : "text-[#767676] font-[400]"
                      }`}
                      onClick={() => handleMainTabClick("updates")}
                    >
                      Updates
                    </p>
                    <p
                      className={`cursor-pointer ${
                        activeMainTab === "drops"
                          ? "text-[#000000] font-[500]"
                          : "text-[#767676] font-[400]"
                      }`}
                      onClick={() => handleMainTabClick("drops")}
                    >
                      Drops
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button
                      className="text-[#0e3531] text-[16px] w-8 h-8 flex items-center justify-center rounded-full border bg-white"
                      onClick={() =>
                        setNotificationScrolled(!notificationScrolled)
                      }
                    >
                      <IoIosRefresh size={16} />
                    </button>
                    {!!notificationLoading && (
                      <div className="h-4 w-4 animate-spin bg-none border-4 border-t-transparent border-blue-500 rounded-full" />
                    )}
                  </div>
                  <button
                    className="text-[#0e3531] text-[16px] w-8 h-8 flex items-center justify-center rounded-full border bg-white"
                    onClick={() => setNotificationsOpen(false)}
                  >
                    <IoIosClose size={27} />
                  </button>
                </div>

                <div className="flex justify-between py-4 px-4 border-b bg-white">
                  {activeMainTab === "updates" && (
                    <>
                      <button
                        className={`text-[16px] ${
                          activeInnerTab === "campaign"
                            ? "text-[#0875d3] font-[500]"
                            : "text-[#000000] font-[400]"
                        }`}
                        onClick={() => handleInnerTabClick("campaign")}
                      >
                        Campaign
                      </button>
                      <button
                        className={`text-[16px] ${
                          activeInnerTab === "milestones"
                            ? "text-[#ff5700] font-[500]"
                            : "text-[#000000] font-[400]"
                        }`}
                        onClick={() => handleInnerTabClick("milestones")}
                      >
                        Milestones
                      </button>
                      <button
                        className={`text-[16px] ${
                          activeInnerTab === "security"
                            ? "text-[#767676] font-[500]"
                            : "text-[#000000] font-[400]"
                        }`}
                        onClick={() => handleInnerTabClick("security")}
                      >
                        Security
                      </button>
                    </>
                  )}
                  {activeMainTab === "drops" && (
                    <>
                      <button
                        className={`text-[16px] ${
                          activeInnerTab === "assets"
                            ? "text-[#01a733] font-[500]"
                            : "text-[#000000] font-[400]"
                        }`}
                        onClick={() => handleInnerTabClick("assets")}
                      >
                        Assets
                      </button>
                      <button
                        className={`text-[16px] ${
                          activeInnerTab === "payment"
                            ? "text-[#c304f1] font-[500]"
                            : "text-[#000000] font-[400]"
                        }`}
                        onClick={() => handleInnerTabClick("payment")}
                      >
                        Payments
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="text-sm text-gray-600 px-4 py-4 flex-1 overflow-y-auto scrollbar-hide scrollbar-hide::-webkit-scrollbar">
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
                {activeMainTab === "drops" && activeInnerTab === "payment" && (
                  <PaymentsNotification
                    notification={notifications.payments}
                    notificationScrolled={notificationScrolled}
                    setNotificationScrolled={setNotificationScrolled}
                  />
                )}
              </div>
              {activeMainTab === "drops" && activeInnerTab === "assets" && (
                <div className="bg-black px-4 py-[4px] rounded text-center mx-4 mb-4">
                  <button
                    className="text-white font-medium text-[14px] w-full font-SansFlex"
                    onClick={() => router.push("/drops")}
                  >
                    View All Assets
                  </button>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
