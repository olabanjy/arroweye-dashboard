"use client";
import { Input } from "@/components/ui/input";
import { CreateService } from "@/services/api";
import React, { useState } from "react";

const Recap = () => {
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
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/zip") {
      setFile(selectedFile);
    } else {
      alert("Please upload a valid .zip file.");
      setFile(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      source_link: "",
      embed_link: "",
      download_link: "",
    };

    if (!formData.embed_link) {
      newErrors.embed_link = "Please enter a valid name.";
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
      if (!file) {
        alert("Please upload a .zip file.");
        return;
      }

      const data = {
        ...formData,
        file,
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
          <div>
            <Input
              type="text"
              name="embed_link"
              placeholder="Add embed link"
              value={formData.embed_link}
              onChange={handleInputChange}
            />
            {errors.embed_link && (
              <p className="text-red-500 text-xs">{errors.embed_link}</p>
            )}
          </div>
          <div>
            <Input
              type="text"
              name="source_link"
              placeholder="Add source link"
              value={formData.source_link}
              onChange={handleInputChange}
            />
            {errors.source_link && (
              <p className="text-red-500 text-xs">{errors.source_link}</p>
            )}
          </div>
          <div>
            <Input
              type="text"
              name="download_link"
              placeholder="Add download link"
              value={formData.download_link}
              onChange={handleInputChange}
            />
            {errors.download_link && (
              <p className="text-red-500 text-xs">{errors.download_link}</p>
            )}
          </div>

          <div className="flex flex-col items-center justify-center h-[100px] border border-dotted bg-gray-200">
            <label
              htmlFor="file-upload"
              className="cursor-pointer font-[400] text-[16px] text-center text-[#000000] hover:underline"
            >
              + add insights (.zip)
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".zip"
              className="hidden"
              onChange={handleFileUpload}
            />
            {file && (
              <p className="text-green-500 text-xs mt-2">
                {file.name} uploaded successfully!
              </p>
            )}
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

export default Recap;
