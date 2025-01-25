import { Input } from "@/components/ui/input";
import { LoginEP } from "@/services/api";
import React, { useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { toast } from "react-toastify";

const DropForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    folderName: "",
    link: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.folderName ||
      !formData.link
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    LoginEP(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-[20px]">
        <p className="font-[500] text-[18px] text-[#212529]">Drop em!</p>
        <p className="font-[400] text-[16px] text-[#212529]">
          Fill accurately with link details
        </p>
      </div>
      <div className="space-y-[20px] mt-4">
        <Input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="w-full rounded-[8px]"
          value={formData.firstName}
          onChange={handleInputChange}
        />
        <Input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="w-full rounded-[8px]"
          value={formData.lastName}
          onChange={handleInputChange}
        />
        <Input
          type="text"
          name="folderName"
          placeholder="Folder Name"
          className="w-full rounded-[8px]"
          value={formData.folderName}
          onChange={handleInputChange}
        />
        <Input
          type="text"
          name="link"
          placeholder="Link"
          className="w-full rounded-[8px]"
          value={formData.link}
          onChange={handleInputChange}
        />
        <Input
          type="text"
          placeholder=""
          readOnly
          className="w-full rounded-[8px]"
          value=""
        />
        <button
          type="submit"
          className="font-[600] text-[16px] gap-[10px] px-4 h-[50px] text-white bg-[#e4055a] rounded-[8px] hover:bg-[#000000] flex items-center"
        >
          Upload <IoCloudUploadOutline size={14} className=" font-bold" />
        </button>
      </div>
    </form>
  );
};

export default DropForm;
