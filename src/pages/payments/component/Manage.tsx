import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { SelectInput } from "@/components/ui/selectinput";
import { Dialog } from "primereact/dialog";
import {
  CreateInvoice,
  CreateService,
  getBusiness,
  getService,
} from "@/services/api";
import { IoIosAdd, IoMdAddCircleOutline } from "react-icons/io";
import { ContentItem } from "@/types/contents";
interface Item {
  id: number;
  item: string;
  cost: number | string;
  quantity: number;
  service_id?: number;
}

type ServiceError = {
  service_id: string | null;
  quantity: string | null;
  cost: string | null;
};

type ProjectErrors = {
  project_title: string;
  vendor_id: string | null;
  subvendor_id: string | number | null;
  artist_name: string | null;
  po_code: string;
  currency: string;
  cost: string;
  services: ServiceError[];
};

interface ProjectFormData {
  project_title: string;
  vendor_id: string | number;
  subvendor_id: string | number;
  artist_name: string;
  po_code: string;
  currency: string | number;
  services: { service_id: number; quantity: number; cost: number | string }[];
}

const Manage = () => {
  const [selectedService, setSelectedService] = useState<number | string>();
  // const [selectedServiceCost, setSelectedServiceCost] = useState<
  //   number | string
  // >();
  const [isAddNewService, setIsAddNewService] = useState(false);

  const [content, setContent] = useState<ContentItem[] | null>(null);
  const [business, setBusiness] = useState<ContentItem[] | null>(null);

  const [items, setItems] = useState<Item[]>([]);

  const handleCurrencyChange = (value: string | number) => {
    setProjectFormData((prevState) => ({
      ...prevState,
      currency: value,
    }));

    setSelectedService(value);
  };

  const handleVendorChange = (value: string | number) => {
    setProjectFormData((prevData) => ({
      ...prevData,
      vendor_id: value,
    }));
  };

  const handleSubVendorChange = (value: string | number) => {
    setProjectFormData((prevData) => ({
      ...prevData,
      subvendor_id: value,
    }));
  };

  const addItemField = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        item: "",
        cost: "",
        quantity: 1,
      },
    ]);
  };

  const removeItemField = (id: number) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);

    setProjectFormData((prevData) => {
      const updatedServices = prevData.services.filter(
        (_, index) => index !== items.findIndex((item) => item.id === id)
      );
      return {
        ...prevData,
        services: updatedServices,
      };
    });
  };

  useEffect(() => {
    getService().then((fetchedContent) => {
      setContent(fetchedContent);
    });
  }, []);

  useEffect(() => {
    getBusiness().then((fetchedContent: any) => {
      setBusiness(fetchedContent);
    });
  }, []);

  const vendorOptions = business
    ? business
        .filter((item) => item.type === "Vendor")
        .map((item) => ({
          value: item.id ?? 0,
          label: item.organization_name ?? "",
        }))
    : [];

  const subVendorOptions = business
    ? business
        .filter((item) => item.type === "SubVendor")
        .map((item) => ({
          value: item.id ?? 0,
          label: item.organization_name ?? "",
        }))
    : [];

  const currencyOptions = [
    { value: "Dollars", label: "$USD" },
    { value: "Naira", label: "₦NGN" },
    { value: "Ethereum", label: "ΞETH" },
  ];

  const customOptions = [
    { value: 9, label: "Add new service", cost: 0 },
    ...(content?.map((item) => ({
      value: item.id ?? 0,
      label: item.name ?? "",
      cost: `${item.cost ?? 0}`,
    })) || []),
  ];

  const [formData, setFormData] = useState({
    name: "",
    cost: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    cost: "",
  });

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

  const [projectFormData, setProjectFormData] = useState<ProjectFormData>({
    project_title: "",
    vendor_id: "",
    subvendor_id: "",
    artist_name: "",
    po_code: "",
    currency: "",
    services: [
      {
        service_id: 0,
        quantity: 0,
        cost: 0,
      },
    ],
  });

  const [projectErrors, setProjectErrors] = useState<ProjectErrors>({
    project_title: "",
    vendor_id: "",
    subvendor_id: "",
    artist_name: "",
    po_code: "",
    currency: "",
    cost: "",
    services: [
      {
        service_id: null,
        quantity: null,
        cost: null,
      },
    ],
  });

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subtotal = items.reduce(
      (sum, item) => sum + parseFloat(item.cost.toString()) * item.quantity,
      0
    );
    const customCost = subtotal;

    const newErrors: ProjectErrors = {
      project_title: "",
      vendor_id: null,
      subvendor_id: null,
      artist_name: "",
      po_code: "",
      currency: "",
      cost: "",
      services: projectFormData.services.map(() => ({
        service_id: null,
        quantity: null,
        cost: null,
      })),
    };

    if (!projectFormData.project_title) {
      newErrors.project_title = "Please enter a Project Title.";
    }
    if (!projectFormData.vendor_id) {
      newErrors.vendor_id = "Please select a Vendor.";
    }
    if (!projectFormData.po_code) {
      newErrors.po_code = "Please enter a PO Code.";
    }
    if (customCost <= 0) {
      newErrors.cost = "Please enter a valid Cost.";
    }

    projectFormData.services.forEach((service, index) => {
      if (!service.service_id) {
        newErrors.services[index].service_id = "Please select a Service.";
      }
      if (service.quantity === null || service.quantity <= 0) {
        newErrors.services[index].quantity = "Please enter a valid quantity.";
      }
    });

    setProjectErrors(newErrors);

    const hasErrors = Object.entries(newErrors).some(([key, value]) => {
      if (key === "services") {
        return (
          value as { service_id: string | null; quantity: number | null }[]
        ).some(
          (service) => service.service_id !== null || service.quantity !== null
        );
      }
      return value !== "" && value !== null;
    });

    if (!hasErrors) {
      const updatedFormData = {
        ...projectFormData,
        vendor_id: projectFormData.vendor_id
          ? parseInt(projectFormData.vendor_id.toString())
          : null,
        subvendor_id: projectFormData.subvendor_id
          ? parseInt(projectFormData.subvendor_id.toString())
          : null,
        // cost: customCost,
      };

      CreateInvoice(updatedFormData)
        .then(() => {
          hideDialog();
        })
        .catch((err) => {
          console.error("Error submitting form:", err);
        });
    } else {
      console.log("Form has errors. Not submitting.");
    }
  };

  const calculateTotal = (items: Item[]) => {
    const subtotal = items.reduce(
      (sum, item) =>
        sum +
        (item.cost ? parseFloat(item.cost.toString()) : 0) * item.quantity,
      0
    );

    const serviceCharge = subtotal * 0.15;

    const tax = subtotal * 0.075;

    const total = subtotal + serviceCharge + tax;

    return { subtotal, serviceCharge, tax, total };
  };

  const hideDialog = () => {
    setIsAddNewService(false);
    setFormData({
      name: "",
      cost: "",
    });
    setErrors({
      name: "",
      cost: "",
    });
  };

  const { subtotal, serviceCharge, tax, total } = calculateTotal(items);

  return (
    <div className="my-[20px]">
      <form onSubmit={handleProjectSubmit}>
        <div className="space-y-[20px]">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 pr-10 items-start gap-[20px] relative">
            {/* Project Title */}
            <div className="w-full">
              <Input
                label="PROJECT TITLE"
                type="text"
                name="project_title"
                placeholder=""
                info="This is the title of the campaign, preferably the project name such as the song or album title."
                value={projectFormData.project_title}
                onChange={handleInputChange}
              />
              {projectErrors.project_title && (
                <p className="text-red-500 text-xs">
                  {projectErrors.project_title}
                </p>
              )}
            </div>

            {/* P.O Code */}
            <div className="w-full">
              <Input
                label="P.O CODE"
                type="number"
                name="po_code"
                placeholder=""
                info="This is the purchase order code provided by the vendor. If none is provided, leave it blank."
                value={projectFormData.po_code}
                onChange={handleInputChange}
              />
              {projectErrors.po_code && (
                <p className="text-red-500 text-xs">{projectErrors.po_code}</p>
              )}
            </div>

            {/* Currency with Add Button */}
            <div className="w-full relative">
              <SelectInput
                icon={true}
                label="CURRENCY"
                name="currency"
                options={currencyOptions}
                info="This is the currency in which the invoice is issued, and it will be the same amount reflected on the invoice."
                value={projectFormData.currency}
                onChange={handleCurrencyChange}
              />
              {projectErrors.currency && (
                <p className="text-red-500 text-xs">{projectErrors.currency}</p>
              )}
              <div
                className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-black cursor-pointer absolute bottom-0 -right-14"
                onClick={addItemField}
              >
                <p className="text-white text-xl">+</p>
              </div>
            </div>

            {/* Select Vendor */}
            <div className="w-full">
              <SelectInput
                icon={true}
                label="SELECT VENDOR"
                name="vendor"
                options={vendorOptions}
                onChange={handleVendorChange}
                value={projectFormData.vendor_id}
              />
              {projectErrors.vendor_id && (
                <p className="text-red-500 text-xs">
                  {projectErrors.vendor_id}
                </p>
              )}
            </div>

            {/* Select Subvendor */}
            <div className="w-full">
              <SelectInput
                icon={true}
                name="subVendor"
                label="SELECT SUBVENDOR"
                options={subVendorOptions}
                onChange={handleSubVendorChange}
                value={projectFormData.subvendor_id}
              />
              {projectErrors.subvendor_id && (
                <p className="text-red-500 text-xs">
                  {projectErrors.subvendor_id}
                </p>
              )}
            </div>

            <div className="w-full">
              <Input
                label="ARTIST NAME"
                type="text"
                name="artist_name"
                placeholder=""
                info="Description for your new input field."
                value={projectFormData.artist_name || ""}
                onChange={handleInputChange}
              />
              {projectErrors.artist_name && (
                <p className="text-red-500 text-xs">
                  {projectErrors.artist_name}
                </p>
              )}
            </div>
          </div>

          <div className="mt-[20px] space-y-[20px]">
            {items.map((item: any, index) => (
              <div className="flex items-end gap-[20px]" key={item.id}>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 items-center gap-[20px]">
                  <div className=" flex items-center col-span-2  w-full">
                    <div className="   w-full ">
                      <SelectInput
                        icon={true}
                        name="service"
                        label="SERVICE"
                        options={customOptions}
                        value={item.service_id || ""}
                        onChange={(value: string | number) => {
                          const selectedValue = Number(value);
                          const selectedOption = customOptions.find(
                            (opt) => opt.value === selectedValue
                          );

                          console.log(selectedOption);

                          if (selectedValue === 9) {
                            setIsAddNewService(true);
                          } else {
                            const updatedItems = items.map((i) =>
                              i.id === item.id
                                ? {
                                    ...i,
                                    service_id: selectedValue,
                                    cost: selectedOption?.cost || "",
                                  }
                                : i
                            );
                            setItems(updatedItems);

                            console.log(updatedItems);
                            const updatedServices = [
                              ...projectFormData.services,
                            ];
                            updatedServices[index] = {
                              ...updatedServices[index],
                              service_id: selectedValue,
                              cost: selectedOption?.cost || "",
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
                    </div>
                  </div>

                  <div className="max-w-[350px] w-full ">
                    <Input
                      type="number"
                      name="cost"
                      placeholder="Cost"
                      label=" COST"
                      value={item.cost || ""}
                      readOnly
                      onChange={(e) => {
                        const updatedCost = e.target.value;

                        const updatedItems = items.map((i) =>
                          i.id === item.id ? { ...i, cost: updatedCost } : i
                        );
                        setItems(updatedItems);

                        const updatedServices = [...projectFormData.services];
                        updatedServices[index] = {
                          ...updatedServices[index],
                        };
                        setProjectFormData((prevData) => ({
                          ...prevData,
                          services: updatedServices,
                        }));
                      }}
                    />
                    {projectErrors.cost && (
                      <p className="text-red-500 text-xs">
                        {projectErrors.cost}
                      </p>
                    )}
                  </div>

                  <div className="max-w-[350px] w-full">
                    <Input
                      type="number"
                      name="quantity"
                      label="QUANTITY"
                      placeholder="Quantity"
                      value={item.quantity || 1}
                      onChange={(e) => {
                        const updatedQuantity = Number(e.target.value);

                        const updatedItems = items.map((i) =>
                          i.id === item.id
                            ? { ...i, quantity: updatedQuantity }
                            : i
                        );
                        setItems(updatedItems);

                        const updatedServices = [...projectFormData.services];
                        updatedServices[index] = {
                          ...updatedServices[index],
                          quantity: updatedQuantity,
                        };
                        setProjectFormData((prevData) => ({
                          ...prevData,
                          services: updatedServices,
                        }));
                      }}
                    />
                    {projectErrors.services[index]?.quantity && (
                      <p className="text-red-500 text-xs">
                        {projectErrors.services[index].quantity}
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className="w-[40px] h-[40px]  mb-[5px] flex items-center justify-center rounded-full bg-black cursor-pointer"
                  onClick={() => removeItemField(item.id)}
                >
                  <p className="text-white text-xl">-</p>
                </div>
              </div>
            ))}
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-[10px] my-[40px]">
              <button
                type="submit"
                className="cursor-pointer rounded-full px-[16px] py-[10px] hover:bg-orange-500 bg-[#000000] text-white inline"
              >
                Save
              </button>
              <div className="cursor-pointer rounded-full px-[16px] py-[10px] hover:bg-orange-500 bg-[#000000] text-white inline-flex items-start gap-[4px]">
                <p>Download</p>
                <sup className="font-bold p-[8px] rounded-full bg-white text-black">
                  PDF
                </sup>
              </div>
            </div>
          )}

          <div className="mt-[20px] ">
            {selectedService && (
              <div>
                <p className="text-[16px] text-gray-700">
                  Subtotal:{" "}
                  {selectedService === "Dollars"
                    ? `$${subtotal.toFixed(2)}`
                    : selectedService === "Naira"
                      ? `₦${subtotal.toFixed(2)}`
                      : selectedService === "Ethereum"
                        ? `Ξ${subtotal.toFixed(2)}`
                        : `₦${subtotal.toFixed(2)}`}{" "}
                </p>
                <p className="text-[16px] text-gray-700">
                  Service Charge (15%):{" "}
                  {selectedService === "Dollars"
                    ? `$${serviceCharge.toFixed(2)}`
                    : selectedService === "Naira"
                      ? `₦${serviceCharge.toFixed(2)}`
                      : selectedService === "Ethereum"
                        ? `Ξ${serviceCharge.toFixed(2)}`
                        : `₦${serviceCharge.toFixed(2)}`}{" "}
                </p>
                <p className="text-[16px] text-gray-700">
                  Tax (7.5%):{" "}
                  {selectedService === "Dollars"
                    ? `$${tax.toFixed(2)}`
                    : selectedService === "Naira"
                      ? `₦${tax.toFixed(2)}`
                      : selectedService === "Ethereum"
                        ? `Ξ${tax.toFixed(2)}`
                        : `₦${tax.toFixed(2)}`}{" "}
                </p>
                <p className="text-[16px] text-gray-700 font-bold ">
                  Total:{" "}
                  {selectedService === "Dollars"
                    ? `$${total.toFixed(2)}`
                    : selectedService === "Naira"
                      ? `₦${total.toFixed(2)}`
                      : selectedService === "Ethereum"
                        ? `Ξ${total.toFixed(2)}`
                        : `₦${total.toFixed(2)}`}{" "}
                </p>
              </div>
            )}
          </div>
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
                    className="bg-[#000] hover:bg-orange-500 w-full p-[12px] h-full rounded-full flex items-center justify-center space-x-2"
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

export default Manage;
