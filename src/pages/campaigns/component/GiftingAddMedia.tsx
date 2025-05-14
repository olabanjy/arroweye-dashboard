"use client";
import { Input } from "@/components/ui/input";
import { CreateMedia } from "@/services/api";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { SelectInput } from "@/components/ui/selectinput";
import CountrySelector from "./CountrySelector";

interface FormData {
  title: string;
}

interface FormErrors {
  title: string;
  file: string;
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes

const GiftingAddMedia = () => {
  const router = useRouter();
  const id = Number(router.query.id);

  const [formData, setFormData] = useState<FormData>({
    title: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({
    title: "",
    file: "",
  });
  const [isUploading, setIsUploading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      title: "",
      file: "",
    };

    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (!file) {
      newErrors.file = "Please upload a pdf file";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateFile = (selectedFile: File): string => {
    if (!selectedFile.name.toLowerCase().endsWith(".pdf")) {
      return "Please upload only .pdf files";
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      return "File must be less than 100MB";
    }

    return "";
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      setErrors((prev) => ({ ...prev, file: "Please select a file" }));
      return;
    }

    const errorMessage = validateFile(selectedFile);
    if (errorMessage) {
      setFile(null);
      setErrors((prev) => ({ ...prev, file: errorMessage }));
      return;
    }

    setFile(selectedFile);
    setErrors((prev) => ({ ...prev, file: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsUploading(true);

    try {
      const payload = {
        title: formData.title.trim(),
        type: "Gifting",
        report: file,
      };

      console.log("PAYLOAD", payload);

      CreateMedia(id, payload)
        .then((response) => {
          console.log("RESPONSE", response);
          resetForm();
        })
        .catch((err) => console.log(err));
    } catch (err) {
      handleError(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleError = (err: unknown) => {
    if (axios.isAxiosError(err)) {
      const errorMessage =
        err.response?.data?.[0] ||
        err.response?.data?.message ||
        "Failed to create media";
      toast.error(errorMessage);
    } else {
      toast.error("An unexpected error occurred");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
    });
    setFile(null);
    setErrors({
      title: "",
      file: "",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  return (
    <div className="px-[20px] mt-[20px]">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="space-y-4">
          <div>
            <Input
              type="text"
              name="title"
              placeholder="Add title *"
              value={formData.title}
              onChange={handleInputChange}
              className={errors.title ? "border-red-500" : ""}
              disabled={isUploading}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          <div
            className={`mt-10 flex flex-col items-center justify-center h-[100px] border border-dotted bg-gray-200 ${
              errors.file ? "border-red-500" : ""
            }`}
          >
            <label
              htmlFor="file-upload"
              className="cursor-pointer font-medium text-[16px] text-center text-[#000000] hover:underline"
            >
              {file ? file.name : "+ Add Media (.pdf) *"}
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            {file && !errors.file && (
              <p className="text-green-500 text-xs mt-2">
                File uploaded successfully!
              </p>
            )}
            {errors.file && (
              <p className="text-red-500 text-xs mt-2">{errors.file}</p>
            )}
          </div>

          <div className="mt-[20px] flex items-center space-x-2">
            <button
              type="submit"
              disabled={isUploading}
              className="font-IBM text-[14px] text-white hover:text-[#ffffff] bg-[#000000] border border-[#000000] hover:bg-orange-500 hover:border-none py-[8px] px-[20px] rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading..." : "Save"}
            </button>
            <button
              type="button"
              className="font-IBM text-[14px] text-white hover:text-[#ffffff] bg-[#1f9abd] hover:bg-gray-200 hover:border-none py-[8px] px-[20px] rounded-full"
            >
              Watch demo
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default GiftingAddMedia;
