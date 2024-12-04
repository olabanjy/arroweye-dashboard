import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

const Sidebar: FC = () => {
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
          <li className="flex items-center space-x-2 hover:text-[#17954c] p-2 rounded cursor-pointer">
            <span>Projects</span>
          </li>
          <li className="flex items-center space-x-2 hover:text-[#17954c] p-2 rounded cursor-pointer">
            <span>Drops</span>
          </li>
          <Link href="/payments">
            <li className="flex items-center space-x-2 hover:text-[#17954c] p-2 rounded cursor-pointer">
              <span>Payments</span>
            </li>
          </Link>
          <li className="flex items-center space-x-2 hover:text-[#17954c] p-2 rounded cursor-pointer">
            <span>Schedule</span>
          </li>

          <li className="flex items-center space-x-2 hover:text-[#17954c] p-2 rounded cursor-pointer">
            <span>Resources</span>
          </li>

          <li className="flex items-center space-x-2 hover:text-[#17954c] p-2 rounded cursor-pointer">
            <span>Settings</span>
          </li>

          <li className="flex items-center space-x-2 hover:text-[#17954c] p-2 rounded cursor-pointer">
            <span>Logout</span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
