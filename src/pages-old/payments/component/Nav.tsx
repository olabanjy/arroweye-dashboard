import React, { useState } from "react";
import Image from "next/image";
import { FaBars, FaTimes } from "react-icons/fa";
import { RiStickyNoteAddLine } from "react-icons/ri";
import Link from "next/link";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

  const handleMouseEnter = (menu: string) => {
    setActiveSubMenu(menu);
  };

  const handleMouseLeave = () => {
    setActiveSubMenu(null);
  };

  return (
    <nav className="py-[40px]">
      <div className="container mx-auto  px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:max-w-3xl lg:mx-[10%]">
          <Link href="/">
            <div className="flex-shrink-0">
              <Image
                src="https://res.cloudinary.com/dih0krdcj/image/upload/v1710656700/Arroweye%20Pro/qkpawzztfn7c6osevfmm.svg"
                alt="Logo"
                width={60}
                height={60}
                priority
              />
            </div>
          </Link>

          <div className="hidden lg:flex space-x-[40px] relative">
            <Link href="/#learn">
              <div className="">
                <p className="py-[8px] px-[16px] text-[#0c0d0c]">Learn</p>
              </div>
            </Link>

            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("features")}
              onMouseLeave={handleMouseLeave}
            >
              <p className="py-[8px] px-[16px] text-[#0c0d0c] cursor-pointer">
                Features
              </p>

              {activeSubMenu === "features" && (
                <div className=" z-50 absolute top-full left-0 mt-[14px] w-[500px] bg-white shadow-lg border rounded-md">
                  <ul className=" grid grid-cols-2 gap-[20px] items-start p-[40px]">
                    <Link href="#">
                      <div className=" flex items-start gap-[10px]">
                        <Image
                          src="/assets/di.svg"
                          alt="image"
                          width={30}
                          height={30}
                        />
                        <li>
                          <p className=" font-[600] text-[18px] block text-[#0c0d0c] hover:text-black">
                            AE Studio
                          </p>
                          <p className=" font-[400] text-[14px] text-slate-500">
                            Create Reports
                          </p>
                        </li>
                      </div>
                    </Link>
                    <Link href="#">
                      <div className=" flex items-start gap-[10px]">
                        <Image
                          src="/assets/sm.svg"
                          alt="image"
                          width={30}
                          height={30}
                        />
                        <li>
                          <p className=" font-[600] text-[18px] block text-[#0c0d0c] hover:text-black">
                            Monitoring
                          </p>
                          <p className=" font-[400] text-[14px] text-slate-500">
                            Budget Tracking
                          </p>
                        </li>
                      </div>
                    </Link>
                    <Link href="#monitor">
                      <div className=" flex items-start gap-[10px]">
                        <Image
                          src="/assets/boxes.svg"
                          alt="image"
                          width={30}
                          height={30}
                        />
                        <li>
                          <p className=" font-[600] text-[18px] block text-[#0c0d0c] hover:text-black">
                            Invoicing
                          </p>
                          <p className=" font-[400] text-[14px] text-slate-500">
                            Online Invoices
                          </p>
                        </li>
                      </div>
                    </Link>
                    <Link href="#">
                      <div className=" flex items-start gap-[10px]">
                        <Image
                          src="/assets/di.svg"
                          alt="image"
                          width={30}
                          height={30}
                        />
                        <li>
                          <p className=" font-[600] text-[18px] block text-[#0c0d0c] hover:text-black">
                            AI Tools
                          </p>
                          <p className=" font-[400] text-[14px] text-slate-500">
                            Free AI Tools
                          </p>
                        </li>
                      </div>
                    </Link>
                    <Link href="#collaborate">
                      <div className=" flex items-start gap-[10px]">
                        <Image
                          src="/assets/sm.svg"
                          alt="image"
                          width={30}
                          height={30}
                        />
                        <li>
                          <p className=" font-[600] text-[18px] block text-[#0c0d0c] hover:text-black">
                            Collaborate
                          </p>
                          <p className=" font-[400] text-[14px] text-slate-500">
                            Add Team
                          </p>
                        </li>
                      </div>
                    </Link>
                    <Link href="#">
                      <div className=" flex items-start gap-[10px]">
                        <Image
                          src="/assets/boxes.svg"
                          alt="image"
                          width={30}
                          height={30}
                        />
                        <li>
                          <p className=" font-[600] text-[18px] block text-[#0c0d0c] hover:text-black">
                            Insights
                          </p>
                          <p className=" font-[400] text-[14px] text-slate-500">
                            Real-time data
                          </p>
                        </li>
                      </div>
                    </Link>
                  </ul>
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("support")}
              onMouseLeave={handleMouseLeave}
            >
              <p className="py-[8px] px-[16px] text-[#0c0d0c] cursor-pointer">
                Support
              </p>

              {activeSubMenu === "support" && (
                <div className=" z-50 absolute top-full mt-[14px] w-[400px] bg-white shadow-lg border rounded-md p-[40px] space-y-[40px]">
                  <ul className=" grid grid-cols-2 gap-[10px] items-start ">
                    <Link href="#">
                      <li>
                        <p className=" font-[600] text-[18px] block text-[#0c0d0c] hover:text-black">
                          Community
                        </p>
                      </li>
                    </Link>
                    <Link href="#">
                      <li>
                        <p className=" font-[600] text-[18px] block text-[#0c0d0c] hover:text-black">
                          Open Ticket
                        </p>
                      </li>
                    </Link>
                    <Link href="#">
                      <li>
                        <p className=" font-[600] text-[18px] block text-[#0c0d0c] hover:text-black">
                          Report Bug
                        </p>
                      </li>
                    </Link>
                    <Link href="#">
                      <li>
                        <p className=" font-[600] text-[18px] block text-[#0c0d0c] hover:text-black">
                          Tools
                        </p>
                      </li>
                    </Link>
                    <Link href="#">
                      <li>
                        <p className=" font-[600] text-[18px] block text-[#0c0d0c] hover:text-black">
                          Legal
                        </p>
                      </li>
                    </Link>
                    <Link href="#">
                      <li>
                        <p className=" font-[600] text-[18px] block text-[#0c0d0c] hover:text-black">
                          Reset Password
                        </p>
                      </li>
                    </Link>
                  </ul>

                  <div className=" ">
                    <Link href="#">
                      <p className=" text-center text-[#ffffff] py-[8px] px-[16px] hover:bg-black bg-orange-600 hover:text-white rounded-full">
                        Get In Touch
                      </p>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="">
              <Link href="/contact">
                <p className="flex items-center gap-[10px] text-[#0c0d0c] py-[8px] px-[16px] hover:bg-black hover:text-white border border-[#454c47] rounded-full">
                  <RiStickyNoteAddLine />
                  Request Demo
                </p>
              </Link>
            </div>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#0c0d0c] focus:outline-none"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden bg-white h-screen p-[20px] rounded-[8px]">
            <div className="">
              <Link href="/contact">
                <p className="flex items-center gap-[10px] justify-center  py-[8px] px-[16px]  bg-black text-white  rounded-full">
                  <RiStickyNoteAddLine />
                  Request Demo
                </p>
              </Link>
            </div>
            <div className="space-y-2 p-4 mt-[30px]">
              <div className="">
                <div className="">
                  <p className="text-[16px] font-[500]">Features</p>
                </div>
                <div className="">
                  <ul className=" grid  gap-[20px] items-start px-[40px]">
                    <div className=" flex items-start gap-[10px]">
                      <Image
                        src="/assets/di.svg"
                        alt="image"
                        width={30}
                        height={30}
                      />

                      <li>
                        <p className=" font-[600] text-[18px] block text-[#0c0d0c] hover:text-black">
                          AE Studio
                        </p>
                        <p className=" font-[400] text-[14px] text-slate-500">
                          Create Reports
                        </p>
                      </li>
                    </div>
                    <div className=" flex items-start gap-[10px]">
                      <Image
                        src="/assets/sm.svg"
                        alt="image"
                        width={30}
                        height={30}
                      />
                      <li>
                        <p className=" font-[600] text-[18px] block text-[#0c0d0c] hover:text-black">
                          Monitoring
                        </p>
                        <p className=" font-[400] text-[14px] text-slate-500">
                          Budget Tracking
                        </p>
                      </li>
                    </div>
                    <Link href="#monitor">
                      <div className=" flex items-start gap-[10px]">
                        <Image
                          src="/assets/boxes.svg"
                          alt="image"
                          width={30}
                          height={30}
                        />
                        <li>
                          <p className=" font-[600] text-[18px] block text-[#0c0d0c] hover:text-black">
                            Invoicing
                          </p>
                          <p className=" font-[400] text-[14px] text-slate-500">
                            Online Invoices
                          </p>
                        </li>
                      </div>
                    </Link>
                    <div className=" flex items-start gap-[10px]">
                      <Image
                        src="/assets/di.svg"
                        alt="image"
                        width={30}
                        height={30}
                      />
                      <li>
                        <p className=" font-[600] text-[18px] block text-[#0c0d0c] hover:text-black">
                          AI Tools
                        </p>
                        <p className=" font-[400] text-[14px] text-slate-500">
                          Free AI Tools
                        </p>
                      </li>
                    </div>
                    <div className=" flex items-start gap-[10px]">
                      <Image
                        src="/assets/sm.svg"
                        alt="image"
                        width={30}
                        height={30}
                      />
                      <li>
                        <p className=" font-[600] text-[18px] block text-[#0c0d0c] hover:text-black">
                          Collaborate
                        </p>
                        <p className=" font-[400] text-[14px] text-slate-500">
                          Add Team
                        </p>
                      </li>
                    </div>
                    <div className=" flex items-start gap-[10px]">
                      <Image
                        src="/assets/boxes.svg"
                        alt="image"
                        width={30}
                        height={30}
                      />
                      <li>
                        <p className=" font-[600] text-[18px] block text-[#0c0d0c] hover:text-black">
                          Insights
                        </p>
                        <p className=" font-[400] text-[14px] text-slate-500">
                          Real-time data
                        </p>
                      </li>
                    </div>
                  </ul>
                </div>
              </div>

              <div className=" pt-[40px]">
                <div className="">
                  <p className="text-[16px] font-[500]">Connect</p>
                </div>
                <div className="">
                  <ul className=" grid  gap-[10px] items-start px-[40px]">
                    <li>
                      <p className=" font-[600] text-[14px] block text-[#0c0d0c] hover:text-black">
                        Community
                      </p>
                    </li>
                    <li>
                      <p className=" font-[600] text-[14px] block text-[#0c0d0c] hover:text-black">
                        Open Ticket
                      </p>
                    </li>
                    <li>
                      <p className=" font-[600] text-[14px] block text-[#0c0d0c] hover:text-black">
                        Report Bug
                      </p>
                    </li>
                    <li>
                      <p className=" font-[600] text-[14px] block text-[#0c0d0c] hover:text-black">
                        Tools
                      </p>
                    </li>
                    <li>
                      <p className=" font-[600] text-[14px] block text-[#0c0d0c] hover:text-black">
                        Legal
                      </p>
                    </li>
                    <li>
                      <p className=" font-[600] text-[14px] block text-[#0c0d0c] hover:text-black">
                        Reset Password
                      </p>
                    </li>
                  </ul>
                  <div className=" mt-[30px]">
                    <p className=" text-center text-[#ffffff] py-[8px] px-[16px] hover:bg-black bg-orange-600 hover:text-white rounded-full">
                      Get In Touch
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
