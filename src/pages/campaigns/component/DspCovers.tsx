"use client";
import { Input } from "@/components/ui/input";
import { CreateService } from "@/services/api";
import Image from "next/image";
import React, { useState } from "react";

const DspCovers = () => {
  const hideDialog = () => {
    setErrors({
      source_link: "",
      embed_link: "",
      download_link: "",
    });
  };

  const [errors, setErrors] = useState({
    source_link: "",
    embed_link: "",
    download_link: "",
  });
  const [formData, setFormData] = useState({
    source_link: "",
    embed_link: "",
    download_link: "",
  });
  const [files, setFiles] = useState<File[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files ? Array.from(e.target.files) : [];
    const validFiles = uploadedFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    if (validFiles.length !== uploadedFiles.length) {
      alert("Only image files are allowed.");
    }
    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      source_link: "",
      embed_link: "",
      download_link: "",
    };

    if (!formData.embed_link) {
      newErrors.embed_link = "Please enter a valid link.";
    }
    if (!formData.source_link) {
      newErrors.source_link = "Please enter cost.";
    }

    if (!formData.download_link) {
      newErrors.download_link = "Please enter cost.";
    }
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (!hasErrors) {
      if (files.length === 0) {
        alert("Please upload at least one image.");
        return;
      }

      const data = {
        ...formData,
        files,
      };

      CreateService(data)
        .then(() => {
          console.log("Form submitted successfully!");
          hideDialog();
        })
        .catch((err) => {
          console.error("Error submitting form:", err);
        });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="px-[20px] mt-[20px]">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center h-[100px] border border-dashed">
            <label
              htmlFor="file-upload"
              className="cursor-pointer font-[400] text-[16px] text-center text-[#000000]"
            >
              Drag & drop your playlist covers here or{" "}
              <span className="underline">Choose Files</span>
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          <div className=" mt-4 space-y-[20px] max-h-[200px] overflow-auto">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative group flex gap-[40px] items-center "
              >
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`uploaded-${index}`}
                  width={40}
                  height={40}
                  className=" w-[80px] h-[80px] object-cover rounded"
                />
                <div className=" w-full flex items-center gap-[10px] flex-1">
                  <div className="w-full">
                    <Input
                      type="text"
                      name="embed_link"
                      placeholder="add link"
                      value={formData.embed_link}
                      onChange={handleInputChange}
                      className=" rounded-full"
                    />
                    {errors.embed_link && (
                      <p className="text-red-500 text-xs">
                        {errors.embed_link}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="  text-[#000000] text-xs  "
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-[20px] flex items-center space-x-2">
            <button
              type="submit"
              className="font-IBM text-[14px] text-white hover:text-[#ffffff] bg-[#000000] border border-[#000000] hover:bg-orange-500 hover:border-none py-[8px] px-[20px] rounded"
            >
              Save
            </button>
            <button className="font-IBM text-[14px] text-white hover:text-[#ffffff] bg-[#1f9abd] hover:bg-gray-200 hover:border-none py-[8px] px-[20px] rounded">
              Watch demo
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DspCovers;
