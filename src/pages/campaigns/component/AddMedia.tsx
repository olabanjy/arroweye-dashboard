"use client";
import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { FiInfo } from "react-icons/fi";
import Moments from "./Moments";
import Recap from "./Recap";
import DspCovers from "./DspCovers";

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

const AddMedia: React.FC<CompanyDetailsFormProps> = ({ visible, onHide }) => {
  const [activeDetailsTab, setActiveDetailsTab] = useState("moments");

  return (
    <>
      <div
        className={`custom-dialog-overlay  ${
          visible ? "bg-black/30 backdrop-blur-md fixed inset-0 z-50" : "hidden"
        }`}
      >
        <Dialog
          visible={visible}
          onHide={onHide}
          breakpoints={{ "960px": "75vw", "640px": "100vw" }}
          style={{ width: "50vw" }}
          className="font-IBM !overflow-y-auto"
        >
          <div className="">
            <div className=" flex items-center space-x-2 ">
              <p className=" text-[32px] font-[500] text-[#212529]">Media </p>{" "}
              <Tooltip info="The total revenue is the overall amount of money generated from the sale of goods or services before any expenses are deducted." />
            </div>

            <div className="text-[16px] font-[400] flex gap-[20px] items-center mt-[10px]">
              <button
                className={`text-center py-2 px-[16px] ${
                  activeDetailsTab === "moments"
                    ? "  border-b border-[#212529] text-[#000000]"
                    : ""
                }`}
                onClick={() => setActiveDetailsTab("moments")}
              >
                Moments
              </button>
              <button
                className={`text-center py-2 px-[16px]${
                  activeDetailsTab === "Recap"
                    ? "  border-b border-[#212529] text-[#000000]"
                    : ""
                }`}
                onClick={() => setActiveDetailsTab("Recap")}
              >
                Recap
              </button>
              <button
                className={`text-center py-2 px-[16px]${
                  activeDetailsTab === "Dsp"
                    ? "  border-b border-[#212529] text-[#000000]"
                    : ""
                }`}
                onClick={() => setActiveDetailsTab("Dsp")}
              >
                DSP COVERS
              </button>
            </div>

            {activeDetailsTab === "moments" && <Moments />}
            {activeDetailsTab === "Recap" && <Recap />}
            {activeDetailsTab === "Dsp" && <DspCovers />}
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default AddMedia;
