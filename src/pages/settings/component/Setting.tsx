import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Toast } from "primereact/toast";
import { InputSwitch } from "primereact/inputswitch";
import { LuCopy } from "react-icons/lu";

const Setting = () => {
  const [email, setEmail] = useState("example@mail.com");
  const [textCode, setTextCode] = useState("DEFAULT_CODE_123");
  const [password, setPassword] = useState("password123");
  const [phone, setPhone] = useState("+234 4567 898");
  const [toggleNotifications, setToggleNotifications] = useState(false);
  const toast = useRef<Toast>(null);

  const handleCopy = (value: string) => {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Copied to clipboard!",
          life: 3000,
        });
      })
      .catch(() => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to copy!",
          life: 3000,
        });
      });
  };

  const renderCopyInput = (
    label: string,
    value: string,
    editable: boolean = false,
    type: string = "text",
    onChange?: React.ChangeEventHandler<HTMLInputElement>,
    info?: string,
    extraElement?: React.ReactNode
  ) => (
    <div className="relative w-full">
      <div className="flex items-end gap-2 w-full">
        <div className="flex-1 w-full">
          <Input
            rounded={true}
            label={label}
            type={type}
            value={value}
            onChange={onChange}
            readOnly={!editable}
            placeholder=""
            info={info}
            className=" text-[16px] text-center w-full"
          />
        </div>
        <div className="flex-shrink-0">
          <button
            className="flex items-center justify-center w-12 h-12 rounded-full border border-[#646668] cursor-pointer hover:bg-black hover:text-white bg-[#f4faff]"
            onClick={() => handleCopy(value)}
            aria-label={`Copy ${label}`}
          >
            <LuCopy />
          </button>
        </div>
      </div>
      {extraElement && (
        <div className="absolute right-[-60px] top-0 h-full flex items-center">
          {extraElement}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <Toast ref={toast} className=" font-IBM" />
      <style>
        {`
          .p-inputswitch.p-inputswitch-checked .p-inputswitch-slider,
          .p-inputswitch.p-inputswitch-checked:not(.p-disabled) .p-inputswitch-slider,
          .p-inputswitch.p-inputswitch-checked.p-focus .p-inputswitch-slider {
            background: #2196f3 !important;
            border-color: #2196f3 !important;
          }

          .p-inputswitch .p-inputswitch-slider {
            background: #cccccc !important;
            transition: background-color 0.2s;
          }

          .p-inputswitch.p-inputswitch-checked:not(.p-disabled):hover .p-inputswitch-slider {
            background: #1976d2 !important;
          }

          .p-inputswitch:not(.p-disabled):hover .p-inputswitch-slider {
            background: #999999 !important;
          }

          .p-inputswitch.p-focus .p-inputswitch-slider {
            box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #2196f3 !important;
          }
         
          .p-inputswitch .p-inputswitch-slider:before {
            background: #ffffff !important;
          }

          .p-inputswitch .p-inputswitch-slider.p-inputswitch-checked {
            background-color: #2196f3 !important;
          }
        `}
      </style>

      <div className="mt-10  min-h-screen px-4 py-10 space-y-[20px]">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-end ">
          {renderCopyInput(
            "USER DETAILS",
            email,
            false,
            "email",
            (e) => setEmail(e.target.value),
            "The total revenue is the overall amount of money generated from the sale of goods or services before any expenses are deducted."
          )}
          {renderCopyInput("", textCode, false, "text", (e) =>
            setTextCode(e.target.value)
          )}
          {renderCopyInput("", password, false, "password", (e) =>
            setPassword(e.target.value)
          )}
          {renderCopyInput(
            "NOTIFICATIONS",
            phone,
            false,
            "text",
            (e) => setPhone(e.target.value),
            "The total revenue is the overall amount of money generated from the sale of goods or services before any expenses are deducted."
          )}
          <div className=" flex gap-[10px] items-end flex-1">
            <div className=" mb-[4px]">
              <InputSwitch
                id="phone"
                checked={toggleNotifications}
                onChange={(e) => setToggleNotifications(e.value)}
                className="custom-switch"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
