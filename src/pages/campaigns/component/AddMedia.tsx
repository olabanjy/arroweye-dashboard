import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { FiInfo } from "react-icons/fi";
import Moments from "./Moments";
import Recap from "./Recap";
import DspCovers from "./DspCovers";
import ShazamAddMedia from "./ShazamAddMedia";
import GiftingAddMedia from "./GiftingAddMedia";
import EditorialAddMedia from "./EditorialAddMedia";

interface CompanyDetailsFormProps {
  visible: boolean;
  onHide: () => void;
  initialTab?: "moments" | "Recap" | "Dsp" | "Shazam" | "Editorial" | "Gifting";
}

const Tooltip = ({ info }: { info: string }) => (
  <div className="relative group">
    <FiInfo className="text-gray-400 hover:text-blue-500 cursor-pointer" />
    <div className="absolute left-[25px] top-0 transform  ml-1 hidden w-60 p-[12px] text-xs font-[400] text-white bg-black rounded-[4px] group-hover:block z-10 shadow-lg font-IBM">
      <div className="absolute left-0 top-[10px] transform -translate-y-1/2 -ml-[6px] border-black  border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-black"></div>
      {info}
    </div>
  </div>
);

const AddMedia: React.FC<CompanyDetailsFormProps> = ({
  visible,
  onHide,
  initialTab = "moments",
}) => {
  const [activeDetailsTab, setActiveDetailsTab] = useState(initialTab);

  // Update active tab when initialTab prop changes
  useEffect(() => {
    if (visible) {
      setActiveDetailsTab(initialTab);
    }
  }, [visible, initialTab]);

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
          style={{ width: "60vw" }}
          className="font-IBM !overflow-y-auto"
        >
          <div className="">
            <div className=" flex items-center space-x-2 ">
              <p className=" text-[32px] font-[500] text-[#212529]">Media </p>{" "}
              <Tooltip info="The total revenue is the overall amount of money generated from the sale of goods or services before any expenses are deducted." />
            </div>

            <div className="text-[16px] font-[400] flex gap-[20px] items-center mt-[10px] overflow-x-auto whitespace-nowrap scrollbar-hide">
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
                className={`text-center py-2 px-[16px] ${
                  activeDetailsTab === "Recap"
                    ? "  border-b border-[#212529] text-[#000000]"
                    : ""
                }`}
                onClick={() => setActiveDetailsTab("Recap")}
              >
                Recap
              </button>
              <button
                className={`text-center py-2 px-[16px] ${
                  activeDetailsTab === "Dsp"
                    ? "  border-b border-[#212529] text-[#000000]"
                    : ""
                }`}
                onClick={() => setActiveDetailsTab("Dsp")}
              >
                DSP COVERS
              </button>
              <button
                className={`text-center py-2 px-[16px] ${
                  activeDetailsTab === "Shazam"
                    ? "  border-b border-[#212529] text-[#000000]"
                    : ""
                }`}
                onClick={() => setActiveDetailsTab("Shazam")}
              >
                SHAZAM
              </button>
              <button
                className={`text-center py-2 px-[16px] ${
                  activeDetailsTab === "Editorial"
                    ? "  border-b border-[#212529] text-[#000000]"
                    : ""
                }`}
                onClick={() => setActiveDetailsTab("Editorial")}
              >
                EDITORIAL
              </button>
              <button
                className={`text-center py-2 px-[16px] ${
                  activeDetailsTab === "Gifting"
                    ? "  border-b border-[#212529] text-[#000000]"
                    : ""
                }`}
                onClick={() => setActiveDetailsTab("Gifting")}
              >
                GIFTING
              </button>
            </div>

            {activeDetailsTab === "moments" && <Moments />}
            {activeDetailsTab === "Recap" && <Recap />}
            {activeDetailsTab === "Dsp" && <DspCovers />}
            {activeDetailsTab === "Shazam" && <ShazamAddMedia />}
            {activeDetailsTab === "Editorial" && <EditorialAddMedia />}
            {activeDetailsTab === "Gifting" && <GiftingAddMedia />}
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default AddMedia;
