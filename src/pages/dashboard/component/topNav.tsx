import { FC, useEffect, useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import CampaignNotifications from "./campaigns/CampaignNotifications";
import MileStonesNotification from "./milestones/MileStonesNotification";
import SecurityNotification from "./security/SecurityNotification";
import AssetsNotification from "./assets/AssetsNotification";
import PaymentsNotification from "./payments/PaymentsNotification";
import { getLoggedInUser } from "@/services/api";

const TopNav: FC = () => {
  const [notifications, setNotifications] = useState<any>({
    campaigns: [],
    milestones: [],
    security: [],
    assets: [],
    payments: [],
  });
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
    getLoggedInUser().then((user) => {
      console.log("USER FETCHED", user);
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
    });
  }, []);

  return (
    <div className="relative">
      <div className="h-[10px]  text-white flex items-center justify-between px-[10px] lg:px-[40px] pt-[50px] relative">
        <div className="text-lg font-semibold opacity-0">Dashboard</div>
        <div className="relative">
          <div
            className="text-black cursor-pointer mb-[40px] md:mb-0"
            onClick={toggleSidebar}
          >
            <FaRegBell size={27} />
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
                        />
                      </div>
                    )}
                  {activeMainTab === "updates" &&
                    activeInnerTab === "milestones" && (
                      <div>
                        <MileStonesNotification
                          notification={notifications.milestones}
                        />
                      </div>
                    )}
                  {activeMainTab === "updates" &&
                    activeInnerTab === "security" && (
                      <div>
                        <SecurityNotification
                          notification={notifications.security}
                        />
                      </div>
                    )}
                  {activeMainTab === "drops" && activeInnerTab === "assets" && (
                    <div>
                      <AssetsNotification notification={notifications.assets} />
                    </div>
                  )}
                  {activeMainTab === "drops" &&
                    activeInnerTab === "payment" && (
                      <div>
                        <PaymentsNotification
                          notification={notifications.payments}
                        />
                      </div>
                    )}
                </div>
                {activeMainTab === "drops" && activeInnerTab === "assets" && (
                  <div className="bg-black px-4 py-[4px] rounded text-center mx-4 mb-4">
                    <button className="text-white font-medium text-[14px] w-full font-IBM">
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
