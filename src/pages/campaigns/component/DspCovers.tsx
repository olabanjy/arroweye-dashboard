"use client";
import { Input } from "@/components/ui/input";
import { CreateMedia } from "@/services/api";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";

type MediaItem = {
  file: File;
  // embed_link: string;
};

const DspCovers = () => {
  const router = useRouter();
  const id = Number(router.query.id);

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files ? Array.from(e.target.files) : [];
    const validFiles = uploadedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length !== uploadedFiles.length) {
      alert("Only image files are allowed.");
    }

    const newMediaItems: MediaItem[] = validFiles.map((file) => ({
      file,
    }));

    setMediaItems((prev) => [...prev, ...newMediaItems]);
  };

  const removeMediaItem = (index: number) => {
    setMediaItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mediaItems.length === 0) {
      alert("Please upload at least one set of images.");
      return;
    }

    console.log("ITEMS", mediaItems);

    // Convert the array to JSON
    const requestData = new FormData();
    requestData.append("files", JSON.stringify(mediaItems));
    requestData.append("type", "DSP_Covers");

    try {
      CreateMedia(id, requestData)
        .then((response) => {
          console.log("RESPONSE", response);
          setMediaItems([]); // Clear the form
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.error("Error submitting form:", err);
    }
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
              accept=".jpg, .png,.jpeg,.gif"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          <div className="mt-4 space-y-[20px] max-h-[300px] overflow-auto">
            {mediaItems.map((item, index) => (
              <div key={index} className="space-y-[10px]">
                <div className="flex gap-[10px] items-center flex-wrap">
                  <div className="relative grid gap-[10px] lg:flex lg:gap-[20px] items-center">
                    <Image
                      src={URL.createObjectURL(item.file)}
                      alt={`uploaded-${index}`}
                      width={80}
                      height={80}
                      className="w-[80px] h-[80px] object-cover rounded"
                    />
                    {/* <Input
                      type="text"
                      placeholder="Enter link"
                      value={item.embed_link}
                      onChange={(e) => handleLinkChange(index, e.target.value)}
                      className="w-full rounded-full"
                    /> */}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMediaItem(index)}
                    className="text-[#000000] text-xs"
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
              className="font-IBM text-[14px] text-white bg-[#000000] border border-[#000000] hover:bg-orange-500 py-[8px] px-[20px] rounded"
            >
              Save
            </button>
            <button className="font-IBM text-[14px] text-white bg-[#1f9abd] hover:bg-gray-200 py-[8px] px-[20px] rounded">
              Watch demo
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DspCovers;
