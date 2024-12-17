import React from "react";
import PieChart from "@/pages/payments/component/PieChart";
import { ChartData } from "chart.js";

const chartData: ChartData<"pie", number[], string> = {
  labels: ["Channel 1", "Channel 2", "Channel 3"],
  datasets: [
    {
      label: "Dataset 1",
      data: [300, 50, 100],
      backgroundColor: ["#FF5733", "#33FF57", "#3357FF"],
      borderColor: "#fff",
      borderWidth: 1,
    },
  ],
};

const selectOptions = [
  [
    { value: "local", label: "Local TV" },
    { value: "channels", label: "Channels" },
    { value: "radio", label: "Radio" },
    { value: "dj", label: "Dj" },
    { value: "cable", label: "Cable" },
  ],
];

const InsightChart = () => {
  return (
    <div className="mt-[20px] relative px-[20px]">
      <div className="grid md:grid-cols-2 place-items-center gap-[20px]">
        <PieChart
          title="AIRPLAY"
          value="1M"
          selectOptions={selectOptions}
          chartData={chartData}
          maxWidth="600px"
        />
        <PieChart
          title="AIRPLAY"
          value="1M"
          selectOptions={selectOptions}
          chartData={chartData}
          maxWidth="600px"
        />
        <PieChart
          title="AIRPLAY"
          value="1M"
          selectOptions={selectOptions}
          chartData={chartData}
          maxWidth="600px"
        />
        <PieChart
          title="AIRPLAY"
          value="1M"
          selectOptions={selectOptions}
          chartData={chartData}
          maxWidth="600px"
        />
        <PieChart
          title="AIRPLAY"
          value="1M"
          selectOptions={selectOptions}
          chartData={chartData}
          maxWidth="600px"
        />
        <PieChart
          title="AIRPLAY"
          value="1M"
          selectOptions={selectOptions}
          chartData={chartData}
          maxWidth="600px"
        />
      </div>

      <div className="fixed bottom-[50px] inset-x-0 flex justify-center">
        <div className="bg-white border border-gray-300 rounded p-[8px] inline-flex items-center gap-[10px] shadow-md">
          <button className="rounded p-[8px] bg-black text-white hover:bg-gray-800">
            Export
          </button>
          <button className="rounded p-[8px] bg-[#007bff] text-white hover:bg-blue-600">
            Send
          </button>
          <button className="rounded border p-[8px] text-black bg-white hover:bg-gray-100">
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsightChart;
