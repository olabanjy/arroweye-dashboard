"use client";
import { Input } from "@/components/ui/input";
import { SelectInput } from "@/components/ui/selectinput";
import { WeekInput } from "@/components/ui/weekInput";
import { CreateChannel, getChannel, getMetric } from "@/services/api";
import { ContentItem } from "@/types/contents";
import { useRouter } from "next/router";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import { IoIosAdd, IoMdAddCircleOutline } from "react-icons/io";

interface Item {
  id: number;
  item: string;
  week_1: string;
  week_2: string;
  week_3: string;
  week_4: string;
  metric_id?: number;
  // air_play_id?: number;
  // air_play_id?: number;
}

type ServiceError = {
  metric_id: string | null;
  week_1: string | null;
  week_2: string | null;
  week_3: string | null;
  week_4: string | null;
};

type ProjectErrors = {
  air_play_data: ServiceError[];
  air_play_id: string | null;
};

interface ProjectFormData {
  project_id: number;
  air_play_id: number;
  air_play_data: {
    metric_id: number;
    week_1: string;
    week_2: string;
    week_3: string;
    week_4: string;
    audience?: number;
    impressions?: number;
    // air_play_id?: number;
  }[];
}

const RadioData = () => {
  const { query } = useRouter();
  const { id } = query;
  const [content, setContent] = useState<ContentItem[] | null>(null);
  const [metric, setMetric] = useState<ContentItem[] | null>(null);
  const [totalImpressions, setTotalImpressions] = useState(0);
  const [totalAudience, setTotalAudience] = useState(0);

  const [isAddNewService, setIsAddNewService] = useState(false);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    getChannel().then((fetchedContent) => {
      setContent(fetchedContent);
    });
    getMetric().then((fetchedContent) => {
      setMetric(fetchedContent);
    });
  }, []);

  const playsMetric = metric?.find((m) => m.name === "Plays");
  console.log(playsMetric);

  const hideDialog = () => {
    setIsAddNewService(false);

    setErrors({
      name: "",
      impressions: "",
      audience: "",
    });
  };

  const [projectFormData, setProjectFormData] = useState<ProjectFormData>({
    project_id: id ? parseInt(id as string, 10) : 0,
    air_play_id: 0,
    air_play_data: [
      {
        metric_id: playsMetric ? Number(playsMetric.id) : 0,
        week_1: "",
        week_2: "",
        week_3: "",
        week_4: "",
      },
    ],
  });

  const [projectErrors, setProjectErrors] = useState<ProjectErrors>({
    air_play_id: null,
    air_play_data: [
      {
        metric_id: null,
        week_1: null,
        week_2: null,
        week_3: null,
        week_4: null,
      },
    ],
  });

  const { totalSpins, totalServices } = projectFormData.air_play_data.reduce(
    (totals, service) => {
      const week1Value = parseFloat(service.week_1 || "0");
      const week2Value = parseFloat(service.week_2 || "0");
      const week3Value = parseFloat(service.week_3 || "0");
      const week4Value = parseFloat(service.week_4 || "0");

      const serviceSpins =
        (isNaN(week1Value) ? 0 : week1Value) +
        (isNaN(week2Value) ? 0 : week2Value) +
        (isNaN(week3Value) ? 0 : week3Value) +
        (isNaN(week4Value) ? 0 : week4Value);

      return {
        totalSpins: totals.totalSpins + serviceSpins,
        totalServices: totals.totalServices + 1,
      };
    },
    { totalSpins: 0, totalServices: 0 }
  );

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: ProjectErrors = {
      air_play_id: null,
      air_play_data: projectFormData.air_play_data.map(() => ({
        metric_id: null,
        week_1: null,
        week_2: null,
        week_3: null,
        week_4: null,
      })),
    };

    if (!projectFormData.air_play_id) {
      newErrors.air_play_id = "Please select a service.";
    }
    projectFormData.air_play_data.forEach((service, index) => {
      ["week_1", "week_2", "week_3", "week_4"].forEach((week) => {
        const weekValue = service[week as keyof typeof service];
        if (!weekValue || isNaN(parseFloat(weekValue.toString()))) {
          newErrors.air_play_data[index][
            week as keyof (typeof newErrors.air_play_data)[0]
          ] = "Please enter a valid quantity.";
        }
      });
    });

    setProjectErrors(newErrors);

    const hasErrors = newErrors.air_play_data.some((service) =>
      Object.values(service).some((value) => value !== null)
    );

    if (!hasErrors) {
      const updatedFormData = {
        ...projectFormData,
      };

      CreateChannel(updatedFormData)
        .then(() => {
          console.log("Form submitted successfully!");
          hideDialog();
        })
        .catch((err) => {
          console.error("Error submitting form:", err);
        });
    } else {
      console.log("Form has errors. Not submitting.");
    }
  };

  const customOptions = [
    {
      value: 99999,
      label: "Add new service",
      impressions: 0,
      audience: 0,
    },
    ...(content
      ?.filter((item) => item.channel === "Radio")
      .map((item) => ({
        value: item.id ?? 0,
        label: item.name ?? "",
        impressions: item.impressions ?? 0,
        audience: item.audience ?? 0,
      })) || []),
  ];

  const addItemField = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        item: "",
        week_1: "",
        week_2: "",
        week_3: "",
        week_4: "",
      },
    ]);
  };

  useEffect(() => {
    if (items.length === 0) {
      addItemField();
    }
  }, []);

  const removeItemField = (id: number) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);

    setProjectFormData((prevData) => {
      const indexToRemove = items.findIndex((item) => item.id === id);

      const updatedServices = prevData.air_play_data.filter(
        (_, index) => index !== indexToRemove
      );

      const newTotalImpressions = updatedServices.reduce(
        (sum, service) => sum + (service.impressions || 0),
        0
      );

      const newTotalAudience = updatedServices.reduce(
        (sum, service) => sum + (service.audience || 0),
        0
      );

      setTotalImpressions(newTotalImpressions);
      setTotalAudience(newTotalAudience);

      return {
        ...prevData,
        air_play_data: updatedServices,
      };
    });
  };

  const [errors, setErrors] = useState({
    name: "",
    impressions: "",
    audience: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    impressions: "",
    channel: "Radio",
    audience: "",
  });

  useEffect(() => {
    getChannel().then((fetchedContent) => {
      setContent(fetchedContent);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: "",
      impressions: "",
      audience: "",
    };

    if (!formData.name) {
      newErrors.name = "Please enter a valid name.";
    }
    if (!formData.impressions) {
      newErrors.impressions = "Please enter impressions.";
    }
    if (!formData.audience) {
      newErrors.audience = "Please enter audience.";
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (!hasErrors) {
      CreateChannel(formData)
        .then(() => {
          console.log("Form submitted successfully!");
          hideDialog();

          setFormData({
            name: "",
            impressions: "",
            audience: "",
            channel: "Radio",
          });

          getChannel().then((fetchedContent) => {
            setContent(fetchedContent);
          });
        })
        .catch((err) => {
          console.error("Error submitting form:", err);
        });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setProjectFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <form
        onSubmit={handleProjectSubmit}
        className="  scrollbar-hide scrollbar-hide::-webkit-scrollbar"
      >
        <div className="mt-[20px] space-y-[20px] h-[200px] overflow-auto  ">
          {items.map((item, index) => (
            <div className="flex items-center gap-[20px]" key={item.id}>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-end gap-[20px]">
                <div className=" max-w-[200px] w-full">
                  <SelectInput
                    icon={true}
                    name="service"
                    options={customOptions}
                    placeholder="Select Station"
                    value={projectFormData.air_play_id || ""}
                    onChange={(value: string | number) => {
                      const selectedValue = Number(value);
                      console.log("Selected Value:", selectedValue);
                      if (selectedValue === 99999) {
                        setIsAddNewService(true);
                      } else {
                        const selectedOption = customOptions.find(
                          (opt) => opt.value === selectedValue
                        );
                        const updatedItems = items.map((i) =>
                          i.id === item.id
                            ? {
                                ...i,
                                air_play_id: selectedValue,
                                impressions: selectedOption?.impressions || 0,
                                audience: selectedOption?.audience || 0,
                              }
                            : i
                        );
                        setItems(updatedItems);
                        const updatedServices = [
                          ...projectFormData.air_play_data,
                        ];
                        updatedServices[index] = {
                          ...updatedServices[index],
                          impressions: selectedOption?.impressions || 0,
                          audience: selectedOption?.audience || 0,
                        };
                        setProjectFormData((prevData) => ({
                          ...prevData,
                          air_play_data: updatedServices,
                          air_play_id: selectedValue,
                        }));
                        const newTotalImpressions = updatedServices.reduce(
                          (sum, service) => {
                            return sum + (service.impressions || 0);
                          },
                          0
                        );
                        const newTotalAudience = updatedServices.reduce(
                          (sum, service) => {
                            return sum + (service.audience || 0);
                          },
                          0
                        );
                        setTotalImpressions(newTotalImpressions);
                        setTotalAudience(newTotalAudience);
                      }
                    }}
                  />

                  {projectErrors?.air_play_id && (
                    <p className="text-red-500 text-xs">
                      {projectErrors?.air_play_id}
                    </p>
                  )}
                </div>

                <div className="max-w-[150px] w-full">
                  <WeekInput
                    type="number"
                    name="week_1"
                    label="WEEK 1"
                    placeholder="Spins"
                    value={item.week_1 || ""}
                    onChange={(e) => {
                      const updatedWeek1 = e.target.value;

                      const updatedItems = items.map((i) =>
                        i.id === item.id ? { ...i, week_1: updatedWeek1 } : i
                      );
                      setItems(updatedItems);

                      const updatedServices = [
                        ...projectFormData.air_play_data,
                      ];
                      updatedServices[index] = {
                        ...updatedServices[index],
                        week_1: updatedWeek1,
                      };
                      setProjectFormData((prevData) => ({
                        ...prevData,
                        air_play_data: updatedServices,
                      }));
                    }}
                  />
                  {projectErrors.air_play_data[index]?.week_1 && (
                    <p className="text-red-500 text-xs">
                      {projectErrors.air_play_data[index].week_1}
                    </p>
                  )}
                </div>

                <div className="max-w-[150px] w-full">
                  <WeekInput
                    type="number"
                    name="week_2"
                    label="WEEK 2"
                    placeholder="Spins"
                    value={item.week_2 || ""}
                    onChange={(e) => {
                      const updatedWeek2 = e.target.value;

                      const updatedItems = items.map((i) =>
                        i.id === item.id ? { ...i, week_2: updatedWeek2 } : i
                      );
                      setItems(updatedItems);

                      const updatedServices = [
                        ...projectFormData.air_play_data,
                      ];
                      updatedServices[index] = {
                        ...updatedServices[index],
                        week_2: updatedWeek2,
                      };
                      setProjectFormData((prevData) => ({
                        ...prevData,
                        air_play_data: updatedServices,
                      }));
                    }}
                  />
                  {projectErrors.air_play_data[index]?.week_2 && (
                    <p className="text-red-500 text-xs">
                      {projectErrors.air_play_data[index].week_2}
                    </p>
                  )}
                </div>

                <div className="max-w-[150px] w-full">
                  <WeekInput
                    type="number"
                    name="week_3"
                    label="WEEK 3"
                    placeholder="Spins"
                    value={item.week_3 || ""}
                    onChange={(e) => {
                      const updatedWeek3 = e.target.value;

                      const updatedItems = items.map((i) =>
                        i.id === item.id ? { ...i, week_3: updatedWeek3 } : i
                      );
                      setItems(updatedItems);

                      const updatedServices = [
                        ...projectFormData.air_play_data,
                      ];
                      updatedServices[index] = {
                        ...updatedServices[index],
                        week_3: updatedWeek3,
                      };
                      setProjectFormData((prevData) => ({
                        ...prevData,
                        air_play_data: updatedServices,
                      }));
                    }}
                  />
                  {projectErrors.air_play_data[index]?.week_3 && (
                    <p className="text-red-500 text-xs">
                      {projectErrors.air_play_data[index].week_3}
                    </p>
                  )}
                </div>

                <div className="max-w-[150px] w-full">
                  <WeekInput
                    type="number"
                    name="week_4"
                    label="WEEK 4"
                    placeholder="Spins"
                    value={item.week_4 || ""}
                    onChange={(e) => {
                      const updatedWeek4 = e.target.value;

                      const updatedItems = items.map((i) =>
                        i.id === item.id ? { ...i, week_4: updatedWeek4 } : i
                      );
                      setItems(updatedItems);

                      const updatedServices = [
                        ...projectFormData.air_play_data,
                      ];
                      updatedServices[index] = {
                        ...updatedServices[index],
                        week_4: updatedWeek4,
                      };
                      setProjectFormData((prevData) => ({
                        ...prevData,
                        air_play_data: updatedServices,
                      }));
                    }}
                  />
                  {projectErrors.air_play_data[index]?.week_4 && (
                    <p className="text-red-500 text-xs">
                      {projectErrors.air_play_data[index].week_4}
                    </p>
                  )}
                </div>
              </div>

              {index !== 0 && (
                <div
                  className="w-[40px] h-[40px]  mb-[5px] flex items-center justify-center rounded-full bg-gray-400 cursor-pointer"
                  onClick={() => removeItemField(item.id)}
                >
                  <p className="text-white text-xl">-</p>
                </div>
              )}
              {index === 0 && (
                <div
                  className=" mt-[10px] w-[40px] h-[40px]  flex items-center justify-center rounded-full bg-black cursor-pointer "
                  onClick={addItemField}
                >
                  <p className="text-white text-xl ">+</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className=" mt-[20px] flex items-center space-x-2">
          <button
            type="submit"
            className="font-IBM  text-[14px] text-white hover:text-[#ffffff] bg-[#000000] border border-[#000000] hover:bg-orange-500 hover:border-none py-[8px] px-[20px] rounded "
          >
            Save
          </button>
          <button className="font-IBM  text-[14px] text-white hover:text-[#ffffff] bg-[#1f9abd]  hover:bg-gray-200 hover:border-none py-[8px] px-[20px] rounded ">
            Watch demo
          </button>
        </div>

        <div className="mt-[20px] grid lg:grid-cols-2 space-y-2">
          <p className="font-[400] text-[#212529] text-[16px]">
            Total Stations:{totalServices}
          </p>
          <p className="font-[400] text-[#212529] text-[16px]">
            Total Spins: {totalSpins}
          </p>
          <p className="font-[400] text-[#212529] text-[16px]">
            Total Audience: {totalAudience.toLocaleString()}
          </p>
          <p className="font-[400] text-[#212529] text-[16px]">
            Total Impressions: {totalImpressions.toLocaleString()}
          </p>
        </div>
      </form>

      <div
        className={`custom-dialog-overlay ${
          isAddNewService
            ? "bg-black/30 backdrop-blur-md fixed inset-0 z-50"
            : "hidden"
        }`}
      >
        <Dialog
          header="Add Radio Channel"
          visible={isAddNewService}
          onHide={hideDialog}
          breakpoints={{ "960px": "75vw", "640px": "100vw" }}
          style={{ width: "35vw" }}
          className="custom-dialog-overlay"
        >
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Input
                  type="text"
                  name="name"
                  placeholder="Radio Name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name}</p>
                )}
              </div>
              <div>
                <Input
                  type="number"
                  name="audience"
                  placeholder="Audience"
                  value={formData.audience}
                  onChange={handleInputChange}
                />
                {errors.audience && (
                  <p className="text-red-500 text-xs">{errors.audience}</p>
                )}
              </div>
              <div>
                <Input
                  type="number"
                  name="impressions"
                  placeholder="Impression"
                  value={formData.impressions}
                  onChange={handleInputChange}
                />
                {errors.impressions && (
                  <p className="text-red-500 text-xs">{errors.impressions}</p>
                )}
              </div>

              <div className=" hidden">
                <div className="flex items-center gap-[5px] cursor-pointer">
                  <IoMdAddCircleOutline size={20} />
                  <p>Add Contact</p>
                </div>
              </div>
              <div className="w-full">
                <div className="flex justify-end space-x-2">
                  <button
                    type="submit"
                    className="bg-[#000] hover:bg-orange-500 w-full p-[12px] h-full rounded flex items-center justify-center space-x-2"
                  >
                    <IoIosAdd className="text-white" />
                    <span className="text-white">Add Channel</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </Dialog>
      </div>
    </div>
  );
};

export default RadioData;
