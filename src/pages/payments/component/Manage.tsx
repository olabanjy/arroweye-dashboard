import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { SelectInput } from "@/components/ui/selectinput";
import { BsFillPlusCircleFill } from "react-icons/bs";

const Manage = () => {
  const [selectedCurrency, setSelectedCurrency] = useState("usd");

  const handleCurrencyChange = (value: string) => {
    setSelectedCurrency(value);
  };

  return (
    <div className="my-[20px]">
      <div>
        <div className="grid grid-cols-2 items-center gap-[20px]">
          <div className="max-w-[400px] w-full">
            <Input
              label="Project Code"
              type="number"
              placeholder=""
              info="The total revenue is the overall amount of money generated from the sale of goods or services before any expenses are deducted."
            />
          </div>

          <div className="max-w-[400px] w-full">
            <Input
              label="P.O CODE"
              type="number"
              placeholder=""
              info="The total revenue is the overall amount of money generated from the sale of goods or services before any expenses are deducted."
            />
          </div>
          <div className="flex items-end gap-[20px]">
            <div className="max-w-[400px] w-full">
              <SelectInput
                label="Currency"
                options={[
                  { value: "usd", label: "$USD" },
                  { value: "ngn", label: "₦NGN" },
                  { value: "eth", label: "ΞETH" },
                ]}
                info="Select the currency for the project."
                onChange={(e) => handleCurrencyChange(e.target.value)}
              />
            </div>
            <BsFillPlusCircleFill size={50} />
          </div>
        </div>

        <div className="flex items-center gap-[10px] my-[40px]">
          <p className="cursor-pointer rounded-[4px] px-[16px] py-[10px] hover:bg-orange-500 bg-[#000000] text-white inline">
            Save
          </p>
          <div className="cursor-pointer rounded-[4px] px-[16px] py-[10px] hover:bg-orange-500 bg-[#000000] text-white inline-flex items-start gap-[4px]">
            <p>Download</p>
            <sup className="font-bold p-[8px] rounded-full bg-white text-black">
              PDF
            </sup>
          </div>
        </div>

        <div className="mt-[20px]">
          {selectedCurrency === "usd" && (
            <div>
              <p className="text-sm text-gray-700">Subtotal: $0.00</p>
              <p className="text-sm text-gray-700">
                Service Charge (15%): $0.00
              </p>
              <p className="text-sm text-gray-700">Tax (7.5%): $0.00</p>
              <p className="text-sm text-gray-700">Total: $0.00</p>
            </div>
          )}
          {selectedCurrency === "ngn" && (
            <div>
              <p className="text-sm text-gray-700">Subtotal: ₦0.00</p>
              <p className="text-sm text-gray-700">
                Service Charge (15%): ₦0.00
              </p>
              <p className="text-sm text-gray-700">Tax (7.5%): ₦0.00</p>
              <p className="text-sm text-gray-700">Total: ₦0.00</p>
            </div>
          )}
          {selectedCurrency === "eth" && (
            <div>
              <p className="text-sm text-gray-700">Subtotal: Ξ0.00</p>
              <p className="text-sm text-gray-700">
                Service Charge (15%): Ξ0.00
              </p>
              <p className="text-sm text-gray-700">Tax (7.5%): Ξ0.00</p>
              <p className="text-sm text-gray-700">Total: Ξ0.00</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Manage;
