import { useState } from "react";
import { Input } from "@/components/ui/input";
import { IoFilter, IoSettingsOutline } from "react-icons/io5";
import { MdOutlineGroupAdd } from "react-icons/md";
import Invoice from "./Invoice";
import { SelectInput } from "@/components/ui/selectinput";
import Users from "./Users";

const InvoicesTab = () => {
  const [activeTab, setActiveTab] = useState("Invoice");
  const [filter, setFilter] = useState(false);

  return (
    <div className=" p-[20px]">
      <div className=" flex items-start gap-[40px] ">
        <div className="flex gap-[10px] items-center mb-4">
          <button
            className={` pb-[10px]  text-[20px]  ${
              activeTab === "Invoice"
                ? "border-b border-[#17845a] text-[#17845a] font-[600]"
                : " font-[500]"
            }`}
            onClick={() => setActiveTab("Invoice")}
          >
            Invoices
          </button>
          <button
            className={` pb-[10px]  text-[20px]  ${
              activeTab === "Users"
                ? "border-b border-[#17845a] text-[#17845a] font-[600]"
                : " font-[500]"
            }`}
            onClick={() => setActiveTab("Users")}
          >
            Users
          </button>
        </div>

        <div className="flex-grow ">
          <div className="flex items-center justify-end gap-[10px]">
            {activeTab === "Invoice" && (
              <div className="flex-grow">
                <Input
                  type="text"
                  placeholder="Search by project, vendor and sub vendors..."
                  className="w-full rounded-full"
                />
              </div>
            )}
            <div className="flex items-center gap-[5px]">
              {activeTab === "Invoice" && (
                <div
                  className=" cursor-pointer p-[16px] hover:bg-orange-500 bg-[#000000] text-[#ffffff] rounded-full"
                  onClick={() => setFilter(!filter)}
                >
                  <IoFilter />
                </div>
              )}
              <div className="p-[16px] bg-[#ffdead] text-[#000000] rounded-full">
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
        <div className=" flex items-end gap-[10px] my-[10px]">
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
                { value: "currency", label: "Currency" },
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
    </div>
  );
};

export default InvoicesTab;
