"use client";
import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { FiInfo } from "react-icons/fi";
import { PiCalendarPlus } from "react-icons/pi";
import RadioData from "./RadioData";
import TVData from "./TvData";
import { ContentItem } from "@/types/contents";
import { useRouter } from "next/router";
import { AddAirplayData, getChannel } from "@/services/api";
import { WeekInput } from "@/components/ui/weekInput";
import { SelectInput } from "@/components/ui/selectinput";

interface CompanyDetailsFormProps {
  visible: boolean;
  onHide: () => void;
  onAddDataSuccess: () => void;
  existingAirPlayData: any;
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

interface AirPlayData {
  airplay_id: number;
  metric_id: number;
  week_1: string;
  week_2: string;
  week_3: string;
  week_4: string;
}

const initialAirPlayData: AirPlayData = {
  airplay_id: 0,
  metric_id: 1,
  week_1: "",
  week_2: "",
  week_3: "",
  week_4: "",
};

const AddData: React.FC<CompanyDetailsFormProps> = ({
  visible,
  onHide,
  onAddDataSuccess,
  existingAirPlayData,
}) => {
  const { query } = useRouter();
  const { id } = query;
  const [activeDetailsTab, setActiveDetailsTab] = useState("Radio");
  const [stations, setStations] = useState<ContentItem[]>([]);
  const [isAddNewService, setIsAddNewService] = useState(false);
  const [processedData, setProcessedData] = useState<any>([]);

  const [airPlayData, setAirPlayData] = useState<AirPlayData[]>([
    { ...initialAirPlayData },
  ]);
  const [errors, setErrors] = useState<{
    [key: string]: { airplay_id?: string; weeks?: string };
  }>({});

  useEffect(() => {
    getChannel().then((content: any) => {
      const radioContent = content.filter(
        (item: any) => item.channel === activeDetailsTab
      );
      setStations(radioContent);
    });
  }, [activeDetailsTab]);

  const resetForm = () => {
    setAirPlayData([{ ...initialAirPlayData }]);
    setErrors({});
  };

  const stationOptions = [
    {
      value: 99999,
      label: "Add new service",
    },
    ...stations.map((station) => ({
      value: station.id ?? 0,
      label: station.name ?? "",
    })),
  ];

  const addItemField = () => {
    setAirPlayData([...airPlayData, { ...initialAirPlayData }]);
  };

  const removeItemField = (index: number) => {
    setAirPlayData(airPlayData.filter((_, i) => i !== index));
  };

  const validateData = () => {
    const newErrors: {
      [key: string]: { airplay_id?: string; weeks?: string };
    } = {};

    return airPlayData.reduce((hasErrors, item, index) => {
      if (!item.airplay_id || item.airplay_id === 0) {
        newErrors[index] = {
          ...newErrors[index],
          airplay_id: "Please select a service",
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
        air_play_data: airPlayData.map((item) => ({
          ...item,
          week_1: Number(item.week_1),
          week_2: Number(item.week_2),
          week_3: Number(item.week_3),
          week_4: Number(item.week_4),
        })),
      };

      console.log(payload);
      try {
        await AddAirplayData(payload, Number(id));
        console.log("Form submitted successfully!");
        onAddDataSuccess();
        resetForm();
      } catch (err) {
        console.error("Error submitting form:", err);
      }
    }
  };

  const updateAirPlayData = (
    index: number,
    field: keyof AirPlayData,
    value: string | number
  ) => {
    setAirPlayData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const updateAllAirPlayIds = (newId: number) => {
    setAirPlayData((prev) =>
      prev.map((item) => ({ ...item, metric_id: newId }))
    );
  };

  const placeholder = activeDetailsTab === "Radio" ? "Spins" : "Plays";

  useEffect(() => {
    const processAirplayData = (items: any[]) => {
      // Filter items where airplay.channel matches activeDetailsTab
      const filteredItems = items.filter(
        (item) => item?.airplay?.channel === activeDetailsTab
      );

      if (filteredItems.length === 0) return [];

      // Map each filtered item to create the station data
      return filteredItems.map((item) => {
        // Initialize aggregated weeks
        const aggregatedWeeks = {
          week_1: 0,
          week_2: 0,
          week_3: 0,
          week_4: 0,
        };

        // Sum up all metrics data for each week
        item.airplay_data?.forEach((metricItem: any) => {
          aggregatedWeeks.week_1 += metricItem.week_1 || 0;
          aggregatedWeeks.week_2 += metricItem.week_2 || 0;
          aggregatedWeeks.week_3 += metricItem.week_3 || 0;
          aggregatedWeeks.week_4 += metricItem.week_4 || 0;
        });

        // Return a combined object with station info and aggregated weeks
        return {
          id: item.airplay.id,
          name: item.airplay.name,
          channel: item.airplay.channel,
          ...aggregatedWeeks,
        };
      });
    };

   

    if (!!existingAirPlayData) {
      const processedData = processAirplayData(existingAirPlayData);
      setProcessedData(processedData);
    }
  }, [existingAirPlayData, activeDetailsTab]);

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
          style={{ width: "80vw" }}
          className="font-IBM !overflow-y-auto"
        >
          <div className="">
            <div className=" flex items-center space-x-2 ">
              <p className=" text-[32px] font-[500] text-[#212529]">Airplay</p>{" "}
              <Tooltip info="The total revenue is the overall amount of money generated from the sale of goods or services before any expenses are deducted." />
            </div>

            <div className=" grid md:flex items-center space-x-4">
              <div className=" cursor-pointer inline-flex items-center space-x-2 py-[8px] px-[16px] border border-[#000000] text-[400] text-[16px] text-[#000000] hover:text-[#ffffff] hover:bg-[#000000] hover:border-none rounded-full">
                <PiCalendarPlus />
                <p>add report (.xls, .csv)</p>
              </div>
              <p className=" font-[400] text-[16px] text-[#212529]">or</p>
              <div className="cursor-pointer inline-flex items-center space-x-2 py-[8px] px-[16px] border border-[#000000] text-[400] text-[16px] text-[#000000] hover:text-[#ffffff] hover:bg-[#000000] hover:border-none rounded-full">
                <PiCalendarPlus />

                <p>Automate</p>
              </div>
            </div>
            <div className="text-[16px] font-[400] flex gap-[20px] items-center mt-[10px]">
              <button
                className={`text-center py-2 px-[16px] ${
                  activeDetailsTab === "Radio"
                    ? "  border-b border-[#212529] text-[#000000]"
                    : ""
                }`}
                onClick={() => {
                  updateAllAirPlayIds(1);
                  setActiveDetailsTab("Radio");
                }}
              >
                Radio
              </button>
              <button
                className={`text-center py-2 px-[16px]${
                  activeDetailsTab === "TV"
                    ? "  border-b border-[#212529] text-[#000000]"
                    : ""
                }`}
                onClick={() => {
                  updateAllAirPlayIds(2);
                  setActiveDetailsTab("TV");
                }}
              >
                TV
              </button>
            </div>

            <div>
              <div className="mt-5 space-y-5 md:space-y-1 max-h-[400px] overflow-auto">
                {processedData.map((metricData: any, idx: any) => (
                  <div className="flex flex-col md:flex-row item-center gap-2 md:gap-5">
                    <div className="max-w-[200px] w-full">
                      <div className="bg-gray-300 border border-black rounded-xl p-3">
                        {metricData.name}
                      </div>
                    </div>

                    <div key={idx} className="flex flex-row items-center gap-2">
                      {["week_1", "week_2", "week_3", "week_4"].map((week) => (
                        <WeekInput
                          key={`${metricData.id}-${week}`}
                          type="number"
                          name={`${metricData.id}-${week}`}
                          label={`WEEK ${week.slice(-1)}`}
                          placeholder={placeholder}
                          value={metricData[week]}
                          disabled={true}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="scrollbar-hide">
                <div className="mt-5 space-y-5 max-h-[400px] overflow-auto">
                  {airPlayData.map((item, index) => (
                    <div key={index} className="flex items-center gap-5">
                      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-end gap-5">
                        <div className="max-w-[200px] w-full">
                          <SelectInput
                            icon={true}
                            name="service"
                            options={stationOptions}
                            placeholder="Select Station"
                            value={item.airplay_id || ""}
                            onChange={(value: string | number) => {
                              const selectedValue = Number(value);
                              if (selectedValue === 99999) {
                                setIsAddNewService(true);
                              } else {
                                updateAirPlayData(
                                  index,
                                  "airplay_id",
                                  selectedValue
                                );
                              }
                            }}
                          />
                          {errors[index]?.airplay_id && (
                            <p className="text-red-500 text-xs">
                              {errors[index].airplay_id}
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
                                placeholder={
                                  activeDetailsTab === "Radio"
                                    ? "Spins"
                                    : "Plays"
                                }
                                value={item[week as keyof AirPlayData] || ""}
                                onChange={(e) =>
                                  updateAirPlayData(
                                    index,
                                    week as keyof AirPlayData,
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
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default AddData;
