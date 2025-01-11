import React from "react";
import InsightCard from "./InsightCard";

const Insight = () => {
  return (
    <div>
      <div className=" mt-[20px] relative">
        <div className=" grid md:grid-cols-2 gap-[20px] ">
          <InsightCard
            title="Total Invoices"
            value={100}
            percentageChange="5%"
            percentageColor="#11cc48"
            maxWidth=" w-full"
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
              [
                { value: "", label: "Status" },
                { value: "pending", label: "Pending" },
                { value: "paid", label: "Paid" },
              ],
            ]}
          />

          <InsightCard
            title="Total Revenue"
            value="$500,000"
            percentageChange="-3%"
            percentageColor="#ff4d4f"
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
                { value: "pending", label: "Pending" },
                { value: "paid", label: "Paid" },
              ],
            ]}
          />

          <InsightCard
            title="Total Licences"
            value="500"
            percentageChange="-3%"
            percentageColor="#ff4d4f"
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
                { value: "pending", label: "Pending" },
                { value: "paid", label: "Paid" },
              ],
            ]}
          />
          <InsightCard
            title="Total Revenue Licences"
            value="$500,000"
            percentageChange="-3%"
            percentageColor="#ff4d4f"
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
                { value: "pending", label: "Pending" },
                { value: "paid", label: "Paid" },
              ],
            ]}
          />
        </div>

        <div className="fixed bottom-[20px] inset-x-0 flex justify-center">
          <div className="bg-white border border-gray-300 rounded p-[8px] inline-flex items-center gap-[10px]">
            <p className="rounded p-[8px] bg-black text-white">Export</p>
            <p className="rounded p-[8px] bg-[#007bff] text-white">Send</p>
            <p className="rounded border p-[8px] text-black bg-white">Share</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insight;
