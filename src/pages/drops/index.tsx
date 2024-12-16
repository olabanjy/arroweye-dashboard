import React, { useState } from "react";
import DashboardLayout from "../dashboard/layout";
import { Dialog } from "primereact/dialog";
import { IoCloudUploadOutline, IoCopy } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { LucideLockKeyhole } from "lucide-react";

const users = [
  { initials: "JJ", fullName: "John Jerome", email: "john@example.com" },
  { initials: "EO", fullName: "Emily O'Connor", email: "emily@example.com" },
  { initials: "MD", fullName: "Michael Douglas", email: "michael@example.com" },
  { initials: "SO", fullName: "Sarah O'Neil", email: "sarah@example.com" },
];

interface User {
  initials: string;
  fullName: string;
  email: string;
}

const userColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
];

const Drops = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [unlock, setUnlock] = useState(false);

  const getUserColor = (index: number) => {
    return userColors[index % userColors.length];
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <DashboardLayout>
      <div className="space-y-[20px]">
        <div className="text-[#919393] flex items-center gap-[20px]">
          <p className="text-[#5e5e5e]">Khaid</p>
          <p className="p-[4px] border border-[#d5d9db] bg-[#f7fcff] rounded">
            Neville Records
          </p>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="font-extrabold text-5xl text-[#000000]">Jolie</p>
            <div className="mt-[20px] flex items-center gap-[10px]">
              {users.map((user, index) => (
                <div key={index} className="relative group">
                  <p
                    className={`${getUserColor(
                      index
                    )} text-white rounded-full p-4 w-[50px] h-[50px] flex items-center justify-center text-center cursor-pointer`}
                    onClick={() => handleUserClick(user)}
                  >
                    {user.initials}
                  </p>
                  <div className="absolute bottom-[-30px] left-0 bg-black text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {user.fullName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[50px] grid md:grid-cols-2 items-start gap-[20px] ">
        <div className="border flex flex-col ">
          <div className="border border-[#f4f0f0]">
            <p className="border px-[16px] py-[8px] bg-[#f4faff] font-[600]">
              Drops
            </p>
          </div>
          <div className="max-h-[1000px] overflow-y-auto ">
            <div className="border-b">
              <div className="flex items-center gap-[10px] p-[20px]">
                <div className="bg-[#e6ff99] text-[#01a733] p-[10px] rounded-[8px] inline-flex">
                  <IoCopy />
                </div>
                <div className="space-y-[10px]">
                  <p className="uppercase text-[8px] text-[#999999]">
                    2 days ago
                  </p>
                  <p>
                    <span className="font-[600]">
                      Run This Town (Motion edits)
                    </span>{" "}
                    has been uploaded for{" "}
                    <span className="font-[600]">Run This Town</span>
                  </p>
                  <div className="flex items-center gap-[10px]">
                    <div className="bg-[#000] text-[#ffffff] p-[10px] rounded inline-flex">
                      <MdOutlineFileDownload />
                    </div>
                    <div className="border border-[#eeeeee] text-[#00000] px-[10px] py-[5px] rounded inline-flex">
                      <p className="font-[400] text-[18px]">Share</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-b">
              <div className="flex items-center gap-[10px] p-[20px]">
                <div className="bg-[#e6ff99] text-[#01a733] p-[10px] rounded-[8px] inline-flex">
                  <IoCopy />
                </div>
                <div className="space-y-[10px]">
                  <p className="uppercase text-[8px] text-[#999999]">
                    2 days ago
                  </p>
                  <p>
                    <span className="font-[600]">
                      Run This Town (Motion edits)
                    </span>{" "}
                    has been uploaded for{" "}
                    <span className="font-[600]">Run This Town</span>
                  </p>
                  <div className="flex items-center gap-[10px]">
                    <div className="bg-[#000] text-[#ffffff] p-[10px] rounded inline-flex">
                      <MdOutlineFileDownload />
                    </div>
                    <div className="border border-[#eeeeee] text-[#00000] px-[10px] py-[5px] rounded inline-flex">
                      <p className="font-[400] text-[18px]">Share</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-b">
              <div className="flex items-center gap-[10px] p-[20px]">
                <div className="bg-[#e6ff99] text-[#01a733] p-[10px] rounded-[8px] inline-flex">
                  <IoCopy />
                </div>
                <div className="space-y-[10px]">
                  <p className="uppercase text-[8px] text-[#999999]">
                    2 days ago
                  </p>
                  <p>
                    <span className="font-[600]">
                      Run This Town (Motion edits)
                    </span>{" "}
                    has been uploaded for{" "}
                    <span className="font-[600]">Run This Town</span>
                  </p>
                  <div className="flex items-center gap-[10px]">
                    <div className="bg-[#000] text-[#ffffff] p-[10px] rounded inline-flex">
                      <MdOutlineFileDownload />
                    </div>
                    <div className="border border-[#eeeeee] text-[#00000] px-[10px] py-[5px] rounded inline-flex">
                      <p className="font-[400] text-[18px]">Share</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-b">
              <div className="flex items-center gap-[10px] p-[20px]">
                <div className="bg-[#e6ff99] text-[#01a733] p-[10px] rounded-[8px] inline-flex">
                  <IoCopy />
                </div>
                <div className="space-y-[10px]">
                  <p className="uppercase text-[8px] text-[#999999]">
                    2 days ago
                  </p>
                  <p>
                    <span className="font-[600]">
                      Run This Town (Motion edits)
                    </span>{" "}
                    has been uploaded for{" "}
                    <span className="font-[600]">Run This Town</span>
                  </p>
                  <div className="flex items-center gap-[10px]">
                    <div className="bg-[#000] text-[#ffffff] p-[10px] rounded inline-flex">
                      <MdOutlineFileDownload />
                    </div>
                    <div className="border border-[#eeeeee] text-[#00000] px-[10px] py-[5px] rounded inline-flex">
                      <p className="font-[400] text-[18px]">Share</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-b">
              <div className="flex items-center gap-[10px] p-[20px]">
                <div className="bg-[#e6ff99] text-[#01a733] p-[10px] rounded-[8px] inline-flex">
                  <IoCopy />
                </div>
                <div className="space-y-[10px]">
                  <p className="uppercase text-[8px] text-[#999999]">
                    2 days ago
                  </p>
                  <p>
                    <span className="font-[600]">
                      Run This Town (Motion edits)
                    </span>{" "}
                    has been uploaded for{" "}
                    <span className="font-[600]">Run This Town</span>
                  </p>
                  <div className="flex items-center gap-[10px]">
                    <div className="bg-[#000] text-[#ffffff] p-[10px] rounded inline-flex">
                      <MdOutlineFileDownload />
                    </div>
                    <div className="border border-[#eeeeee] text-[#00000] px-[10px] py-[5px] rounded inline-flex">
                      <p className="font-[400] text-[18px]">Share</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded p-[30px] hover:bg-green-500 hover:bg-opacity-5 hover:border hover:border-green-500 flex flex-col h-full">
          {unlock === false ? (
            <div className="">
              <div className="flex items-end gap-[10px] flex-grow">
                <Input label="Unlock Dropzone" type="password" placeholder="" />
                <button
                  className="font-bold gap-[10px] px-4 py-2 text-white bg-[#e4055a] rounded-[8px] hover:bg-[#000000] flex items-center"
                  onClick={() => setUnlock(true)}
                >
                  Unlock <LucideLockKeyhole size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="">
              <div className=" space-y-[20px]">
                <p className=" font-[500] text-[18px]">Drop em!</p>
                <p className="font-[400] text-[16px]">
                  Fill accurately with link details
                </p>
              </div>
              <div className="">
                <div className="">
                  <div className=" space-y-[20px]">
                    <Input
                      type="text"
                      placeholder="First Name"
                      className="w-full rounded-[8px] "
                    />
                    <Input
                      type="text"
                      placeholder="Last Name"
                      className="w-full rounded-[8px]"
                    />
                    <Input
                      type="text"
                      placeholder="Folder Name"
                      className="w-full rounded-[8px]"
                    />
                    <Input
                      type="text"
                      placeholder="Link"
                      className="w-full rounded-[8px]"
                    />
                    <Input
                      type="text"
                      placeholder=""
                      readOnly
                      className="w-full rounded-[8px]"
                    />
                    <button className="font-bold gap-[10px] px-4 py-2 text-white bg-[#e4055a] rounded-[8px] hover:bg-[#000000] flex items-center">
                      Unlock <IoCloudUploadOutline size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog
        header=" Member Information"
        visible={selectedUser !== null}
        onHide={() => setSelectedUser(null)}
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        style={{ width: "30vw" }}
      >
        {selectedUser && (
          <div className="space-y-4">
            <p className="text-3xl font-bold">{selectedUser.fullName}</p>
            <div className=" text-[14px]">
              <p className="text-[14px]">Email: </p>
              <p className=" font-bold"> {selectedUser.email}</p>
            </div>
            <div className=" text-[14px]">
              <p className="text-[14px]">Role </p>
              <p className=" font-bold">Agent</p>
            </div>
            <div className=" text-[14px]">
              <p className="text-[14px]">Member since </p>
              <p className=" font-bold">July 20, 2021</p>
            </div>
            <div className=" text-[14px]">
              <p className="text-[14px]">Last login</p>
              <p className=" font-bold">May 2, 2024</p>
            </div>
          </div>
        )}
      </Dialog>
    </DashboardLayout>
  );
};

export default Drops;
