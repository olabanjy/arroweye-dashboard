import { Input } from "@/components/ui/input";
import React from "react";
import { IoCloudUploadOutline } from "react-icons/io5";

const DropForm = () => {
  return (
    <div>
      {" "}
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
    </div>
  );
};

export default DropForm;
