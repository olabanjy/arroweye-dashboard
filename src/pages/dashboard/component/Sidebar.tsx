import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";

const Sidebar: FC = () => {
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  return (
    <div className="w-64 border border-slate-100 text-[#000000] h-screen flex flex-col">
      <div className="p-4 border-b">
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
          <li
            className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
              isActive("/schedule")
                ? "bg-[#17954c] text-white"
                : "hover:text-[#17954c]"
            }`}
          >
            <span>Schedule</span>
          </li>
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
  );
};

export default Sidebar;
