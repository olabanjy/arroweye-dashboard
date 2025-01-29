"use client";
import { Input } from "@/components/ui/input";
import { SelectInput } from "@/components/ui/selectinput";
import { WeekInput } from "@/components/ui/weekInput";
import { CreateInvoice, CreateService, getService } from "@/services/api";
import { ContentItem } from "@/types/contents";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import { IoIosAdd, IoMdAddCircleOutline } from "react-icons/io";

interface Item {
  id: number;
  item: string;
  week1: string;
  week2: string;
  week3: string;
  week4: string;
  service_id?: number;
}

type ServiceError = {
  service_id: string | null;
  week1: string | null;
  week2: string | null;
  week3: string | null;
  week4: string | null;
};

type ProjectErrors = {
  services: ServiceError[];
};

interface ProjectFormData {
  services: {
    service_id: number;
    week1: string;
    week2: string;
    week3: string;
    week4: string;
  }[];
}

const RadioData = () => {
  const [content, setContent] = useState<ContentItem[] | null>(null);

  const [isAddNewService, setIsAddNewService] = useState(false);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    getService().then((fetchedContent) => {
      setContent(fetchedContent);
    });
  }, []);
  const hideDialog = () => {
    setIsAddNewService(false);

    setErrors({
      name: "",
      cost: "",
    });
  };

  const [projectFormData, setProjectFormData] = useState<ProjectFormData>({
    services: [
      {
        service_id: 0,
        week1: "",
        week2: "",
        week3: "",
        week4: "",
      },
    ],
  });

  const [projectErrors, setProjectErrors] = useState<ProjectErrors>({
    services: [
      {
        service_id: null,
        week1: null,
        week2: null,
        week3: null,
        week4: null,
      },
    ],
  });

  const { totalSpins, totalServices } = projectFormData.services.reduce(
    (totals, service) => {
      const week1Value = parseFloat(service.week1 || "0");
      const week2Value = parseFloat(service.week2 || "0");
      const week3Value = parseFloat(service.week3 || "0");
      const week4Value = parseFloat(service.week4 || "0");

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
      services: projectFormData.services.map(() => ({
        service_id: null,
        week1: null,
        week2: null,
        week3: null,
        week4: null,
      })),
    };

    projectFormData.services.forEach((service, index) => {
      if (!service.service_id) {
        newErrors.services[index].service_id = "Please select a Service.";
      }
      ["week1", "week2", "week3", "week4"].forEach((week) => {
        const weekValue = service[week as keyof typeof service];
        if (!weekValue || isNaN(parseFloat(weekValue.toString()))) {
          newErrors.services[index][
            week as keyof (typeof newErrors.services)[0]
          ] = "Please enter a valid quantity.";
        }
      });
    });

    setProjectErrors(newErrors);

    const hasErrors = newErrors.services.some((service) =>
      Object.values(service).some((value) => value !== null)
    );

    if (!hasErrors) {
      const updatedFormData = {
        ...projectFormData,
      };

      console.log("Updated Form Data with Cost:", updatedFormData);

      CreateInvoice(updatedFormData)
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
    { value: 9, label: "add new station" },
    ...(content?.map((item) => ({
      value: item.id ?? 0,
      label: item.name ?? "",
    })) || []),
  ];

  const addItemField = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        item: "",
        week1: "",
        week2: "",
        week3: "",
        week4: "",
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
      const updatedServices = prevData.services.filter(
        (_, index) => index !== items.findIndex((item) => item.id === id)
      );
      console.log("Updated Services:", updatedServices);
      return {
        ...prevData,
        services: updatedServices,
      };
    });
  };

  const [errors, setErrors] = useState({
    name: "",
    cost: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    cost: "",
  });

  useEffect(() => {
    getService().then((fetchedContent) => {
      setContent(fetchedContent);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: "",
      cost: "",
    };

    if (!formData.name) {
      newErrors.name = "Please enter a valid name.";
    }
    if (!formData.cost) {
      newErrors.cost = "Please enter cost.";
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (!hasErrors) {
      CreateService(formData)
        .then(() => {
          console.log("Form submitted successfully!");
          hideDialog();
          getService().then((fetchedContent) => {
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
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-center gap-[20px]">
                <div className=" max-w-[200px] w-full">
                  <SelectInput
                    icon={true}
                    name="service"
                    options={customOptions}
                    placeholder="Select Station"
                    value={item.service_id || ""}
                    onChange={(value: string | number) => {
                      const selectedValue = Number(value);

                      if (selectedValue === 9) {
                        setIsAddNewService(true);
                      } else {
                        const updatedItems = items.map((i) =>
                          i.id === item.id
                            ? { ...i, service_id: selectedValue }
                            : i
                        );
                        setItems(updatedItems);

                        const updatedServices = [...projectFormData.services];
                        updatedServices[index] = {
                          ...updatedServices[index],
                          service_id: selectedValue,
                        };
                        setProjectFormData((prevData) => ({
                          ...prevData,
                          services: updatedServices,
                        }));
                      }
                    }}
                  />
                  {projectErrors.services[index]?.service_id && (
                    <p className="text-red-500 text-xs">
                      {projectErrors.services[index].service_id}
                    </p>
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

                <div className="max-w-[150px] w-full">
                  <WeekInput
                    type="number"
                    name="week1"
                    label="WEEK 1"
                    placeholder="Spins"
                    value={item.week1 || ""}
                    onChange={(e) => {
                      const updatedWeek1 = e.target.value;

                      const updatedItems = items.map((i) =>
                        i.id === item.id ? { ...i, week1: updatedWeek1 } : i
                      );
                      setItems(updatedItems);

                      const updatedServices = [...projectFormData.services];
                      updatedServices[index] = {
                        ...updatedServices[index],
                        week1: updatedWeek1,
                      };
                      setProjectFormData((prevData) => ({
                        ...prevData,
                        services: updatedServices,
                      }));
                    }}
                  />
                  {projectErrors.services[index]?.week1 && (
                    <p className="text-red-500 text-xs">
                      {projectErrors.services[index].week1}
                    </p>
                  )}
                </div>

                <div className="max-w-[150px] w-full">
                  <WeekInput
                    type="number"
                    name="week2"
                    label="WEEK 2"
                    placeholder="Spins"
                    value={item.week2 || ""}
                    onChange={(e) => {
                      const updatedWeek2 = e.target.value;

                      const updatedItems = items.map((i) =>
                        i.id === item.id ? { ...i, week2: updatedWeek2 } : i
                      );
                      setItems(updatedItems);

                      const updatedServices = [...projectFormData.services];
                      updatedServices[index] = {
                        ...updatedServices[index],
                        week2: updatedWeek2,
                      };
                      setProjectFormData((prevData) => ({
                        ...prevData,
                        services: updatedServices,
                      }));
                    }}
                  />
                  {projectErrors.services[index]?.week2 && (
                    <p className="text-red-500 text-xs">
                      {projectErrors.services[index].week2}
                    </p>
                  )}
                </div>

                <div className="max-w-[150px] w-full">
                  <WeekInput
                    type="number"
                    name="week3"
                    label="WEEK 3"
                    placeholder="Spins"
                    value={item.week3 || ""}
                    onChange={(e) => {
                      const updatedWeek3 = e.target.value;

                      const updatedItems = items.map((i) =>
                        i.id === item.id ? { ...i, week3: updatedWeek3 } : i
                      );
                      setItems(updatedItems);

                      const updatedServices = [...projectFormData.services];
                      updatedServices[index] = {
                        ...updatedServices[index],
                        week3: updatedWeek3,
                      };
                      setProjectFormData((prevData) => ({
                        ...prevData,
                        services: updatedServices,
                      }));
                    }}
                  />
                  {projectErrors.services[index]?.week3 && (
                    <p className="text-red-500 text-xs">
                      {projectErrors.services[index].week3}
                    </p>
                  )}
                </div>

                <div className="max-w-[150px] w-full">
                  <WeekInput
                    type="number"
                    name="week4"
                    label="WEEK 4"
                    placeholder="Spins"
                    value={item.week4 || ""}
                    onChange={(e) => {
                      const updatedWeek4 = e.target.value;

                      const updatedItems = items.map((i) =>
                        i.id === item.id ? { ...i, week4: updatedWeek4 } : i
                      );
                      setItems(updatedItems);

                      const updatedServices = [...projectFormData.services];
                      updatedServices[index] = {
                        ...updatedServices[index],
                        week4: updatedWeek4,
                      };
                      setProjectFormData((prevData) => ({
                        ...prevData,
                        services: updatedServices,
                      }));
                    }}
                  />
                  {projectErrors.services[index]?.week4 && (
                    <p className="text-red-500 text-xs">
                      {projectErrors.services[index].week4}
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
            Total Audience: 0
          </p>
          <p className="font-[400] text-[#212529] text-[16px]">
            Total Impressions: 0
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
          header="Add Service"
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
              <div>
                <Input
                  type="text"
                  name="cost"
                  placeholder="Cost"
                  value={formData.cost}
                  onChange={handleInputChange}
                />
                {errors.cost && (
                  <p className="text-red-500 text-xs">{errors.cost}</p>
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
                    <span className="text-white">Add Service</span>
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
