import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { FaRegCopy } from "react-icons/fa";
import { LuSettings } from "react-icons/lu";
import { Toast } from "primereact/toast";
import { InputSwitch } from "primereact/inputswitch";

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
    <div className="max-w-[400px] w-full space-y-2 relative">
      <Input
        label={label}
        type={type}
        value={value}
        onChange={onChange}
        readOnly={!editable}
        placeholder=""
        info={info}
      />
      <div className="absolute top-0 right-[-60px] flex items-center">
        {extraElement}
      </div>
      <button
        className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-400 cursor-pointer hover:bg-gray-100"
        onClick={() => handleCopy(value)}
        aria-label={`Copy ${label}`}
      >
        <FaRegCopy />
      </button>
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />

      <div className="flex items-center gap-2">
        <LuSettings size={24} className="text-[#858585]" />
        <p className="font-bold text-2xl text-[#000]">Settings</p>
      </div>

      <div className="mt-10 border rounded-[16px] border-[#d8d8d8] h-screen  px-4 py-10 space-y-[20px]">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-end">
          {renderCopyInput(
            "User details",
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
        </div>
        <div className=" flex items-center gap-[20px] ">
          {renderCopyInput(
            "Notifications",
            phone,
            false,
            "text",
            (e) => setPhone(e.target.value),
            "The total revenue is the overall amount of money generated from the sale of goods or services before any expenses are deducted."
          )}
          <InputSwitch
            id="phone"
            checked={toggleNotifications}
            onChange={(e) => setToggleNotifications(e.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Setting;
