"use client";
import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { FiInfo } from "react-icons/fi";
import { PiCalendarPlus } from "react-icons/pi";
import { ContentItem } from "@/types/contents";
import { CreateDspStats, getDsp, getMetric } from "@/services/api";
import AppleMusicData from "./AppleMusicData";
import SpotifyData from "./SpotifyData";
import YoutubeData from "./YoutubeData";
import { WeekInput } from "@/components/ui/weekInput";
import { SelectInput } from "@/components/ui/selectinput";
import { useRouter } from "next/router";

interface CompanyDetailsFormProps {
  visible: boolean;
  onHide: () => void;
  onAddDataSuccess: () => void;
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

interface AddDspData {
  metric_id: number;
  week_1: string;
  week_2: string;
  week_3: string;
  week_4: string;
}

const initialAddDspData: AddDspData = {
  metric_id: 1,
  week_1: "",
  week_2: "",
  week_3: "",
  week_4: "",
};

const AddDataDsp: React.FC<CompanyDetailsFormProps> = ({
  visible,
  onHide,
  onAddDataSuccess,
}) => {
  const { query } = useRouter();
  const { id } = query;
  const [activeDetailsTab, setActiveDetailsTab] = useState<string>("");
  const [content, setContent] = useState<ContentItem[] | null>(null);
  const [metric, setMetric] = useState<any>(null);
  const [isAddNewService, setIsAddNewService] = useState(false);
  const [addDspData, setAddDspData] = useState<AddDspData[]>([
    { ...initialAddDspData },
  ]);
  const [dspId, setDspID] = useState<any>("");

  const [errors, setErrors] = useState<{
    [key: string]: { metric_id?: string; weeks?: string };
  }>({});

  useEffect(() => {
    getDsp().then((fetchedContent) => {
      console.log(fetchedContent);
      setContent(fetchedContent);

      if (fetchedContent && fetchedContent.length > 0) {
        setDspID(fetchedContent[0].id || 0);
        setActiveDetailsTab(fetchedContent[0].name || "");
      }
    });
    getMetric().then((fetchedContent) => {
      setMetric(fetchedContent);
    });
  }, []);

  const customOptions = [
    {
      value: 99999,
      label: "add new metric",
      impressions: 0,
      audience: 0,
    },
    ...(metric?.map((item: any) => ({
      value: item.id ?? 0,
      label: item.name ?? "",
      impressions: item.impressions ?? 0,
      audience: item.audience ?? 0,
    })) || []),
  ];

  const resetForm = () => {
    setAddDspData([{ ...initialAddDspData }]);
    setErrors({});
  };

  const addItemField = () => {
    setAddDspData([...addDspData, { ...initialAddDspData }]);
  };

  const removeItemField = (index: number) => {
    setAddDspData(addDspData.filter((_, i) => i !== index));
  };

  const validateData = () => {
    const newErrors: {
      [key: string]: { metric_id?: string; weeks?: string };
    } = {};

    return addDspData.reduce((hasErrors, item, index) => {
      if (!item.metric_id || item.metric_id === 0) {
        newErrors[index] = {
          ...newErrors[index],
          metric_id: "Please select a Metric",
        };
        hasErrors = true;
      }

      const weeks = [item.week_1, item.week_2, item.week_3, item.week_4];
      if (weeks.some((week) => !week || isNaN(Number(week)))) {
        newErrors[index] = {
          ...newErrors[index],
          weeks: "Please enter valid values for all weeks",
        };
        hasErrors = true;
      }

      setErrors(newErrors);
      return hasErrors;
    }, false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasErrors = validateData();

    if (!hasErrors && id) {
      const payload = {
        dsp_id: dspId || 1,
        dsp_data: addDspData.map((item) => ({
          ...item,
          week_1: Number(item.week_1),
          week_2: Number(item.week_2),
          week_3: Number(item.week_3),
          week_4: Number(item.week_4),
        })),
      };

      try {
        await CreateDspStats(Number(id), payload);
        console.log("Form submitted successfully!");
        onAddDataSuccess();
        resetForm(); // Reset form after successful submission
      } catch (err) {
        console.error("Error submitting form:", err);
      }
    }
  };

  const updateAddDspData = (
    index: number,
    field: keyof AddDspData,
    value: string | number
  ) => {
    setAddDspData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

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
                    onClick={() => {
                      setDspID(item.id);
                      setActiveDetailsTab(item.name || "");
                    }}
                  >
                    {item.name}
                  </button>
                ))}
            </div>

            <div>
              <form onSubmit={handleSubmit} className="scrollbar-hide">
                <div className="mt-5 space-y-5 max-h-[400px] overflow-auto">
                  {addDspData.map((item, index) => (
                    <div key={index} className="flex items-center gap-5">
                      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-end gap-5">
                        <div className="max-w-[200px] w-full">
                          <SelectInput
                            icon={true}
                            name="service"
                            options={customOptions}
                            placeholder="Select Metric"
                            value={item.metric_id || ""}
                            onChange={(value: string | number) => {
                              const selectedValue = Number(value);
                              if (selectedValue === 99999) {
                                setIsAddNewService(true);
                              } else {
                                updateAddDspData(
                                  index,
                                  "metric_id",
                                  selectedValue
                                );
                              }
                            }}
                          />
                          {errors[index]?.metric_id && (
                            <p className="text-red-500 text-xs">
                              {errors[index].metric_id}
                            </p>
                          )}
                        </div>

                        {["week_1", "week_2", "week_3", "week_4"].map(
                          (week) => (
                            <div key={week} className="max-w-[150px] w-full">
                              <WeekInput
                                type="number"
                                name={week}
                                label={`WEEK ${week.slice(-1)}`}
                                placeholder="Spins"
                                value={item[week as keyof AddDspData] || ""}
                                onChange={(e) =>
                                  updateAddDspData(
                                    index,
                                    week as keyof AddDspData,
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          )
                        )}
                      </div>

                      {index !== 0 && (
                        <button
                          type="button"
                          className="w-10 h-10 mb-[5px] flex items-center justify-center rounded-full bg-gray-400 text-white text-xl"
                          onClick={() => removeItemField(index)}
                        >
                          -
                        </button>
                      )}

                      {index === 0 && (
                        <button
                          type="button"
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white text-xl"
                          onClick={addItemField}
                        >
                          +
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-[20px] flex items-center space-x-2">
                  <button
                    type="submit"
                    className="font-IBM text-[14px] text-white hover:text-[#ffffff] bg-[#000000] border border-[#000000] hover:bg-orange-500 hover:border-none py-[8px] px-[20px] rounded"
                  >
                    Save
                  </button>
                  <button className="font-IBM text-[14px] text-white hover:text-[#ffffff] bg-[#1f9abd] hover:bg-gray-200 hover:border-none py-[8px] px-[20px] rounded">
                    Watch demo
                  </button>
                </div>
              </form>
            </div>

            {/* {activeDetailsTab === "Apple" && <AppleMusicData />}
            {activeDetailsTab === "Spotify" && <SpotifyData />}
            {activeDetailsTab === "YouTube" && <YoutubeData />} */}
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default AddDataDsp;
