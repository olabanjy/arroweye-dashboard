import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import {
  MdArrowForward,
  MdCampaign,
  MdWaterDrop,
  MdPayment,
  MdCalendarMonth,
  MdSettings,
  MdLogout,
  MdAddCircleOutline,
  MdHelpOutline,
  MdSchool,
  MdGavel,
} from "react-icons/md";
import { TfiMore } from "react-icons/tfi";
import { useAuth } from "@/context/auth-context";

const Sidebar: FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const { isAdvertiser, userProfile, logout } = useAuth();
  const userRole = userProfile?.role || "";
  const router = useRouter();

  const isActive = (path: string) => {
    return router.pathname === path || router.pathname.startsWith(`${path}/`);
  };
  const toggleResourcesSidebar = () => {
    setIsResourcesOpen(!isResourcesOpen);
  };

  return (
    <div>
      {/* Mobile Toggle Button */}
      <div className="absolute top-0 left-0">
        <button className="lg:hidden p-4 text-[#17954c] focus:outline-none">
          {isOpen ? (
            <FiX
              size={24}
              onClick={() => setIsOpen(false)}
              className="z-50 cursor-pointer"
            />
          ) : (
            <FiMenu
              size={24}
              onClick={() => setIsOpen(true)}
              className="z-50 cursor-pointer"
            />
          )}
        </button>
      </div>

      {/* Sidebar Container */}
      <div
        className={`fixed lg:relative top-0 left-0 z-[9] ${
          isCollapsed ? "w-20" : "w-64"
        } h-screen bg-white border border-slate-100 text-[#000000] flex flex-col transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-all duration-700`}
      >
        <button
          onClick={() => {
            setIsResourcesOpen(false);
            setIsCollapsed((prev) => !prev);
          }}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`group border-b flex items-center justify-center w-full focus:outline-none ${
            isCollapsed ? "p-[25px]" : "p-[50px]"
          }`}
        >
          <span className="relative inline-flex items-center justify-center">
            <span className="block group-hover:opacity-0 transition-opacity">
              <Image
                src="https://res.cloudinary.com/dyueswnzk/image/upload/v1758701294/21_elj38n_jljfio.svg"
                alt="Logo"
                width={isCollapsed ? 36 : 50}
                height={isCollapsed ? 36 : 50}
                priority
              />
            </span>

            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[#17954c]">
              <svg
                width={28}
                height={28}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M6,2H18A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2M6,8V16H10V8H6Z" />
              </svg>
            </span>

            <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 hidden whitespace-nowrap p-[8px] text-xs font-[400] text-white bg-black rounded-[4px] group-hover:block z-50 shadow-lg font-SansFlex">
              <span className="absolute right-full top-1/2 -translate-y-1/2 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-black" />
              {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            </span>
          </span>
        </button>

        <div className="relative flex-1 overflow-hidden">
          {/* MAIN MENU */}
          <div
            className={`absolute inset-0 overflow-auto transition-transform duration-700 ${
              isResourcesOpen ? "-translate-x-full" : "translate-x-0"
            }`}
          >
            <nav className="flex-1">
              <ul className="grid space-y-[20px] p-4">
                <li className="text-[#03a835] text-[12px] font-semibold h-4">
                  {!isCollapsed && "MENU"}
                </li>

                {/* Campaigns */}
                <li>
                  <Link href="/campaigns">
                    <div
                      className={`flex items-center p-2 rounded cursor-pointer ${
                        isCollapsed ? "justify-center" : "justify-between"
                      }`}
                      title="Campaigns"
                    >
                      <span className="flex items-center space-x-2">
                        <span
                          className={`${isCollapsed ? "hidden" : ""} ${
                            isActive("/campaigns")
                              ? "bg-[#17954c] w-1 h-1"
                              : "bg-transparent w-1 h-1"
                          } rounded-full`}
                        />
                        <MdCampaign size={22} className="text-black" />
                        <span
                          className={`${isCollapsed ? "hidden" : ""} ${
                            isActive("/campaigns") ? "font-[500]" : "font-[400]"
                          }`}
                        >
                          Campaigns
                        </span>
                      </span>
                    </div>
                  </Link>

                  {/* Submenu */}
                  {isActive("/campaigns") && isAdvertiser && !isCollapsed && (
                    <ul className="ml-6 mt-1 space-y-1 border-l border-gray-200 pl-3">
                      <li>
                        <Link href="/campaigns/setup">
                          <div className="flex items-center space-x-2 cursor-pointer">
                            {/* Dot */}
                            <span
                              className={`${
                                isActive("/campaigns/setup")
                                  ? "bg-[#17954c] w-1 h-1"
                                  : "bg-transparent w-1 h-1"
                              } rounded-full`}
                            />

                            <MdAddCircleOutline
                              size={18}
                              className="text-gray-500"
                            />

                            {/* Text */}
                            <span
                              className={`text-[13px] ${
                                isActive("/campaigns/setup")
                                  ? "font-[500] text-gray-800"
                                  : "font-[400] text-gray-600"
                              }`}
                            >
                              Setup Campaign
                            </span>
                          </div>
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Drops */}

                {!isAdvertiser && (
                  <Link href="/drops">
                    <li
                      className={`flex items-center p-2 rounded cursor-pointer ${
                        isCollapsed ? "justify-center" : "justify-between"
                      }`}
                      title="Drops"
                    >
                      <span className="flex items-center space-x-2">
                        <span
                          className={`${isCollapsed ? "hidden" : ""} ${
                            isActive("/drops")
                              ? "bg-[#17954c] w-1 h-1"
                              : "bg-transparent w-1 h-1"
                          } rounded-full`}
                        />
                        <MdWaterDrop size={22} className="text-black" />
                        <span
                          className={`${isCollapsed ? "hidden" : ""} ${
                            isActive("/drops") ? "font-[500]" : "font-[400]"
                          }`}
                        >
                          Drops
                        </span>
                      </span>
                    </li>
                  </Link>
                )}

                {/* Payments (Role-based) */}
                {["Supervisor", "Manager"].includes(userRole) && (
                  <Link href="/payments">
                    <li
                      className={`flex items-center p-2 rounded cursor-pointer ${
                        isCollapsed ? "justify-center" : "justify-between"
                      }`}
                      title="Payments"
                    >
                      <span className="flex items-center space-x-2">
                        <span
                          className={`${isCollapsed ? "hidden" : ""} ${
                            isActive("/payments")
                              ? "bg-[#17954c] w-1 h-1"
                              : "bg-transparent w-1 h-1"
                          } rounded-full`}
                        />
                        <MdPayment size={22} className="text-black" />
                        <span
                          className={`${isCollapsed ? "hidden" : ""} ${
                            isActive("/payments") ? "font-[500]" : "font-[400]"
                          }`}
                        >
                          Payments
                        </span>
                      </span>
                    </li>
                  </Link>
                )}

                {/* Schedule */}
                {!isAdvertiser && (
                  <Link href="/schedule">
                    <li
                      className={`flex items-center p-2 rounded cursor-pointer ${
                        isCollapsed ? "justify-center" : "justify-between"
                      }`}
                      title="Schedule"
                    >
                      <span className="flex items-center space-x-2">
                        <span
                          className={`${isCollapsed ? "hidden" : ""} ${
                            isActive("/schedule")
                              ? "bg-[#17954c] w-1 h-1"
                              : "bg-transparent w-1 h-1"
                          } rounded-full`}
                        />
                        <MdCalendarMonth size={22} className="text-black" />
                        <span
                          className={`${isCollapsed ? "hidden" : ""} ${
                            isActive("/schedule") ? "font-[500]" : "font-[400]"
                          }`}
                        >
                          Schedule
                        </span>
                      </span>
                    </li>
                  </Link>
                )}

                {/* Resources */}
                {!isAdvertiser && (
                  <li
                    onClick={() => {
                      if (isCollapsed) {
                        setIsCollapsed(false);
                        setIsResourcesOpen(true);
                      } else {
                        toggleResourcesSidebar();
                      }
                    }}
                    title="Resources"
                    className={`flex items-center p-2 rounded cursor-pointer ${
                      isCollapsed ? "justify-center" : "justify-between"
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <span
                        className={`${
                          isCollapsed ? "hidden" : ""
                        } bg-transparent w-1 h-1 rounded-full`}
                      />
                      <MdSchool size={22} className="text-black" />
                      <span className={isCollapsed ? "hidden" : ""}>
                        Resources
                      </span>
                    </span>
                    {!isCollapsed && <TfiMore size={18} />}
                  </li>
                )}

                {/* Settings */}
                <Link href="/settings">
                  <li
                    className={`flex items-center p-2 rounded cursor-pointer ${
                      isCollapsed ? "justify-center" : "justify-between"
                    }`}
                    title="Settings"
                  >
                    <span className="flex items-center space-x-2">
                      <span
                        className={`${isCollapsed ? "hidden" : ""} ${
                          isActive("/settings")
                            ? "bg-[#17954c] w-1 h-1"
                            : "bg-transparent w-1 h-1"
                        } rounded-full`}
                      />
                      <MdSettings size={22} className="text-black" />
                      <span
                        className={`${isCollapsed ? "hidden" : ""} ${
                          isActive("/settings") ? "font-[500]" : "font-[400]"
                        }`}
                      >
                        Settings
                      </span>
                    </span>
                  </li>
                </Link>

                {/* Logout */}
                <li
                  onClick={logout}
                  title="Logout"
                  className={`flex items-center p-2 rounded cursor-pointer ${
                    isCollapsed ? "justify-center" : "justify-between"
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span
                      className={`${
                        isCollapsed ? "hidden" : ""
                      } bg-transparent w-1 h-1 rounded-full`}
                    />
                    <MdLogout size={22} className="text-black" />
                    <span className={isCollapsed ? "hidden" : ""}>Logout</span>
                  </span>
                </li>
              </ul>
            </nav>
          </div>

          {/* RESOURCES PANEL */}
          <div
            className={`absolute inset-0 overflow-auto transition-transform duration-700 ${
              isResourcesOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div
              className="p-4 pl-6 flex gap-2 items-center text-[#03a835] text-[12px] font-semibold cursor-pointer"
              onClick={toggleResourcesSidebar}
            >
              <p>MENU</p>
              <MdArrowForward size={12} />
              <p>RESOURCES</p>
            </div>

            <ul className="space-y-4 p-4">
              <li
                className="p-2 hover:bg-gray-200 rounded cursor-pointer flex items-center gap-2"
                onClick={() =>
                  window.open("https://arroweye.substack.com/", "_blank")
                }
              >
                <MdHelpOutline size={22} className="text-black" />
                FAQs
              </li>

              <li
                className="p-2 hover:bg-gray-200 rounded cursor-pointer flex items-center gap-2"
                onClick={() =>
                  window.open("https://butta.cocoa.house/", "_blank")
                }
              >
                <MdSchool size={22} className="text-black" />
                Learn
              </li>

              <li
                className="p-2 hover:bg-gray-200 rounded cursor-pointer flex items-center gap-2"
                onClick={() =>
                  window.open("http://arroweye.pro/legal", "_blank")
                }
              >
                <MdGavel size={22} className="text-black" />
                Legal
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {(isOpen || isResourcesOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-[8]"
          onClick={() => {
            setIsOpen(false);
            setIsResourcesOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Sidebar;
