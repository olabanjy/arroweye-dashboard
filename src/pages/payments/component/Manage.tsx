import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { SelectInput } from "@/components/ui/selectinput";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { HiMinusCircle } from "react-icons/hi";
import { Dialog } from "primereact/dialog";
import {
  CreateInvoice,
  CreateService,
  getService,
  getStoredService,
} from "@/services/api";
import { IoIosAdd, IoMdAddCircleOutline } from "react-icons/io";
import { ContentItem } from "@/types/contents";

interface Item {
  id: number;
  item: string;
  cost: string;
  quantity: number;
  service_id?: number;
}

type ServiceError = {
  service_id: string | null;
  quantity: string | null;
};

type ProjectErrors = {
  project_title: string;
  vendor_id: string | null;
  subvendor_id: string | null;
  po_code: string;
  currency: string;
  cost: string;
  services: ServiceError[];
};

const Manage = () => {
  const [selectedService, setSelectedService] = useState<number | string>();
  const [isAddNewService, setIsAddNewService] = useState(false);

  const [content, setContent] = useState<ContentItem[] | null>(null);

  const [items, setItems] = useState<Item[]>([]);

  const handleCurrencyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setProjectFormData((prevData) => ({
      ...prevData,
      currency: event.target.value,
    }));
    setSelectedService(event.target.value);
  };
  const handleVendorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setProjectFormData((prevData) => ({
      ...prevData,
      vendor_id: event.target.value,
    }));
  };
  const handleSubVendorChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setProjectFormData((prevData) => ({
      ...prevData,
      subvendor_id: event.target.value,
    }));
  };

  const addItemField = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        item: "",
        cost: "",
        quantity: 0,
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
      console.log("Updated Services:", updatedServices);
      return {
        ...prevData,
        services: updatedServices,
      };
    });
  };

  useEffect(() => {
    const storedContent = getStoredService();

    if (storedContent) {
      setContent(storedContent);
    } else {
      getService().then((fetchedContent) => {
        setContent(fetchedContent);
      });
    }
  }, []);

  const vendorOptions = [
    { value: 1, label: "Vendor" },
    { value: 2, label: "VIVO" },
  ];

  const subVendorOptions = [
    { value: 3, label: "Subvendor" },
    { value: 4, label: "tedXOAU" },
  ];

  const currencyOptions = [
    { value: "Dollars", label: "$USD" },
    { value: "Naira", label: "₦NGN" },
    { value: "Ethereum", label: "ΞETH" },
  ];

  const customOptions = [
    { value: 9, label: "Add new service" },
    ...(content?.map((item) => ({
      value: item.id ?? 0,
      label: item.name ?? "",
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
          console.log("Form submitted successfully!");
          hideDialog();
        })
        .catch((err) => {
          console.error("Error submitting form:", err);
        });
    }
  };

  const [projectFormData, setProjectFormData] = useState({
    project_title: "",
    vendor_id: "",
    subvendor_id: "",
    po_code: "",
    currency: "",
    // cost: "",
    services: [
      {
        service_id: 0,
        quantity: 0,
      },
    ],
  });

  const [projectErrors, setProjectErrors] = useState<ProjectErrors>({
    project_title: "",
    vendor_id: "",
    subvendor_id: "",
    po_code: "",
    currency: "",
    cost: "",
    services: [
      {
        service_id: null,
        quantity: null,
      },
    ],
  });

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subtotal = items.reduce(
      (sum, item) => sum + parseFloat(item.cost) * item.quantity,
      0
    );
    const customCost = subtotal;
    console.log("Subtotal: ", customCost);

    const newErrors: ProjectErrors = {
      project_title: "",
      vendor_id: null,
      subvendor_id: null,
      po_code: "",
      currency: "",
      cost: "",
      services: projectFormData.services.map(() => ({
        service_id: null,
        quantity: null,
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

  const calculateTotal = (items: Item[]) => {
    const subtotal = items.reduce(
      (sum, item) => sum + parseFloat(item.cost) * item.quantity,
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 items-center gap-[20px]">
            <div className="max-w-[400px] w-full">
              <Input
                label="Project Title"
                type="text"
                name="project_title"
                placeholder=""
                info="The total revenue is the overall amount of money generated from the sale of goods or services before any expenses are deducted."
                value={projectFormData.project_title}
                onChange={handleInputChange}
              />
              {projectErrors.project_title && (
                <p className="text-red-500 text-xs">
                  {projectErrors.project_title}
                </p>
              )}
            </div>

            <div className="max-w-[400px] w-full">
              <Input
                label="P.O CODE"
                type="number"
                name="po_code"
                placeholder=""
                info="The total revenue is the overall amount of money generated from the sale of goods or services before any expenses are deducted."
                value={projectFormData.po_code}
                onChange={handleInputChange}
              />
              {projectErrors.po_code && (
                <p className="text-red-500 text-xs">{projectErrors.po_code}</p>
              )}
            </div>
            <div className="flex items-end gap-[20px]">
              <div className="max-w-[400px] w-full">
                <SelectInput
                  label="Currency"
                  name="currency"
                  labelText="Select Currency"
                  options={currencyOptions}
                  info="Select the currency for the project."
                  value={projectFormData.currency}
                  onChange={handleCurrencyChange}
                />
                {projectErrors.currency && (
                  <p className="text-red-500 text-xs">
                    {projectErrors.currency}
                  </p>
                )}
              </div>
              <BsFillPlusCircleFill size={50} onClick={addItemField} />
            </div>

            <div className="flex items-end gap-[20px]">
              <div className="max-w-[400px] w-full">
                <SelectInput
                  labelText="Select Vendor"
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
            </div>
            <div className="flex items-end gap-[20px]">
              <div className="max-w-[400px] w-full">
                <SelectInput
                  name="subVendor"
                  labelText="Select SubVendor"
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
            </div>
          </div>

          <div className="mt-[20px]">
            {items.map((item, index) => (
              <div className="flex items-center gap-[20px]" key={item.id}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 items-center gap-[20px]">
                  <div className="max-w-[400px] w-full">
                    <SelectInput
                      name="service"
                      labelText="Select Service"
                      options={customOptions}
                      value={item.service_id || ""}
                      onChange={(e) => {
                        const selectedValue = Number(e.target.value);

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
                  </div>

                  <div className="max-w-[400px] w-full">
                    <Input
                      type="number"
                      name="cost"
                      placeholder="Cost"
                      value={item.cost || ""}
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

                  <div className="max-w-[400px] w-full">
                    <Input
                      type="number"
                      name="quantity"
                      placeholder="Quantity"
                      value={item.quantity || 0}
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

                <HiMinusCircle
                  className="text-[#000000]"
                  size={50}
                  onClick={() => removeItemField(item.id)}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-[10px] my-[40px]">
            <button
              type="submit"
              className="cursor-pointer rounded-[4px] px-[16px] py-[10px] hover:bg-orange-500 bg-[#000000] text-white inline"
            >
              Save
            </button>
            <div className="cursor-pointer rounded-[4px] px-[16px] py-[10px] hover:bg-orange-500 bg-[#000000] text-white inline-flex items-start gap-[4px]">
              <p>Download</p>
              <sup className="font-bold p-[8px] rounded-full bg-white text-black">
                PDF
              </sup>
            </div>
          </div>

          <div className="mt-[20px]">
            {selectedService && (
              <div>
                <p className="text-sm text-gray-700">
                  Subtotal:{" "}
                  {selectedService === "$"
                    ? `$${subtotal.toFixed(2)}`
                    : selectedService === "₦"
                    ? `₦${subtotal.toFixed(2)}`
                    : selectedService === "Ξ"
                    ? `Ξ${subtotal.toFixed(2)}`
                    : `₦${subtotal.toFixed(2)}`}{" "}
                </p>
                <p className="text-sm text-gray-700">
                  Service Charge (15%):{" "}
                  {selectedService === "$"
                    ? `$${serviceCharge.toFixed(2)}`
                    : selectedService === "₦"
                    ? `₦${serviceCharge.toFixed(2)}`
                    : selectedService === "Ξ"
                    ? `Ξ${serviceCharge.toFixed(2)}`
                    : `₦${serviceCharge.toFixed(2)}`}{" "}
                </p>
                <p className="text-sm text-gray-700">
                  Tax (7.5%):{" "}
                  {selectedService === "$"
                    ? `$${tax.toFixed(2)}`
                    : selectedService === "₦"
                    ? `₦${tax.toFixed(2)}`
                    : selectedService === "Ξ"
                    ? `Ξ${tax.toFixed(2)}`
                    : `₦${tax.toFixed(2)}`}{" "}
                </p>
                <p className="text-sm text-gray-700 font-bold">
                  Total:{" "}
                  {selectedService === "$"
                    ? `$${total.toFixed(2)}`
                    : selectedService === "₦"
                    ? `₦${total.toFixed(2)}`
                    : selectedService === "Ξ"
                    ? `Ξ${total.toFixed(2)}`
                    : `₦${total.toFixed(2)}`}{" "}
                </p>
              </div>
            )}
          </div>
        </div>
      </form>

      <Dialog
        header="Add Service"
        visible={isAddNewService}
        onHide={hideDialog}
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        style={{ width: "50vw" }}
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
  );
};

export default Manage;
