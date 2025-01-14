import React from "react";
import InsightCard from "./InsightCard";

const ProjectSingleInsight = () => {
  //
  return (
    <div className="mt-[20px] relative ">
      <div className="">
        <div className="grid lg:grid-cols-3 gap-[20px] relative">
          <div className="w-full">
            <InsightCard
              title="TOTAL INVESTMENT "
              value="$100"
              percentageChange="5%"
              percentageColor="#11cc48"
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
          </div>

          <InsightCard
            title="TOTAL REVENUE"
            value="$100M+ "
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
            title=" AUDIENCE GROWTH"
            value="1000"
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
      </div>
    </div>
  );
};

export default ProjectSingleInsight;
