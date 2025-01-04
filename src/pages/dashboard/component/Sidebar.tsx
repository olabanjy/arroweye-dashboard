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

  return (
    <div>
      <button
        className="lg:hidden p-4 text-[#17954c] focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <div
        className={`fixed lg:relative top-0 left-0 z-50 w-64 h-screen bg-white border border-slate-100 text-[#000000] flex flex-col transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-700`}
      >
        <div className="p-4 border-b">
          <Image
            src="https://res.cloudinary.com/dih0krdcj/image/upload/v1710656700/Arroweye%20Pro/qkpawzztfn7c6osevfmm.svg"
            alt="Logo"
            width={100}
            height={100}
            priority
          />
        </div>
        {isOpen && !isResourcesOpen && (
          <div>
            <nav className="flex-1">
              <ul className="space-y-4 p-4">
                <Link href="/projects">
                  <li
                    className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
                      isActive("/projects")
                        ? "bg-[#17954c] text-white"
                        : "hover:text-[#17954c]"
                    }`}
                  >
                    <span>Projects</span>
                  </li>
                </Link>
                <Link href="/drops">
                  <li
                    className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
                      isActive("/drops")
                        ? "bg-[#17954c] text-white"
                        : "hover:text-[#17954c]"
                    }`}
                  >
                    <span>Drops</span>
                  </li>
                </Link>
                <Link href="/payments">
                  <li
                    className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
                      isActive("/payments")
                        ? "bg-[#17954c] text-white"
                        : "hover:text-[#17954c]"
                    }`}
                  >
                    <span>Payments</span>
                  </li>
                </Link>
                <Link href="/schedule">
                  <li
                    className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
                      isActive("/schedule")
                        ? "bg-[#17954c] text-white"
                        : "hover:text-[#17954c]"
                    }`}
                  >
                    <span>Schedule</span>
                  </li>
                </Link>
                <li
                  className={`flex items-center justify-between space-x-2 p-2 rounded cursor-pointer ${
                    isActive("/resources")
                      ? "bg-[#17954c] text-white"
                      : "hover:text-[#17954c]"
                  }`}
                  onClick={toggleResourcesSidebar}
                >
                  Resources
                  <span>
                    <HiOutlineDotsHorizontal size={24} />
                  </span>
                </li>
                <Link href="/settings">
                  <li
                    className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
                      isActive("/settings")
                        ? "bg-[#17954c] text-white"
                        : "hover:text-[#17954c]"
                    }`}
                  >
                    <span>Settings</span>
                  </li>
                </Link>
                <li
                  className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
                    isActive("/logout")
                      ? "bg-[#17954c] text-white"
                      : "hover:text-[#17954c]"
                  }`}
                >
                  <span>Logout</span>
                </li>
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
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden transition-opacity duration-700"
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
