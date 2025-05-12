import { useState } from "react";
import { Input } from "@/components/ui/input";
import { IoFilter } from "react-icons/io5";
import { MdOutlineGroupAdd } from "react-icons/md";
import Invoice from "./Invoice";
import { SelectInput } from "@/components/ui/selectinput";
import Users from "./Users";
import { Dialog } from "primereact/dialog";
import { IoIosAdd, IoMdAddCircleOutline } from "react-icons/io";
import { CreateBusiness } from "@/services/api";
import { DropDownInput } from "@/components/ui/dropdownInput";
import CompanyDetailsForm from "./CompanyDetailsForm";

import { TbBuildingBank } from "react-icons/tb";

const InvoicesTab = () => {
  const [activeTab, setActiveTab] = useState("Invoice");
  const [filter, setFilter] = useState(false);
  const [visible, setVisible] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    organization_name: "",
    fullname: "",
    type: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    organization_name: "",
    fullname: "",
    type: "",
  });

  const showDetailsDialog = () => {
    setDetailsModal(true);
  };
  // const handleInputChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // ) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newState = {
        ...prev,
        [name]: value,
      };
      return newState;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      email: "",
      organization_name: "",
      fullname: "",
      type: "",
    };

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.organization_name) {
      newErrors.organization_name = "Please enter a business name.";
    }
    if (!formData.fullname) {
      newErrors.fullname = "Please enter a full name.";
    }
    if (!formData.type) {
      newErrors.type = "Please select a type.";
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    console.log("Form Data being submitted:", formData);
    if (!hasErrors) {
      CreateBusiness(formData)
        .then(() => {
          console.log("Form submitted successfully!");
          hideDialog();
        })
        .catch((err) => {
          console.error("Error submitting form:", err);
        });
    }
  };

  const showDialog = () => {
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setFormData({
      email: "",
      organization_name: "",
      fullname: "",
      type: "",
    });
    setErrors({
      email: "",
      organization_name: "",
      fullname: "",
      type: "",
    });
  };

  return (
    <div className=" font-IBM mt-[50px]">
      <div className="grid md:flex items-center gap-[20px] md:gap-[40px] mb-[16px]">
        <div className="flex gap-[20px] items-center">
          <button
            className={`pb-[10px] text-[18px] transition-all duration-300 ${
              activeTab === "Invoice"
                ? "border-b border-[#17845a] text-[#17845a] font-[400]"
                : "font-[400]"
            }`}
            onClick={() => setActiveTab("Invoice")}
          >
            Invoices
          </button>
          <button
            className={`pb-[10px] text-[18px] transition-all duration-300 ${
              activeTab === "Users"
                ? "border-b border-[#17845a] text-[#17845a] font-[400]"
                : "font-[400]"
            }`}
            onClick={() => setActiveTab("Users")}
          >
            Users
          </button>
        </div>

        <div className="flex-grow">
          <div className="grid md:flex items-center md:justify-end gap-[10px]">
            {activeTab === "Invoice" && (
              <div className="flex-grow">
                <Input
                  type="text"
                  placeholder="Search by title, label and artist..."
                  className="w-full rounded-full font-IBM placeholder:font-IBM text-[17px] placeholder:text-[17px]"
                />
              </div>
            )}
            <div className="flex items-center lg:justify-between gap-[5px]">
              {activeTab === "Invoice" && (
                <div
                  className="cursor-pointer p-[16px] hover:bg-orange-500 bg-[#000000] text-[#ffffff] rounded-full"
                  onClick={() => setFilter(!filter)}
                >
                  <IoFilter />
                </div>
              )}
              <div
                className="cursor-pointer p-[16px] bg-[#ffdead] text-[#000000] rounded-full"
                onClick={showDialog}
              >
                <MdOutlineGroupAdd />
              </div>
              <div
                className=" cursor-pointer p-[16px] hover:bg-[#000000] hover:text-white border border-[#000000] text-[#000000] rounded-full"
                onClick={showDetailsDialog}
              >
                <TbBuildingBank />
              </div>
            </div>
          </div>
        </div>
      </div>

      {filter && (
        <div className="text-center flex flex-wrap items-end gap-[5px] md:gap-[10px] my-4">
          <div className="max-w-[150px] w-full rounded-full">
            <SelectInput
              rounded={true}
              options={[
                { value: "", label: "Amount" },
                { value: "htl", label: "High to Low" },
                { value: "lth", label: "Low to High" },
              ]}
            />
          </div>
          <div className="max-w-[100px] w-full rounded-full">
            <SelectInput
              rounded={true}
              options={[
                { value: "", label: "Status" },
                { value: "paid", label: "Paid" },
                { value: "unpaid", label: "Unpaid" },
              ]}
            />
          </div>
          <p className=" max-w-[120px] w-full cursor-pointer text-[14px] rounded-full px-[16px] py-[4px] hover:bg-orange-500 bg-[#000000] text-white inline">
            Clear Filters
          </p>
        </div>
      )}

      <div>
        {activeTab === "Invoice" && <Invoice />}
        {activeTab === "Users" && <Users />}
      </div>

      <CompanyDetailsForm
        visible={detailsModal}
        onHide={() => setDetailsModal(false)}
      />
      <div
        className={`custom-dialog-overlay  ${
          visible ? "bg-black/30 backdrop-blur-md fixed inset-0 z-50" : "hidden"
        }`}
      >
        <Dialog
          header=" +  ADD USERS"
          headerClassName=" "
          visible={visible}
          onHide={hideDialog}
          breakpoints={{ "960px": "75vw", "640px": "100vw" }}
          style={{ width: "40vw" }}
          className="!overflow-y-auto"
        >
          <form
            onSubmit={handleSubmit}
            className="scrollbar-hide scrollbar-hide::-webkit-scrollbar"
          >
            <div className=" grid gap-[10px] relative z-10">
              <p className="text-[30px] font-[600] text-[#212529] font-IBM hidden">
                Collaborate
              </p>
              <div>
                <DropDownInput
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={(e) => handleInputChange(e)}
                  className=" text-[14px]"
                  // options={[
                  //   {
                  //     value: "1",
                  //     label: "Option 1",
                  //     email: "option1@example.com",
                  //   },
                  //   {
                  //     value: "2",
                  //     label: "Option 2",
                  //     email: "option2@example.com",
                  //   },
                  //   {
                  //     value: "3",
                  //     label: "Option 3",
                  //     email: "option3@example.com",
                  //   },
                  // ]}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}
              </div>
              <div>
                <Input
                  type="text"
                  name="organization_name"
                  placeholder="Business Name"
                  value={formData.organization_name}
                  onChange={handleInputChange}
                  className=" text-[17px]"
                />
                {errors.organization_name && (
                  <p className="text-red-500 text-xs">
                    {errors.organization_name}
                  </p>
                )}
              </div>
              {formData.type && (
                <div>
                  <Input
                    type="text"
                    name="fullname"
                    placeholder="Full Name"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    className=" font-IBM text-[17px]"
                  />
                  {errors.fullname && (
                    <p className="text-red-500 text-xs">{errors.fullname}</p>
                  )}
                </div>
              )}
              <div className=" hidden">
                <div className="flex items-center gap-[5px] cursor-pointer">
                  <IoMdAddCircleOutline size={20} />
                  <p>Add Contact</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-[10px] items-end">
                <div className="w-full">
                  <SelectInput
                    icon={true}
                    name="type"
                    options={[
                      { value: "Vendor", label: "Vendor" },
                      { value: "Subvendor", label: "Subvendor" },
                    ]}
                    value={formData.type}
                    onChange={(value) =>
                      handleInputChange({
                        target: { name: "type", value: String(value) },
                      } as React.ChangeEvent<HTMLInputElement>)
                    }
                    // onChange={handleInputChange}
                  />
                  {errors.type && (
                    <p className="text-red-500 text-xs">{errors.type}</p>
                  )}
                </div>
                <div className="w-full ">
                  <div className="flex justify-end space-x-2">
                    <button
                      type="submit"
                      className=" font-IBM h-[50px] text-[14px] bg-[#000000] border border-[#000000] hover:bg-orange-500 hover:border-orange-500 w-full py-[12px] px-[12px]  rounded-[8px] flex items-center justify-center space-x-2"
                    >
                      <IoIosAdd className="text-white" />
                      <span className="text-white">Add User</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Dialog>
      </div>
    </div>
  );
};

export default InvoicesTab;
