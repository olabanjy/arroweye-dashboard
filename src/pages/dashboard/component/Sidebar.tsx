import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const Sidebar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        className="lg:hidden p-4 text-[#17954c] focus:outline-none"
        onClick={toggleSidebar}
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <div
        className={`fixed lg:relative top-0 left-0 z-50 w-64 h-screen bg-white border border-slate-100 text-[#000000] flex flex-col transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300`}
      >
        <div className="p-4 border-b" onClick={toggleSidebar}>
          <Image
            src="https://res.cloudinary.com/dih0krdcj/image/upload/v1710656700/Arroweye%20Pro/qkpawzztfn7c6osevfmm.svg"
            alt="Logo"
            width={100}
            height={100}
            priority
          />
        </div>

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
              className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
                isActive("/resources")
                  ? "bg-[#17954c] text-white"
                  : "hover:text-[#17954c]"
              }`}
            >
              <span>Resources</span>
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

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
