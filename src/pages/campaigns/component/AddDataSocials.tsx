"use client";
import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { FiInfo } from "react-icons/fi";
import { PiCalendarPlus } from "react-icons/pi";
import { ContentItem } from "@/types/contents";
import {
  CreateMetric,
  CreateSocialStats,
  getSocialMedia,
} from "@/services/api";
import TiktokData from "./TiktokData";
import FacebookData from "./FacebookData";
import TwitterData from "./TwitterData";
import InstagramData from "./InstagramData";
import { WeekInput } from "@/components/ui/weekInput";
import { useRouter } from "next/router";
import { SelectInput } from "@/components/ui/selectinput";
import { Input } from "@/components/ui/input";
import { IoIosAdd, IoMdAddCircleOutline } from "react-icons/io";

interface Item {
  id: number;
  item: string;
  week_1: string;
  week_2: string;
  week_3: string;
  week_4: string;
  metric_id?: number;
}

type ServiceError = {
  metric_id: string | null;
  week_1: string | null;
  week_2: string | null;
  week_3: string | null;
  week_4: string | null;
};

type ProjectErrors = {
  sm_data: ServiceError[];
  sm_id: number | null;
};

interface ProjectFormData {
  sm_id: number;
  sm_data: {
    metric_id: number;
    week_1: string;
    week_2: string;
    week_3: string;
    week_4: string;
  }[];
}

