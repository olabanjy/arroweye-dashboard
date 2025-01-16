import { FC, useState } from "react";
import { FaRegBell } from "react-icons/fa";

const TopNav: FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState("updates");
  const [activeInnerTab, setActiveInnerTab] = useState("tab1");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMainTabClick = (tab: string) => {
    setActiveMainTab(tab);
    setActiveInnerTab("tab1"); // Reset inner tab when switching main tabs
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
              <div className="absolute top-[35px] right-0 w-[300px] h-screen bg-white shadow-lg z-50 border border-gray-200 rounded-[8px] overflow-y-auto font-IBM">
                <div className="flex items-center text-[#000000] justify-between mb-4 bg-[#f4faff] p-4 border">
                  <div className="flex items-center gap-[10px] text-[16px] font-[600]">
                    <p
                      className={`cursor-pointer ${
                        activeMainTab === "updates"
                          ? "text-blue-500 border-b-2 border-blue-500"
                          : "text-gray-700"
                      }`}
                      onClick={() => handleMainTabClick("updates")}
                    >
                      Updates
                    </p>
                    <p
                      className={`cursor-pointer ${
                        activeMainTab === "drops"
                          ? "text-blue-500 border-b-2 border-blue-500"
                          : "text-gray-700"
                      }`}
                      onClick={() => handleMainTabClick("drops")}
                    >
                      Drops
                    </p>
                  </div>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={toggleSidebar}
                  >
                    Close
                  </button>
                </div>

                <div className="px-4">
                  {activeMainTab === "updates" && (
                    <div className="flex justify-between mb-4">
                      <button
                        className={`py-2 px-4 text-sm font-semibold rounded-lg ${
                          activeInnerTab === "tab1"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                        onClick={() => handleInnerTabClick("tab1")}
                      >
                        Updates 1
                      </button>
                      <button
                        className={`py-2 px-4 text-sm font-semibold rounded-lg ${
                          activeInnerTab === "tab2"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                        onClick={() => handleInnerTabClick("tab2")}
                      >
                        Updates 2
                      </button>
                      <button
                        className={`py-2 px-4 text-sm font-semibold rounded-lg ${
                          activeInnerTab === "tab3"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                        onClick={() => handleInnerTabClick("tab3")}
                      >
                        Updates 3
                      </button>
                    </div>
                  )}

                  {activeMainTab === "drops" && (
                    <div className="flex justify-between mb-4">
                      <button
                        className={`py-2 px-4 text-sm font-semibold rounded-lg ${
                          activeInnerTab === "tab1"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                        onClick={() => handleInnerTabClick("tab1")}
                      >
                        Drops 1
                      </button>
                      <button
                        className={`py-2 px-4 text-sm font-semibold rounded-lg ${
                          activeInnerTab === "tab2"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                        onClick={() => handleInnerTabClick("tab2")}
                      >
                        Drops 2
                      </button>
                      <button
                        className={`py-2 px-4 text-sm font-semibold rounded-lg ${
                          activeInnerTab === "tab3"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                        onClick={() => handleInnerTabClick("tab3")}
                      >
                        Drops 3
                      </button>
                    </div>
                  )}

                  <div className="text-sm text-gray-600">
                    {activeMainTab === "updates" &&
                      activeInnerTab === "tab1" && (
                        <p>Updates - Content for Updates 1</p>
                      )}
                    {activeMainTab === "updates" &&
                      activeInnerTab === "tab2" && (
                        <p>Updates - Content for Updates 2</p>
                      )}
                    {activeMainTab === "updates" &&
                      activeInnerTab === "tab3" && (
                        <p>Updates - Content for Updates 3</p>
                      )}

                    {activeMainTab === "drops" && activeInnerTab === "tab1" && (
                      <p>Drops - Content for Drops 1</p>
                    )}
                    {activeMainTab === "drops" && activeInnerTab === "tab2" && (
                      <p>Drops - Content for Drops 2</p>
                    )}
                    {activeMainTab === "drops" && activeInnerTab === "tab3" && (
                      <p>Drops - Content for Drops 3</p>
                    )}
                  </div>
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
