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
  embed_link: string;
  source_link: string;
  download_link: string;
}

interface FormErrors {
  file: string;
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes

const ShazamAddMedia = () => {
  const router = useRouter();
  const id = Number(router.query.id);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({
    file: "",
  });
  const [isUploading, setIsUploading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      file: "",
    };

    let isValid = true;

    if (!file) {
      newErrors.file = "Please upload a zip file";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateFile = (selectedFile: File): string => {
    if (!selectedFile.name.toLowerCase().endsWith(".zip")) {
      return "Please upload only .zip files";
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
        type: "Shazam",
        countries: selectedCountries,
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
    setSelectedCountries([]);
    setFile(null);
    setErrors({
      file: "",
    });
  };

  return (
    <div className="px-[20px] mt-[20px]">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="space-y-4">
          <div>
            <CountrySelector
              selectedCountries={selectedCountries}
              setSelectedCountries={setSelectedCountries}
            />
          </div>

          <div
            className={`flex flex-col items-center justify-center h-[100px] border border-dotted bg-gray-200 ${
              errors.file ? "border-red-500" : ""
            }`}
          >
            <label
              htmlFor="file-upload"
              className="cursor-pointer font-medium text-[16px] text-center text-[#000000] hover:underline"
            >
              {file ? file.name : "+ Add Shazam report (.zip) *"}
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".zip"
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
              className="font-IBM text-[14px] text-white hover:text-[#ffffff] bg-[#000000] border border-[#000000] hover:bg-orange-500 hover:border-none py-[8px] px-[20px] rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading..." : "Save"}
            </button>
            <button
              type="button"
              className="font-IBM text-[14px] text-white hover:text-[#ffffff] bg-[#1f9abd] hover:bg-gray-200 hover:border-none py-[8px] px-[20px] rounded"
            >
              Watch demo
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ShazamAddMedia;
