"use client";

import React, { useEffect, useState } from "react";
import InsightCard from "./InsightCard";
import { getSingleProject } from "@/services/api";
import { ContentItem } from "@/types/contents";
import { useRouter } from "next/router";

const ProjectSingleInsight = () => {
  const { query } = useRouter();

  const [content, setContent] = useState<ContentItem | null>(null);
  const { id } = query;

  useEffect(() => {
    if (!!id) {
      getSingleProject(Number(id)).then((fetchedContent) => {
        setContent(fetchedContent);
      });
    }
  }, [id]);

  return (
    <div className="mt-[20px] relative ">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[10px] 2xl:gap-[20px] relative">
        <div className="w-full">
          <InsightCard
            title="TOTAL INVESTMENT "
            value={`${content?.total_investment?.toLocaleString() || 0}`}
            percentageChange="↑ 5%"
            extraClass="h-[220px]"
            percentageColor="#11cc48"
            info="The total revenue is the overall amount of money generated from the sale of goods or services before any expenses are deducted."
          />
        </div>
        <div className=" w-full">
          <InsightCard
            title="TOTAL REVENUE"
            value={`${content?.total_revenue?.mininum?.toLocaleString() || 0}`}
            maxValue={`${content?.total_revenue?.maximum?.toLocaleString() || 0}`}
            extraClass="h-[220px]"
            percentageChange="↓ -3%"
            percentageColor="#ff4d4f"
            info="The total revenue is the overall amount of money generated from the sale of goods or services before any expenses are deducted."
          />
        </div>

        <div className="w-full">
          <InsightCard
            title="AUDIENCE GROWTH"
            value={`${content?.total_audience_growth?.toLocaleString() || 0}`}
            extraClass="h-[220px]"
            percentageChange="↓ -3%"
            percentageColor="#ff4d4f"
            info="The total revenue is the overall amount of money generated from the sale of goods or services before any expenses are deducted."
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectSingleInsight;
