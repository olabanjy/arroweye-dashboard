import { Input } from "@/components/ui/input";
import { createDropzone } from "@/services/api";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { ContentItem } from "@/types/contents";
import { SelectInput } from "@/components/ui/selectinput";

interface DropFormProps {
  setDropzoneData: React.Dispatch<React.SetStateAction<ContentItem | null>>;
}

const DropForm: React.FC<DropFormProps> = ({ setDropzoneData }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    folderName: "",
    link: "",
    dropType: "",
  });

  const [loading, setLoading] = useState(false);
  const { query } = useRouter();
  const projectId = typeof query.id === "string" ? query.id : "";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === "link") {
        if (value.includes("drive.google.com"))
          newData.dropType = "GoogleDrive";
        else if (value.includes("wetransfer.com"))
          newData.dropType = "WeTransfer";
        else if (value.includes("onedrive.live.com"))
          newData.dropType = "OneDrive";
        else if (value.includes("dropbox.com")) newData.dropType = "Dropbox";
        else if (value.includes("pcloud.com")) newData.dropType = "PCloud";
        else newData.dropType = "";
      }
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectId) {
      toast.error("Project ID is missing");
      return;
    }

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.folderName ||
      !formData.link
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    const payload = {
      project: Number(projectId),
      folder_name: formData.folderName,
      first_name: formData.firstName,
      last_name: formData.lastName,
      link: formData.link,
      drop_type: formData.dropType,
      created: new Date().toISOString(),
    };

    const response = await createDropzone(projectId, payload);
    if (response) {
      toast.success("Dropzone created successfully");
      setDropzoneData((prevData: any) => ({
        ...prevData,
        dropzone: [...(prevData?.dropzone || []), payload],
      }));
      setFormData({
        firstName: "",
        lastName: "",
        folderName: "",
        link: "",
        dropType: "",
      });
    }
    setLoading(false);
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
        {/* <Input
          type="text"
          placeholder="Drop Type"
          name="dropType"
          // readOnly
          className="w-full rounded-[8px]"
          value={formData.dropType}
          onChange={handleInputChange}
        />{" "} */}
        <SelectInput
          name="role"
          value={formData.dropType}
          onChange={(value) => {
            setFormData((prev: any) => {
              const newData = { ...prev, dropType: value };
              return newData;
            });
          }}
          placeholder="Drop Type"
          options={[
            { value: "GoogleDrive", label: "GoogleDrive" },
            { value: "WeTransfer", label: "WeTransfer" },
            { value: "OneDrive", label: "OneDrive" },
            { value: "DropBox", label: "DropBox" },
            { value: "PCloud", label: "PCloud" },
          ]}
          // error={formData.dropType}
        />
        <button
          type="submit"
          className="font-[600] text-[16px] gap-[10px] px-4 h-[50px] text-white bg-[#e4055a] rounded-[8px] hover:bg-[#000000] flex items-center"
        >
          {loading ? "Uploading..." : "Upload"}
          {!loading && <IoCloudUploadOutline size={14} className="font-bold" />}
        </button>
      </div>
    </form>
  );
};

export default DropForm;
