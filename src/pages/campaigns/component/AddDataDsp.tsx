"use client";
import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { FiInfo } from "react-icons/fi";
import { PiCalendarPlus } from "react-icons/pi";
import { ContentItem } from "@/types/contents";
import { getDsp } from "@/services/api";
import AppleMusicData from "./AppleMusicData";
import SpotifyData from "./SpotifyData";
import YoutubeData from "./YoutubeData";

interface CompanyDetailsFormProps {
  visible: boolean;
  onHide: () => void;
}

const Tooltip = ({ info }: { info: string }) => (
  <div className="relative group hidden">
    <FiInfo className="text-gray-400 hover:text-blue-500 cursor-pointer" />
    <div className="absolute font-[300] right-0 transform bottom-full mb-1 hidden w-48 p-2 text-xs text-white bg-black rounded-lg group-hover:block z-10 shadow-lg">
      {info}
    </div>
  </div>
);

const AddDataDsp: React.FC<CompanyDetailsFormProps> = ({ visible, onHide }) => {
  const [activeDetailsTab, setActiveDetailsTab] = useState<string>("");
  const [content, setContent] = useState<ContentItem[] | null>(null);

  console.log(activeDetailsTab);
  useEffect(() => {
    getDsp().then((fetchedContent) => {
      setContent(fetchedContent);

      if (fetchedContent && fetchedContent.length > 0) {
        setActiveDetailsTab(fetchedContent[0].name || "");
      }
    });
  }, []);

  return (
    <>
      <div
        className={`custom-dialog-overlay ${
          visible ? "bg-black/30 backdrop-blur-md fixed inset-0 z-50" : "hidden"
        }`}
      >
        <Dialog
          visible={visible}
          onHide={onHide}
          breakpoints={{ "960px": "75vw", "640px": "100vw" }}
          style={{ width: "80vw" }}
          className="font-IBM !overflow-y-auto"
        >
          <div className="">
            <div className="flex items-center space-x-2">
              <p className="text-[32px] font-[500] text-[#212529]">DSP</p>
              <Tooltip info="The total revenue is the overall amount of money generated from the sale of goods or services before any expenses are deducted." />
            </div>

            <div className="grid md:flex items-center space-x-4">
              <div className="cursor-pointer inline-flex items-center space-x-2 py-[8px] px-[16px] border border-[#000000] text-[400] text-[16px] text-[#000000] hover:text-[#ffffff] hover:bg-[#000000] hover:border-none rounded-full">
                <PiCalendarPlus />
                <p>add report (.xls, .csv)</p>
              </div>
              <p className="font-[400] text-[16px] text-[#212529]">or</p>
              <div className="cursor-pointer inline-flex items-center space-x-2 py-[8px] px-[16px] border border-[#000000] text-[400] text-[16px] text-[#000000] hover:text-[#ffffff] hover:bg-[#000000] hover:border-none rounded-full">
                <PiCalendarPlus />
                <p>Automate</p>
              </div>
            </div>

            <div className="text-[16px] font-[400] flex gap-[20px] items-center mt-[10px]">
              {content &&
                content.map((item) => (
                  <button
                    key={item.id}
                    className={`text-center py-2 px-[16px] ${
                      activeDetailsTab === item.name
                        ? "border-b border-[#212529] text-[#000000]"
                        : ""
                    }`}
                    onClick={() => setActiveDetailsTab(item.name || "")}
                  >
                    {item.name}
                  </button>
                ))}
            </div>

            {activeDetailsTab === "Apple" && <AppleMusicData />}
            {activeDetailsTab === "Spotify" && <SpotifyData />}
            {activeDetailsTab === "YouTube" && <YoutubeData />}
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default AddDataDsp;
