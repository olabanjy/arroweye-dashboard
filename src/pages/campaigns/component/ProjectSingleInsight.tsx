import React from "react";
import InsightCard from "./InsightCard";

const ProjectSingleInsight = () => {
  return (
    <div className="mt-[20px] relative ">
      <div className="grid lg:grid-cols-3 gap-[10px] 2xl:gap-[20px] relative">
        <div className="w-full">
          <InsightCard
            title="TOTAL INVESTMENT "
            value="$100"
            percentageChange="5%"
            extraClass="h-[220px]"
            percentageColor="#11cc48"
            info="The total revenue is the overall amount of money generated from the sale of goods or services before any expenses are deducted."
          />
        </div>
        <div className=" w-full">
          <InsightCard
            title="TOTAL REVENUE"
            value="$100M+ "
            extraClass="h-[220px]"
            percentageChange="-3%"
            percentageColor="#ff4d4f"
            info="The total revenue is the overall amount of money generated from the sale of goods or services before any expenses are deducted."
          />
        </div>

        <div className="">
          <InsightCard
            title=" AUDIENCE GROWTH"
            value="1000"
            extraClass="h-[220px]"
            percentageChange="-3%"
            percentageColor="#ff4d4f"
            info="The total revenue is the overall amount of money generated from the sale of goods or services before any expenses are deducted."
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectSingleInsight;
