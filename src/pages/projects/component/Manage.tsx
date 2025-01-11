import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { SelectInput } from "@/components/ui/selectinput";
import { BsFillPlusCircleFill } from "react-icons/bs";

const Manage = () => {
  const [selectedCurrency, setSelectedCurrency] = useState("");

  const handleCurrencyChange = (value: string | number) => {
    setSelectedCurrency(value.toString());
    console.log(selectedCurrency);
  };

  return (
    <div className="my-[20px]">
      <div className=" hidden">
        <div className="grid md:grid-cols-2 items-center gap-[20px]">
          <div className="max-w-[400px] w-full">
            <Input
              label="Project Title"
              type="number"
              placeholder=""
              info="The total revenue is the overall amount of money generated from the sale of goods or services before any expenses are deducted."
            />
          </div>

          <div className="flex items-end gap-[20px]">
            <div className="max-w-[400px] w-full">
              <SelectInput
                label="VENDOR"
                options={[
                  { value: "vendor", label: "Vendor" },
                  { value: "vivo", label: "VIVO" },
                ]}
                onChange={(value) => handleCurrencyChange(value)}
              />
            </div>
          </div>
          <div className="flex items-end gap-[20px]">
            <div className="max-w-[400px] w-full">
              <SelectInput
                label="SUBVENDOR"
                options={[
                  { value: "subvendor", label: "Subvendor" },
                  { value: "tedxoau", label: "tedXOAU" },
                ]}
                info="The total revenue is the overall amount of money generated from the sale of goods or services before any expenses are deducted."
                onChange={(value) => handleCurrencyChange(value)}
              />
            </div>
            <BsFillPlusCircleFill size={50} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manage;
