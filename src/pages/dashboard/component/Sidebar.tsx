import { clearLS } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdOutlineArrowRightAlt } from "react-icons/md";

const Sidebar: FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  const toggleResourcesSidebar = () => {
    setIsResourcesOpen(!isResourcesOpen);
    // if (!isResourcesOpen) {
    //   setIsOpen(false);
    // } else {
    //   setIsOpen(true);
    // }
  };

  const logout = () => {
    clearLS();
    router.push("/login");
  };

  return (
    <div>
      <div className=" absolute top-0 left-0">
        <button
          className="lg:hidden p-4 text-[#17954c] focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <div
        className={`fixed lg:relative top-0 left-0 z-[99999999999] w-64 h-screen overflow-auto bg-white border border-slate-100 text-[#000000] flex flex-col transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-700`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className=" p-[50px] border-b flex items-center justify-center">
          <Image
            src="https://res.cloudinary.com/dih0krdcj/image/upload/v1710656700/Arroweye%20Pro/qkpawzztfn7c6osevfmm.svg"
            alt="Logo"
            width={50}
            height={50}
            priority
          />
        </div>
        {isOpen && !isResourcesOpen && (
          <div>
            <nav className="flex-1">
              <ul className="grid space-y-[20px] p-4">
                <li className="flex items-center justify-between space-x-2 p-2 rounded cursor-pointer  text-[#03a835] text-[12px] font-semibold ">
                  <span className="flex items-center space-x-2">
                    <span className="bg-transparent w-2 h-2 rounded-full"></span>
                    <span>MENU</span>
                  </span>
                </li>

                <Link href="/projects">
                  <li className="flex items-center justify-between space-x-2 p-2 rounded cursor-pointer">
                    <span className="flex items-center space-x-2">
                      <span
                        className={`${
                          isActive("/projects")
                            ? "bg-[#17954c] w-3 h-3"
                            : "bg-transparent w-2 h-2"
                        } rounded-full`}
                      ></span>
                      <span>Projects</span>
                    </span>
                  </li>
                </Link>

                <Link href="/drops">
                  <li className="flex items-center justify-between space-x-2 p-2 rounded cursor-pointer">
                    <span className="flex items-center space-x-2">
                      <span
                        className={`${
                          isActive("/drops")
                            ? "bg-[#17954c] w-3 h-3"
                            : "bg-transparent w-2 h-2"
                        } rounded-full`}
                      ></span>
                      <span>Drops</span>
                    </span>
                  </li>
                </Link>

                <Link href="/payments">
                  <li className="flex items-center justify-between space-x-2 p-2 rounded cursor-pointer">
                    <span className="flex items-center space-x-2">
                      <span
                        className={`${
                          isActive("/payments")
                            ? "bg-[#17954c] w-3 h-3"
                            : "bg-transparent w-2 h-2"
                        } rounded-full`}
                      ></span>
                      <span>Payments</span>
                    </span>
                  </li>
                </Link>

                <Link href="/schedule">
                  <li className="flex items-center justify-between space-x-2 p-2 rounded cursor-pointer">
                    <span className="flex items-center space-x-2">
                      <span
                        className={`${
                          isActive("/schedule")
                            ? "bg-[#17954c] w-3 h-3"
                            : "bg-transparent w-2 h-2"
                        } rounded-full`}
                      ></span>
                      <span>Schedule</span>
                    </span>
                  </li>
                </Link>

                <Link href="#" onClick={toggleResourcesSidebar}>
                  <li className="flex items-center justify-between space-x-2 p-2 rounded cursor-pointer ">
                    <span className="flex items-center space-x-2">
                      <span className="bg-transparent w-2 h-2 rounded-full"></span>
                      <span>Resources</span>
                    </span>
                    <HiOutlineDotsHorizontal size={24} />
                  </li>
                </Link>

                <Link href="/settings">
                  <li className="flex items-center justify-between space-x-2 p-2 rounded cursor-pointer">
                    <span className="flex items-center space-x-2">
                      <span
                        className={`${
                          isActive("/settings")
                            ? "bg-[#17954c] w-3 h-3"
                            : "bg-transparent w-2 h-2"
                        } rounded-full`}
                      ></span>
                      <span>Settings</span>
                    </span>
                  </li>
                </Link>

                <Link href="#" onClick={logout}>
                  <li className="flex items-center justify-between space-x-2 p-2 rounded cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <span className="bg-transparent w-2 h-2 rounded-full"></span>
                      <span>Logout</span>
                    </div>
                  </li>
                </Link>
              </ul>
            </nav>
          </div>
        )}

        {isResourcesOpen && (
          <div>
            <div
              className="p-4  flex gap-[8px] items-center text-[#03a835] text-[12px] font-semibold cursor-pointer"
              onClick={toggleResourcesSidebar}
            >
              <p className="">MENU</p>
              <MdOutlineArrowRightAlt size={24} />
              <p className="">RESOURCES</p>
            </div>
            <ul className="space-y-4 p-4">
              <li className="p-2 hover:bg-gray-200 rounded">Faqs</li>
              <li className="p-2 hover:bg-gray-200 rounded">Learn</li>
              <li className="p-2 hover:bg-gray-200 rounded">Legal</li>
            </ul>
          </div>
        )}
      </div>

      {(isOpen || isResourcesOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-[999999998] transition-opacity duration-700"
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
