import { clearLS } from "@/lib/utils";
import ls from "localstorage-slim";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { MdArrowForward } from "react-icons/md";
import { TfiMore } from "react-icons/tfi";

const Sidebar: FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [isAdvertiser, setIsAdvertiser] = useState(false);
  const router = useRouter();

  const isActive = (path: string) => {
    return router.pathname === path || router.pathname.startsWith(`${path}/`);
  };
  const toggleResourcesSidebar = () => {
    setIsResourcesOpen(!isResourcesOpen);
  };

  const logout = () => {
    clearLS();
    router.push("/login").then(() => {
      window.location.reload();
    });
  };

  useEffect(() => {
    const content: any = ls.get("Profile", { decrypt: true });
    console.log("CONTENT FOR LOGGED IN USER", content);
    setUserRole(content?.user?.user_profile?.role);
    if (content?.user?.user_type === "Advertiser") {
      setIsAdvertiser(true);
    }
  }, []);

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
        className={`fixed lg:relative top-0 left-0 z-[9] w-64 h-screen bg-white border border-slate-100 text-[#000000] flex flex-col transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-700 overflow-hidden`}
      >
        {/* Logo */}
        <div className="p-[50px] border-b flex items-center justify-center">
          <Image
            src="https://res.cloudinary.com/dyueswnzk/image/upload/v1758701294/21_elj38n_jljfio.svg"
            alt="Logo"
            width={50}
            height={50}
            priority
          />
        </div>

        <div className="relative flex-1">
          {/* MAIN MENU */}
          <div
            className={`absolute inset-0 overflow-auto transition-transform duration-700 ${
              isResourcesOpen ? "-translate-x-full" : "translate-x-0"
            }`}
          >
            <nav className="flex-1">
              <ul className="grid space-y-[20px] p-4">
                <li className="text-[#03a835] text-[12px] font-semibold">
                  MENU
                </li>

                {/* Campaigns */}
                <li>
                  <Link href="/campaigns">
                    <div className="flex items-center justify-between p-2 rounded cursor-pointer">
                      <span className="flex items-center space-x-2">
                        <span
                          className={`${
                            isActive("/campaigns")
                              ? "bg-[#17954c] w-1 h-1"
                              : "bg-transparent w-1 h-1"
                          } rounded-full`}
                        />
                        <span
                          className={`${
                            isActive("/campaigns") ? "font-[500]" : "font-[400]"
                          }`}
                        >
                          Campaigns
                        </span>
                      </span>
                    </div>
                  </Link>

                  {/* Submenu */}
                  {isActive("/campaigns") && isAdvertiser && (
                    <ul className="ml-6 mt-1 space-y-1 border-l border-gray-200 pl-3">
                      <li>
                        <Link
                          href={{
                            pathname: "/campaigns/setup",
                            query: { showModal: "true" },
                          }}
                        >
                          <div className="flex items-center space-x-2 cursor-pointer">
                            {/* Dot */}
                            <span
                              className={`${
                                isActive("/campaigns/setup")
                                  ? "bg-[#17954c] w-1 h-1"
                                  : "bg-transparent w-1 h-1"
                              } rounded-full`}
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
                    <li className="flex items-center justify-between p-2 rounded cursor-pointer">
                      <span className="flex items-center space-x-2">
                        <span
                          className={`${
                            isActive("/drops")
                              ? "bg-[#17954c] w-1 h-1"
                              : "bg-transparent w-1 h-1"
                          } rounded-full`}
                        />
                        <span
                          className={`${
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
                    <li className="flex items-center justify-between p-2 rounded cursor-pointer">
                      <span className="flex items-center space-x-2">
                        <span
                          className={`${
                            isActive("/payments")
                              ? "bg-[#17954c] w-1 h-1"
                              : "bg-transparent w-1 h-1"
                          } rounded-full`}
                        />
                        <span
                          className={`${
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
                    <li className="flex items-center justify-between p-2 rounded cursor-pointer">
                      <span className="flex items-center space-x-2">
                        <span
                          className={`${
                            isActive("/schedule")
                              ? "bg-[#17954c] w-1 h-1"
                              : "bg-transparent w-1 h-1"
                          } rounded-full`}
                        />
                        <span
                          className={`${
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
                    onClick={toggleResourcesSidebar}
                    className="flex items-center justify-between p-2 rounded cursor-pointer"
                  >
                    <span className="flex items-center space-x-2">
                      <span className="bg-transparent w-1 h-1 rounded-full" />
                      <span>Resources</span>
                    </span>
                    <TfiMore size={18} />
                  </li>
                )}

                {/* Settings */}
                <Link href="/settings">
                  <li className="flex items-center justify-between p-2 rounded cursor-pointer">
                    <span className="flex items-center space-x-2">
                      <span
                        className={`${
                          isActive("/settings")
                            ? "bg-[#17954c] w-1 h-1"
                            : "bg-transparent w-1 h-1"
                        } rounded-full`}
                      />
                      <span
                        className={`${
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
                  className="flex items-center justify-between p-2 rounded cursor-pointer"
                >
                  <span className="flex items-center space-x-2">
                    <span className="bg-transparent w-1 h-1 rounded-full" />
                    <span>Logout</span>
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
                className="p-2 hover:bg-gray-200 rounded cursor-pointer"
                onClick={() =>
                  window.open("https://arroweye.substack.com/", "_blank")
                }
              >
                FAQs
              </li>

              <li
                className="p-2 hover:bg-gray-200 rounded cursor-pointer"
                onClick={() =>
                  window.open("https://butta.cocoa.house/", "_blank")
                }
              >
                Learn
              </li>

              <li
                className="p-2 hover:bg-gray-200 rounded cursor-pointer"
                onClick={() =>
                  window.open("http://arroweye.pro/legal", "_blank")
                }
              >
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
