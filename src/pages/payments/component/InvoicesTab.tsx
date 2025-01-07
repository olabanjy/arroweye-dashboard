import { useState } from "react";
import { Input } from "@/components/ui/input";
import { IoFilter, IoSettingsOutline } from "react-icons/io5";
import { MdOutlineGroupAdd } from "react-icons/md";
import Invoice from "./Invoice";
import { SelectInput } from "@/components/ui/selectinput";
import Users from "./Users";
import { Dialog } from "primereact/dialog";
import { IoIosAdd, IoMdAddCircleOutline } from "react-icons/io";
import { CreateBusiness } from "@/services/api";

const InvoicesTab = () => {
  const [activeTab, setActiveTab] = useState("Invoice");
  const [filter, setFilter] = useState(false);
  const [visible, setVisible] = useState(false);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    <div className="lg:p-[20px]">
      <div className="grid md:flex items-start gap-[20px] md:gap-[40px]">
        <div className="flex gap-[10px] items-center mb-4">
          <button
            className={`pb-[10px] text-[20px] ${
              activeTab === "Invoice"
                ? "border-b border-[#17845a] text-[#17845a] font-[600]"
                : "font-[500]"
            }`}
            onClick={() => setActiveTab("Invoice")}
          >
            Invoices
          </button>
          <button
            className={`pb-[10px] text-[20px] ${
              activeTab === "Users"
                ? "border-b border-[#17845a] text-[#17845a] font-[600]"
                : "font-[500]"
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
                  placeholder="Search by project, vendor and sub vendors..."
                  className="w-full rounded-full"
                />
              </div>
            )}
            <div className="flex items-center justify-between gap-[5px]">
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
              <div className="p-[16px] hover:bg-orange-500 border border-[#000000] text-[#000000] rounded-full">
                <IoSettingsOutline />
              </div>
            </div>
          </div>
        </div>
      </div>

      {filter && (
        <div className="flex items-end gap-[10px] my-[10px]">
          <div className="max-w-[200px] w-full rounded-full">
            <SelectInput
              options={[
                { value: "", label: "Amount" },
                { value: "htl", label: "High to Low" },
                { value: "lth", label: "Low to High" },
              ]}
            />
          </div>
          <div className="max-w-[200px] w-full rounded-full">
            <SelectInput
              options={[
                { value: "", label: "Status" },
                { value: "paid", label: "Paid" },
                { value: "unpaid", label: "UnPaid" },
              ]}
            />
          </div>
          <div className="max-w-[200px] w-full">
            <SelectInput
              options={[
                { value: "", label: "Currency" },
                { value: "usd", label: "$USD" },
                { value: "ngn", label: "₦NGN" },
                { value: "eth", label: "ΞETH" },
              ]}
            />
          </div>
          <p className="cursor-pointer rounded-[4px] px-[16px] py-[10px] hover:bg-orange-500 bg-[#000000] text-white inline">
            Save
          </p>
        </div>
      )}

      <div>
        {activeTab === "Invoice" && <Invoice />}
        {activeTab === "Users" && <Users />}
      </div>

      <Dialog
        header="Add Members"
        visible={visible}
        onHide={hideDialog}
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        style={{ width: "50vw" }}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <p className="text-4xl font-bold text-[#000]">Collaborate</p>
            <div>
              <Input
                type="email"
                name="email"
                placeholder="Add email"
                value={formData.email}
                onChange={handleInputChange}
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
            <div className="flex gap-[10px] items-center">
              <div className="w-full">
                <SelectInput
                  labelText="Role"
                  name="type"
                  options={[
                    { value: "Vendor", label: "Vendor" },
                    { value: "SubVendor", label: "SubVendor" },
                  ]}
                  value={formData.type}
                  onChange={handleInputChange}
                  className="h-full"
                />
                {errors.type && (
                  <p className="text-red-500 text-xs">{errors.type}</p>
                )}
              </div>
              <div className="w-full">
                <div className="flex justify-end space-x-2">
                  <button
                    type="submit"
                    className="bg-[#000] hover:bg-orange-500 w-full p-[12px] h-full rounded flex items-center justify-center space-x-2"
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
  );
};

export default InvoicesTab;
