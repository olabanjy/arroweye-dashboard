import { FC, useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import CampaignNotifications from "./campaigns/CampaignNotifications";
import MileStonesNotification from "./milestones/MileStonesNotification";
import SecurityNotification from "./security/SecurityNotification";
import AssetsNotification from "./assets/AssetsNotification";

const TopNav: FC = () => {
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

  return (
    <div className="relative">
      <div className="h-[20px] text-white flex items-center justify-between px-[40px] pt-[50px] relative">
        <div className="text-lg font-semibold">Dashboard</div>
        <div className="relative">
          <div className="text-black cursor-pointer" onClick={toggleSidebar}>
            <FaRegBell size={27} />
          </div>

          {isSidebarOpen && (
            <>
              <div className="absolute top-[35px] right-0 w-[350px] h-screen bg-white shadow-lg z-50 border border-gray-200 rounded-[8px] overflow-y-auto font-IBM">
                <div className="sticky top-0 bg-[#f4faff] z-50">
                  <div className="flex items-center text-[#000000] justify-between mb-4 p-4 border">
                    <div className="flex items-center gap-[10px] text-[16px] font-[600]">
                      <p
                        className={`cursor-pointer ${
                          activeMainTab === "updates"
                            ? "text-[#000000]"
                            : "text-[#767676]"
                        }`}
                        onClick={() => handleMainTabClick("updates")}
                      >
                        Updates
                      </p>
                      <p
                        className={`cursor-pointer ${
                          activeMainTab === "drops"
                            ? "text-[#000000]"
                            : "text-[#767676]"
                        }`}
                        onClick={() => handleMainTabClick("drops")}
                      >
                        Drops
                      </p>
                    </div>
                    <button
                      className="text-[#0e3531] text-[16px] w-8 h-8 flex items-center justify-center rounded-[8px] border bg-white"
                      onClick={toggleSidebar}
                    >
                      <IoIosClose />
                    </button>
                  </div>

                  <div className="flex justify-between py-4 px-4 border-b bg-white">
                    {activeMainTab === "updates" && (
                      <>
                        <button
                          className={`font-[600] text-[16px] ${
                            activeInnerTab === "campaign"
                              ? "text-[#0875d3]"
                              : "text-[#767676]"
                          }`}
                          onClick={() => handleInnerTabClick("campaign")}
                        >
                          Campaign
                        </button>
                        <button
                          className={`font-[600] text-[16px] ${
                            activeInnerTab === "milestones"
                              ? "text-[#ff5700]"
                              : "text-[#767676]"
                          }`}
                          onClick={() => handleInnerTabClick("milestones")}
                        >
                          Milestones
                        </button>
                        <button
                          className={`font-[600] text-[16px] ${
                            activeInnerTab === "security"
                              ? "text-[#ff5700]"
                              : "text-[#767676]"
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
                          className={`text-[16px] font-[600] ${
                            activeInnerTab === "assets"
                              ? "text-[#01a733]"
                              : "text-[#000000]"
                          }`}
                          onClick={() => handleInnerTabClick("assets")}
                        >
                          Assets
                        </button>
                        <button
                          className={`text-[16px] font-[600] ${
                            activeInnerTab === "payment"
                              ? "text-[#c304f1]"
                              : "text-[#000000]"
                          }`}
                          onClick={() => handleInnerTabClick("payment")}
                        >
                          Payments
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-sm text-gray-600 px-4 py-4">
                  {activeMainTab === "updates" &&
                    activeInnerTab === "campaign" && (
                      <div>
                        <CampaignNotifications />
                      </div>
                    )}
                  {activeMainTab === "updates" &&
                    activeInnerTab === "milestones" && (
                      <div>
                        <MileStonesNotification />
                      </div>
                    )}
                  {activeMainTab === "updates" &&
                    activeInnerTab === "security" && (
                      <div>
                        <SecurityNotification />
                      </div>
                    )}
                  {activeMainTab === "drops" && activeInnerTab === "assets" && (
                    <div>
                      <AssetsNotification />
                    </div>
                  )}
                  {activeMainTab === "drops" &&
                    activeInnerTab === "payment" && (
                      <div>
                        <AssetsNotification />
                      </div>
                    )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNav;
