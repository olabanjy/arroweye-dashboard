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
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  const toggleResourcesSidebar = () => {
    setIsResourcesOpen(!isResourcesOpen);
  };

  const logout = () => {
    clearLS();
    router.push("/login");
    router.events.on("routeChangeComplete", () => {
      window.location.reload();
    });
  };

  useEffect(() => {
    const content: any = ls.get("Profile", { decrypt: true });
    console.log("PROFILE", content?.user?.user_profile?.role);
    setUserRole(content?.user?.user_profile?.role);
  }, []);

  return (
    <div>
      <div className="absolute top-0 left-0">
        <button className="lg:hidden p-4 text-[#17954c] focus:outline-none">
          {isOpen ? (
            <FiX
              size={24}
              onClick={() => setIsOpen(!isOpen)}
              className="z-50 cursor-pointer"
            />
          ) : (
            <FiMenu
              size={24}
              onClick={() => setIsOpen(!isOpen)}
              className="z-50 cursor-pointer"
            />
          )}
        </button>
      </div>

      <div
        className={`fixed lg:relative top-0 left-0 z-[9] w-64 h-screen overflow-auto bg-white border border-slate-100 text-[#000000] flex flex-col transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-700`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className="p-[50px] border-b flex items-center justify-center">
          <Image
            src="https://res.cloudinary.com/dih0krdcj/image/upload/v1710656700/Arroweye%20Pro/qkpawzztfn7c6osevfmm.svg"
            alt="Logo"
            width={50}
            height={50}
            priority
          />
        </div>

        <div className="relative flex-1">
          <div
            className={`absolute inset-0 transition-transform duration-700 ${
              isResourcesOpen ? "-translate-x-full" : "translate-x-0"
            }`}
          >
            <nav className="flex-1">
              <ul className="grid space-y-[20px] p-4">
                <li className="flex items-center justify-between space-x-2 p-2 rounded cursor-pointer text-[#03a835] text-[12px] font-semibold">
                  <span className="flex items-center space-x-2">
                    <span className="bg-transparent w-1 h-1 rounded-full"></span>
                    <span>MENU</span>
                  </span>
                </li>

                <Link href="/campaigns">
                  <li className="flex items-center justify-between space-x-2 p-2 rounded cursor-pointer">
                    <span className="flex items-center space-x-2">
                      <span
                        className={`${
                          isActive("/campaigns")
                            ? "bg-[#17954c] w-1 h-1"
                            : "bg-transparent w-1 h-1"
                        } rounded-full`}
                      ></span>
                      <span
                        className={`${
                          isActive("/campaigns") ? "font-[500]" : "font-[400]"
                        }`}
                      >
                        Campaigns
                      </span>
                    </span>
                  </li>
                </Link>

                <Link href="/drops">
                  <li className="flex items-center justify-between space-x-2 p-2 rounded cursor-pointer">
                    <span className="flex items-center space-x-2">
                      <span
                        className={`${
                          isActive("/drops")
                            ? "bg-[#17954c] w-1 h-1"
                            : "bg-transparent w-1 h-1"
                        } rounded-full`}
                      ></span>
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

                {["Supervisor", "Manager"].includes(userRole) && (
                  <Link href="/payments">
                    <li className="flex items-center justify-between space-x-2 p-2 rounded cursor-pointer">
                      <span className="flex items-center space-x-2">
                        <span
                          className={`${
                            isActive("/payments")
                              ? "bg-[#17954c] w-1 h-1"
                              : "bg-transparent w-1 h-1"
                          } rounded-full`}
                        ></span>
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

                <Link href="/schedule">
                  <li className="flex items-center justify-between space-x-2 p-2 rounded cursor-pointer">
                    <span className="flex items-center space-x-2">
                      <span
                        className={`${
                          isActive("/schedule")
                            ? "bg-[#17954c] w-1 h-1"
                            : "bg-transparent w-1 h-1"
                        } rounded-full`}
                      ></span>
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

                <Link href="#" onClick={toggleResourcesSidebar}>
                  <li className="flex items-center justify-between space-x-2 p-2 rounded cursor-pointer">
                    <span className="flex items-center space-x-2">
                      <span className="bg-transparent w-1 h-1 rounded-full"></span>
                      <span>Resources</span>
                    </span>
                    <TfiMore size={24} />
                  </li>
                </Link>

                <Link href="/settings">
                  <li className="flex items-center justify-between space-x-2 p-2 rounded cursor-pointer">
                    <span className="flex items-center space-x-2">
                      <span
                        className={`${
                          isActive("/settings")
                            ? "bg-[#17954c] w-1 h-1"
                            : "bg-transparent w-1 h-1"
                        } rounded-full`}
                      ></span>
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

                <li
                  className="flex items-center justify-between space-x-2 p-2 rounded cursor-pointer"
                  onClick={logout}
                >
                  <div className="flex items-center space-x-2">
                    <span className="bg-transparent w-1 h-1 rounded-full"></span>
                    <span>Logout</span>
                  </div>
                </li>
              </ul>
            </nav>
          </div>

          <div
            className={`absolute inset-0 transition-transform duration-700 ${
              isResourcesOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div
              className="p-4 flex gap-[8px] items-center text-[#03a835] text-[12px] font-semibold cursor-pointer"
              onClick={toggleResourcesSidebar}
            >
              <p>MENU</p>
              <div className="text-[#000000]">
                <MdArrowForward size={24} />
              </div>
              <p>RESOURCES</p>
            </div>
            <ul className="space-y-4 p-4">
              <li className="p-2 hover:bg-gray-200 rounded">FAQs</li>
              <li className="p-2 hover:bg-gray-200 rounded">Learn</li>
              <li className="p-2 hover:bg-gray-200 rounded">Legal</li>
            </ul>
          </div>
        </div>
      </div>

      {(isOpen || isResourcesOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-[8] transition-opacity duration-700"
          onClick={() => {
            setIsOpen(false);
            setIsResourcesOpen(false);
          }}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
