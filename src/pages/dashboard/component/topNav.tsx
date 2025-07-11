import { FC, useEffect, useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { IoIosClose, IoIosRefresh } from "react-icons/io";
import CampaignNotifications from "./campaigns/CampaignNotifications";
import MileStonesNotification from "./milestones/MileStonesNotification";
import SecurityNotification from "./security/SecurityNotification";
import AssetsNotification from "./assets/AssetsNotification";
import PaymentsNotification from "./payments/PaymentsNotification";
import { getLoggedInUser } from "@/services/api";
import { useRouter } from "next/router";

const TopNav: FC = () => {
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMainTabClick = (tab: string) => {
    setActiveMainTab(tab);
    setActiveInnerTab(tab === "updates" ? "campaign" : "assets");
  };

  const handleInnerTabClick = (tab: string) => {
    setActiveInnerTab(tab);
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
        }
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
      (key) => Array.isArray(notification[key]) && notification[key].length > 0
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

  useEffect(() => {
    console.log("NOTIFFS", notifications);
    const allRead = areAllItemsReadInAllArrays(notifications);
    setAllNotificationsRead(allRead);
    console.log("ALL READ", allRead);
  }, [notifications]);

  return (
    <div className="relative">
      <div className="h-[10px]  text-white flex items-center justify-between px-[10px] lg:px-[40px] pt-[50px] relative">
        <div className="text-lg font-semibold opacity-0">Dashboard</div>
        <div className="relative">
          <div
            className="text-black cursor-pointer mb-[40px] md:mb-0 relative"
            onClick={toggleSidebar}
          >
            <FaRegBell size={27} />
            {!allNotificationsRead && (
              <div className="w-2 h-2 bg-[#ffa500] absolute top-0 right-0 rounded-full" />
            )}
          </div>

          {isSidebarOpen && (
            <div className=" ">
              <div className="absolute top-[35px] right-0 w-[350px] h-screen bg-white shadow-lg z-50 border border-gray-200 rounded-[8px] flex flex-col scrollbar-hide scrollbar-hide::-webkit-scrollbar">
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
                    </div>{" "}
                    <div className="flex items-center">
                      <button
                        className="text-[#0e3531] text-[16px] w-8 h-8 flex items-center justify-center rounded-full border bg-white"
                        onClick={() =>
                          setNotificationScrolled(!notificationScrolled)
                        }
                      >
                        <IoIosRefresh size={16} />
                      </button>{" "}
                      {!!notificationLoading && (
                        <div className="h-4 w-4 animate-spin bg-none border-4 border-t-transparent border-blue-500 rounded-full" />
                      )}
                    </div>
                    <button
                      className="text-[#0e3531] text-[16px] w-8 h-8 flex items-center justify-center rounded-full border bg-white"
                      onClick={toggleSidebar}
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
                      <div>
                        <CampaignNotifications
                          notification={notifications.campaigns}
                          notificationScrolled={notificationScrolled}
                          setNotificationScrolled={setNotificationScrolled}
                        />
                      </div>
                    )}
                  {activeMainTab === "updates" &&
                    activeInnerTab === "milestones" && (
                      <div>
                        <MileStonesNotification
                          notification={notifications.milestones}
                          notificationScrolled={notificationScrolled}
                          setNotificationScrolled={setNotificationScrolled}
                        />
                      </div>
                    )}
                  {activeMainTab === "updates" &&
                    activeInnerTab === "security" && (
                      <div>
                        <SecurityNotification
                          notification={notifications.security}
                          notificationScrolled={notificationScrolled}
                          setNotificationScrolled={setNotificationScrolled}
                        />
                      </div>
                    )}
                  {activeMainTab === "drops" && activeInnerTab === "assets" && (
                    <div>
                      <AssetsNotification
                        notification={notifications.assets}
                        notificationScrolled={notificationScrolled}
                        setNotificationScrolled={setNotificationScrolled}
                      />
                    </div>
                  )}
                  {activeMainTab === "drops" &&
                    activeInnerTab === "payment" && (
                      <div>
                        <PaymentsNotification
                          notification={notifications.payments}
                          notificationScrolled={notificationScrolled}
                          setNotificationScrolled={setNotificationScrolled}
                        />
                      </div>
                    )}
                </div>
                {activeMainTab === "drops" && activeInnerTab === "assets" && (
                  <div className="bg-black px-4 py-[4px] rounded text-center mx-4 mb-4">
                    <button
                      className="text-white font-medium text-[14px] w-full font-IBM"
                      onClick={() => router.push("/drops")}
                    >
                      View All Assets
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNav;
