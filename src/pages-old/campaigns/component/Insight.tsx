import React, { useState } from "react";
import InsightCard from "./InsightCard";
import { Dialog } from "primereact/dialog";

const Insight = () => {
  const [exportModal, setExportModal] = useState(false);
  return (
    <div>
      <div className="mt-[20px] relative ">
        <div className="grid lg:grid-cols-2 gap-[20px] relative mb-[200px]">
          <div className="w-full">
            <InsightCard
              title="TOTAL INVESTMENT "
              value="$100"
              percentageChange="5%"
              percentageColor="#11cc48"
              // height="300px"
              extraClass="h-[400px] lg:h-[300px]"
              selectOptions={[
                [
                  { value: "", label: "Lifetime" },
                  { value: "2004", label: "2004" },
                  { value: "2022", label: "2022" },
                  { value: "2024", label: "2024" },
                ],
                [
                  { value: "", label: "Month" },
                  { value: "january", label: "January" },
                  { value: "february", label: "February" },
                  { value: "march", label: "March" },
                ],
              ]}
            />
          </div>

          <InsightCard
            title="TOTAL REVENUE"
            value="$100M+ "
            percentageChange="-3%"
            percentageColor="#ff4d4f"
            // height="300px"

            extraClass="h-[400px] lg:h-[300px]"
            selectOptions={[
              [
                { value: "", label: "Lifetime" },
                { value: "2021", label: "2021" },
                { value: "2022", label: "2022" },
              ],
              [
                { value: "", label: "Month" },
                { value: "january", label: "January" },
                { value: "february", label: "February" },
                { value: "march", label: "March" },
              ],
            ]}
          />

          <InsightCard
            title=" TOTAL CAMPAIGNS "
            value="1000"
            percentageChange="-3%"
            percentageColor="#ff4d4f"
            // height="300px"
            extraClass="h-[400px] lg:h-[300px]"
            selectOptions={[
              [
                { value: "", label: "Lifetime" },
                { value: "2021", label: "2021" },
                { value: "2022", label: "2022" },
              ],
              [
                { value: "", label: "Month" },
                { value: "january", label: "January" },
                { value: "february", label: "February" },
                { value: "march", label: "March" },
              ],
              [
                { value: "", label: "Status" },
                { value: "ongoing", label: "Ongoing" },
                { value: "completed", label: "Completed" },
              ],
            ]}
          />
          <InsightCard
            title=" TOTAL ARTISTS "
            value="100 "
            percentageChange="-3%"
            percentageColor="#ff4d4f"
            // height="300px"

            extraClass="h-[400px] lg:h-[300px]"
            selectOptions={[
              [
                { value: "", label: "Lifetime" },
                { value: "2021", label: "2021" },
                { value: "2022", label: "2022" },
              ],
              [
                { value: "", label: "Month" },
                { value: "january", label: "January" },
                { value: "february", label: "February" },
                { value: "march", label: "March" },
              ],
            ]}
          />
        </div>

        <div className="fixed bottom-[30px] lg:left-32 right-0 flex justify-center z-30 w-full">
          <div className="bg-white border border-gray-300 rounded p-[8px] flex items-center gap-[10px]">
            <p
              className="rounded p-[8px] bg-black text-white !w-[70px] text-center cursor-pointer"
              onClick={() => setExportModal(true)}
            >
              Export
            </p>
            <p className="rounded p-[8px] bg-[#007bff] text-white w-[70px] text-center">
              Send
            </p>
            <p className="rounded border p-[8px] text-black bg-white w-[70px] text-center">
              Share
            </p>
          </div>
        </div>
      </div>

      <div
        className={`custom-dialog-overlay ${
          exportModal
            ? "bg-black/30 backdrop-blur-md fixed inset-0 z-50"
            : "hidden"
        }`}
      >
        <Dialog
          visible={exportModal}
          onHide={() => {
            setExportModal(false);
          }}
          breakpoints={{ "960px": "75vw", "640px": "100vw" }}
          style={{ width: "30vw" }}
          className="custom-dialog-overlay"
        >
          <div className="space-y-4">
            <p className="text-[16px] font-[400]">
              Select your preferred format
            </p>

            <div className=" grid grid-cols-2 gap-[10px]">
              <div className=" border rounded-[8px] border-black hover:border-blue-500">
                PDF
              </div>
              <div className="border rounded-[8px] border-black hover:border-blue-500">
                CSV
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Insight;
