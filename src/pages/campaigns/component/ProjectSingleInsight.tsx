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

  function formatNumber(num: any) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num.toString();
  }

  return (
    <div className="mt-[20px] relative ">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[10px] 2xl:gap-[20px] relative">
        <div className="w-full">
          <InsightCard
            title="TOTAL INVESTMENT"
            currency={<>$</>}
            value={formatNumber(content?.total_investment || 0)}
            extraClass="h-[220px]"
            percentageColor="#11cc48"
            info="This represents the total amount invoiced for executing this campaign. You can download the invoice under the 'Payments' section."
          />
        </div>
        <div className=" w-full">
          <InsightCard
            title="TOTAL REVENUE"
            currency={<>$</>}
            value={`${formatNumber(content?.total_revenue?.mininum || 0)}`}
            maxValue={`${formatNumber(content?.total_revenue?.maximum || 0)}`}
            extraClass="h-[220px]"
            percentageChange={content?.total_revenue?.percentage}
            percentageColor={
              content?.total_revenue?.change === "increase"
                ? "#11cc48"
                : "#ff4d4f"
            }
            increaseType={content?.total_revenue?.change}
            info="This is the estimated revenue range generated from streams, purchases, and views for this campaign. These figures are estimates; please confirm the actual revenue with your distributor."
          />
        </div>

        <div className="w-full">
          <InsightCard
            title="AUDIENCE GROWTH"
            value={`${formatNumber(content?.total_audience_growth?.value || 0)}`}
            extraClass="h-[220px]"
            percentageChange={content?.total_audience_growth?.percentage}
            percentageColor={
              content?.total_audience_growth?.change === "increase"
                ? "#11cc48"
                : "#ff4d4f"
            }
            increaseType={content?.total_audience_growth?.change}
            info="The total number of followers, subscribers, and audience members who engaged with your channels during this campaign."
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectSingleInsight;
