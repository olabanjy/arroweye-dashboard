import React, { useEffect, useState } from "react";
import { SelectInput } from "@/components/ui/selectinput";
import { WeekInput } from "@/components/ui/weekInput";
import { AddAirplayData, getChannel } from "@/services/api";
import { ContentItem } from "@/types/contents";
import { useRouter } from "next/router";

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

const RadioData = () => {
  const { query } = useRouter();
  const { id } = query;
  const [radioStations, setRadioStations] = useState<ContentItem[]>([]);
  const [isAddNewService, setIsAddNewService] = useState(false);

  const [airPlayData, setAirPlayData] = useState<AirPlayData[]>([
    { ...initialAirPlayData },
  ]);

  const [errors, setErrors] = useState<{
    [key: string]: { airplay_id?: string; weeks?: string };
  }>({});

  useEffect(() => {
    getChannel().then((content: any) => {
      const radioContent = content.filter(
        (item: any) => item.channel === "Radio"
      );
      setRadioStations(radioContent);
    });
  }, []);

  const resetForm = () => {
    setAirPlayData([{ ...initialAirPlayData }]);
    setErrors({});
  };

  const stationOptions = [
    {
      value: 99999,
      label: "Add new service",
    },
    ...radioStations.map((station) => ({
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

      try {
        await AddAirplayData(payload, Number(id));
        console.log("Form submitted successfully!");
        resetForm(); // Reset form after successful submission
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

  return (
    <div>
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
                        updateAirPlayData(index, "airplay_id", selectedValue);
                      }
                    }}
                  />
                  {errors[index]?.airplay_id && (
                    <p className="text-red-500 text-xs">
                      {errors[index].airplay_id}
                    </p>
                  )}
                </div>

                {["week_1", "week_2", "week_3", "week_4"].map((week) => (
                  <div key={week} className="max-w-[150px] w-full">
                    <WeekInput
                      type="number"
                      name={week}
                      label={`WEEK ${week.slice(-1)}`}
                      placeholder="Spins"
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
                ))}
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
  );
};

export default RadioData;