interface CompanyDetailsFormProps {
  visible: boolean;
  onHide: () => void;
  onAddDataSuccess: () => void;
  existingSocialMediaData: any;
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

const AddDataSocials: React.FC<CompanyDetailsFormProps> = ({
  visible,
  onHide,
  onAddDataSuccess,
  existingSocialMediaData,
}) => {
  const [activeDetailsTab, setActiveDetailsTab] = useState<string>("");
  const [content, setContent] = useState<any[] | null>(null);
  const [processedData, setProcessedData] = useState<any[]>([]);

  const { query } = useRouter();
  const { id } = query;
  const [totalImpressions, setTotalImpressions] = useState(0);
  const [totalAudience, setTotalAudience] = useState(0);

  const [isAddNewService, setIsAddNewService] = useState(false);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    getSocialMedia().then((fetchedContent) => {
      setContent(fetchedContent);
      if (fetchedContent && fetchedContent.length > 0) {
        setActiveDetailsTab(fetchedContent[0].name || "");
      }
    });
  }, []);

  const SocialMediaID = content?.find(
    (social) => social.name === activeDetailsTab
  )?.id;

  const hideDialog = () => {
    setIsAddNewService(false);

    setErrors({
      name: "",
    });
  };

  const socialMetrics = content?.find(
    (social: any) => social.name === activeDetailsTab
  )?.metrics;

  const [projectFormData, setProjectFormData] = useState<ProjectFormData>({
    sm_id: 0,
    sm_data: [
      {
        metric_id: 0,
        week_1: "",
        week_2: "",
        week_3: "",
        week_4: "",
      },
    ],
  });

  const [projectErrors, setProjectErrors] = useState<ProjectErrors>({
    sm_id: null,
    sm_data: [
      {
        metric_id: null,
        week_1: null,
        week_2: null,
        week_3: null,
        week_4: null,
      },
    ],
  });

  const { totalSpins, totalServices } = projectFormData.sm_data.reduce(
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
      sm_id: null,
      sm_data: projectFormData.sm_data.map(() => ({
        metric_id: null,
        week_1: null,
        week_2: null,
        week_3: null,
        week_4: null,
      })),
    };

    projectFormData.sm_data.forEach((service, index) => {
      if (!service.metric_id || isNaN(service.metric_id)) {
        newErrors.sm_data[index].metric_id = "Please select a Metric.";
      }
      ["week_1", "week_2", "week_3", "week_4"].forEach((week) => {
        const weekValue = service[week as keyof typeof service];
        if (!weekValue || isNaN(parseFloat(weekValue.toString()))) {
          newErrors.sm_data[index][
            week as keyof (typeof newErrors.sm_data)[0]
          ] = "Please enter a valid quantity.";
        }
      });
    });

    setProjectErrors(newErrors);

    const hasErrors = newErrors.sm_data.some((service) =>
      Object.values(service).some((value) => value !== null)
    );

    if (!hasErrors) {
      const updatedFormData = {
        ...projectFormData,
      };

      console.log("PAYLOAD", updatedFormData);
      CreateSocialStats(Number(id), updatedFormData)
        .then(() => {
          console.log("Form submitted successfully!");
          hideDialog();
          setItems([
            {
              id: 0,
              item: "",
              week_1: "",
              week_2: "",
              week_3: "",
              week_4: "",
              metric_id: 0,
            },
          ]);
          onAddDataSuccess();
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
      label: "add new metric",
      impressions: 0,
      audience: 0,
    },
    ...(socialMetrics?.map((item: any) => ({
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

      const updatedServices = prevData.sm_data.filter(
        (_, index) => index !== indexToRemove
      );

      setTotalImpressions(0);
      setTotalAudience(0);

      return {
        ...prevData,
        sm_data: updatedServices,
      };
    });
  };

  const [errors, setErrors] = useState({
    name: "",
  });
  const [formData, setFormData] = useState({
    name: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: "",
    };

    if (!formData.name) {
      newErrors.name = "Please enter a valid name.";
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (!hasErrors) {
      CreateMetric(formData)
        .then(() => {
          console.log("Form submitted successfully!");
          hideDialog();

          setFormData({
            name: "",
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

  const processSocialMediaData = (items: any[]) => {
    // Filter items where sm.name matches activeDetailsTab
    const filteredItems = items.filter(
      (item) => item?.sm?.name === activeDetailsTab
    );

    if (filteredItems.length === 0) return [];

    // Create an object to store aggregated metrics
    const metricAggregates: {
      [key: string]: {
        metric_id: number;
        metric_name: string;
        week_1: number;
        week_2: number;
        week_3: number;
        week_4: number;
      };
    } = {};

    // Process each filtered item
    filteredItems.forEach((item) => {
      // Use sm_data instead of airplay_data based on your JSON structure
      item.sm_data?.forEach((metricItem: any) => {
        const metricName = metricItem.metric_name;
        const metricId = metricItem.metric;

        // Initialize the metric in our aggregates if it doesn't exist
        if (!metricAggregates[metricName]) {
          metricAggregates[metricName] = {
            metric_id: metricId,
            metric_name: metricName,
            week_1: 0,
            week_2: 0,
            week_3: 0,
            week_4: 0,
          };
        }

        // Add this item's weekly data to the aggregated totals
        metricAggregates[metricName].week_1 += metricItem.week_1 || 0;
        metricAggregates[metricName].week_2 += metricItem.week_2 || 0;
        metricAggregates[metricName].week_3 += metricItem.week_3 || 0;
        metricAggregates[metricName].week_4 += metricItem.week_4 || 0;
      });
    });

    // Convert the aggregates object to an array
    return Object.values(metricAggregates);
  };

  useEffect(() => {
    if (!!existingSocialMediaData) {
      const processedData = processSocialMediaData(existingSocialMediaData);
      setProcessedData(processedData);
    }
  }, [existingSocialMediaData, activeDetailsTab]);

  const calculateTotal = (metricName: any) => {
    const metric = processedData?.find(
      (item: any) => item.metric_name === metricName
    );
    if (!metric) return 0;

    return metric.week_1 + metric.week_2 + metric.week_3 + metric.week_4;
  };

  const totalImpression = calculateTotal("Impressions");
  const totalLikes = calculateTotal("Like");
  const totalAudiences = calculateTotal("Audience");
  const totalFollowers = calculateTotal("Followers");
  const totalShares = calculateTotal("Shares");
  const totalViews = calculateTotal("Views");

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
              <p className="text-[32px] font-[500] text-[#212529]">
                Social Media
              </p>
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
                    onClick={() => setActiveDetailsTab(item.name || "")}
                  >
                    {item.name}
                  </button>
                ))}
            </div>
            <div className="mt-5 space-y-5 md:space-y-1 max-h-[400px] overflow-auto">
              {processedData.map((metricData: any, idx: any) => (
                <div className="flex flex-col md:flex-row item-center gap-2 md:gap-5">
                  <div className="max-w-[200px] w-full">
                    <div className="bg-gray-300 border border-black rounded-xl p-3">
                      {metricData.metric_name}
                    </div>
                  </div>

                  <div key={idx} className="flex flex-row items-center gap-2">
                    {["week_1", "week_2", "week_3", "week_4"].map((week) => (
                      <WeekInput
                        key={`${metricData.id}-${week}`}
                        type="number"
                        name={`${metricData.id}-${week}`}
                        label={`WEEK ${week.slice(-1)}`}
                        placeholder={"Metric Value"}
                        value={metricData[week]}
                        disabled={true}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* {activeDetailsTab === "Facebook" && (
              <FacebookData metrics={socialMetrics} />
            )}
            {activeDetailsTab === "Instagram" && (
              <InstagramData metrics={socialMetrics} />
            )}
            {activeDetailsTab === "TikTok" && (
              <TiktokData metrics={socialMetrics} />
            )}
            {activeDetailsTab === "Twitter" && (
              <TwitterData metrics={socialMetrics} />
            )} */}
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
                            placeholder="Select Metric"
                            value={item.metric_id || ""}
                            onChange={(value: string | number) => {
                              const selectedValue = Number(value);

                              if (selectedValue === 99999) {
                                setIsAddNewService(true);
                              } else {
                                // const selectedOption = customOptions.find(
                                //   (opt) => opt.value === selectedValue
                                // );

                                const updatedItems = items.map((i) =>
                                  i.id === item.id
                                    ? {
                                        ...i,
                                        metric_id: selectedValue,
                                      }
                                    : i
                                );

                                setItems(updatedItems);

                                const updatedServices = [
                                  ...projectFormData.sm_data,
                                ];
                                updatedServices[index] = {
                                  ...updatedServices[index],
                                  metric_id: selectedValue,
                                };

                                setProjectFormData((prevData) => ({
                                  ...prevData,
                                  sm_data: updatedServices,
                                }));

                                const newTotalImpressions =
                                  updatedServices.reduce((sum) => sum + 0, 0);
                                const newTotalAudience = updatedServices.reduce(
                                  (sum) => sum + 0,
                                  0
                                );

                                setTotalImpressions(newTotalImpressions);
                                setTotalAudience(newTotalAudience);
                              }
                            }}
                          />

                          {projectErrors?.sm_data[index]?.metric_id && (
                            <p className="text-red-500 text-xs">
                              {projectErrors.sm_data[index].metric_id}
                            </p>
                          )}
                        </div>

                        <div className="max-w-[150px] w-full">
                          <WeekInput
                            type="number"
                            name="week_1"
                            label="WEEK 1"
                            placeholder="Metric Value"
                            value={item.week_1 || ""}
                            onChange={(e) => {
                              const updatedWeek1 = e.target.value;

                              const updatedItems = items.map((i) =>
                                i.id === item.id
                                  ? { ...i, week_1: updatedWeek1 }
                                  : i
                              );
                              setItems(updatedItems);

                              const updatedServices = [
                                ...projectFormData.sm_data,
                              ];
                              updatedServices[index] = {
                                ...updatedServices[index],
                                week_1: updatedWeek1,
                              };
                              setProjectFormData((prevData) => ({
                                ...prevData,
                                sm_data: updatedServices,
                              }));
                            }}
                          />
                          {projectErrors.sm_data[index]?.week_1 && (
                            <p className="text-red-500 text-xs">
                              {projectErrors.sm_data[index].week_1}
                            </p>
                          )}
                        </div>

                        <div className="max-w-[150px] w-full">
                          <WeekInput
                            type="number"
                            name="week_2"
                            label="WEEK 2"
                            placeholder="Metric Value"
                            value={item.week_2 || ""}
                            onChange={(e) => {
                              const updatedWeek2 = e.target.value;

                              const updatedItems = items.map((i) =>
                                i.id === item.id
                                  ? { ...i, week_2: updatedWeek2 }
                                  : i
                              );
                              setItems(updatedItems);

                              const updatedServices = [
                                ...projectFormData.sm_data,
                              ];
                              updatedServices[index] = {
                                ...updatedServices[index],
                                week_2: updatedWeek2,
                              };
                              setProjectFormData((prevData) => ({
                                ...prevData,
                                sm_data: updatedServices,
                              }));
                            }}
                          />
                          {projectErrors.sm_data[index]?.week_2 && (
                            <p className="text-red-500 text-xs">
                              {projectErrors.sm_data[index].week_2}
                            </p>
                          )}
                        </div>

                        <div className="max-w-[150px] w-full">
                          <WeekInput
                            type="number"
                            name="week_3"
                            label="WEEK 3"
                            placeholder="Metric Value"
                            value={item.week_3 || ""}
                            onChange={(e) => {
                              const updatedWeek3 = e.target.value;

                              const updatedItems = items.map((i) =>
                                i.id === item.id
                                  ? { ...i, week_3: updatedWeek3 }
                                  : i
                              );
                              setItems(updatedItems);

                              const updatedServices = [
                                ...projectFormData.sm_data,
                              ];
                              updatedServices[index] = {
                                ...updatedServices[index],
                                week_3: updatedWeek3,
                              };
                              setProjectFormData((prevData) => ({
                                ...prevData,
                                sm_data: updatedServices,
                              }));
                            }}
                          />
                          {projectErrors.sm_data[index]?.week_3 && (
                            <p className="text-red-500 text-xs">
                              {projectErrors.sm_data[index].week_3}
                            </p>
                          )}
                        </div>

                        <div className="max-w-[150px] w-full">
                          <WeekInput
                            type="number"
                            name="week_4"
                            label="WEEK 4"
                            placeholder="Metric Value"
                            value={item.week_4 || ""}
                            onChange={(e) => {
                              const updatedWeek4 = e.target.value;

                              const updatedItems = items.map((i) =>
                                i.id === item.id
                                  ? { ...i, week_4: updatedWeek4 }
                                  : i
                              );
                              setItems(updatedItems);

                              const updatedServices = [
                                ...projectFormData.sm_data,
                              ];
                              updatedServices[index] = {
                                ...updatedServices[index],
                                week_4: updatedWeek4,
                              };
                              setProjectFormData((prevData) => ({
                                ...prevData,
                                sm_id: SocialMediaID
                                  ? Number(SocialMediaID)
                                  : 0,
                                sm_data: updatedServices,
                              }));
                            }}
                          />
                          {projectErrors.sm_data[index]?.week_4 && (
                            <p className="text-red-500 text-xs">
                              {projectErrors.sm_data[index].week_4}
                            </p>
                          )}
                        </div>
                      </div>

                      {index !== 0 && (
                        <div
                          className="w-[40px] h-[40px]   flex items-center justify-center rounded-full bg-gray-400 cursor-pointer"
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

                <div className="mt-[20px] items-center grid sm:grid-cols-2 md:grid-cols-3 space-y-2">
                  <p className="font-[400] text-[#212529] text-[16px]">
                    Total Impressions: {totalImpression}
                  </p>
                  <p className="font-[400] text-[#212529] text-[16px]">
                    Total Followers: {totalFollowers}
                  </p>
                  <p className="font-[400] text-[#212529] text-[16px]">
                    Total Shares: {totalShares.toLocaleString()}
                  </p>
                  <p className="font-[400] text-[#212529] text-[16px]">
                    Total Likes: {totalLikes.toLocaleString()}
                  </p>
                  <p className="font-[400] text-[#212529] text-[16px]">
                    Total Saves: {totalAudiences.toLocaleString()}
                  </p>
                  <p className="font-[400] text-[#212529] text-[16px]">
                    Total Views: {totalViews.toLocaleString()}
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
                  header="Add Facebook Metric"
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
                          placeholder="Name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-xs">{errors.name}</p>
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
                            <span className="text-white">Add Metric</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </Dialog>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default AddDataSocials;
