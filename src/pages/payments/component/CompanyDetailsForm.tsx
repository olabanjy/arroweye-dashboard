"use client";
import React, { useState } from "react";
import Image from "next/image";
import Logo from "@assets/arroreyelogoSm.svg";
import { LuImagePlus } from "react-icons/lu";
import { Dialog } from "primereact/dialog";
import { Input } from "@/components/ui/input";
import { CreateBusiness } from "@/services/api";

interface CompanyDetailsFormProps {
  visible: boolean;
  onHide: () => void;
}

const CompanyDetailsForm: React.FC<CompanyDetailsFormProps> = ({
  visible,
  onHide,
}) => {
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    base64: string | ArrayBuffer | null;
  } | null>(null);

  const [activeDetailsTab, setActiveDetailsTab] = useState("company");
  const [isEditable, setIsEditable] = useState(false);
  const [isPaymentEditable, setIsPaymentEditable] = useState(false);

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEditable(true);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEditable(false);
  };

  const handlePaymentEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPaymentEditable(true);
  };

  const handlePaymentSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPaymentEditable(false);
  };

  const [formData, setFormData] = useState({
    email: "example@gmail.com",
    company_name: "Naville Jones",
    company_address: "United Kingdom",
    tax_id: "12341",
    phone_number: "+2345679762",
  });

  const [errors, setErrors] = useState({
    email: "",
    organization_name: "",
    fullname: "",
    type: "",
    company_name: "",
    company_address: "",
    tax_id: "",
    phone_number: "",
  });

  const handleDetailsSubmitSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      email: "",
      organization_name: "",
      fullname: "",
      type: "",
      company_name: "",
      company_address: "",
      tax_id: "",
      phone_number: "",
    };

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.company_name) {
      newErrors.company_name = "Please enter a company name.";
    }
    if (!formData.company_address) {
      newErrors.company_address = "Please enter a company address.";
    }
    if (!formData.phone_number) {
      newErrors.phone_number = "Please enter a phone number.";
    }
    if (!formData.tax_id) {
      newErrors.tax_id = "Please enter a tax ID.";
    }

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    console.log("Form Data being submitted:", formData);
    if (!hasErrors) {
      CreateBusiness(formData)
        .then(() => {
          console.log("Form submitted successfully!");
          onHide();
        })
        .catch((err) => {
          console.error("Error submitting form:", err);
        });
    }
  };

  const [paymemtFormData, setPaymentFormData] = useState({
    bank_name: "United Bank",
    account_number: "20998463551",
    foreign_bank_name: "Foreign Bank",
    foreign_account_number: "9473628183",
    wallet_address: "12ejrifhrhhr2ugrqkqgwkgei;oMVFE762E72EHH",
  });

  const [paymentErrors, setPaymentErrors] = useState({
    bank_name: "",
    account_number: "",
    foreign_bank_name: "",
    foreign_account_number: "",
    wallet_address: "",
  });

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      bank_name: "",
      account_number: "",
      foreign_bank_name: "",
      foreign_account_number: "",
      wallet_address: "",
    };

    if (!paymemtFormData.bank_name) {
      newErrors.bank_name = "Please enter the bank name.";
    }
    if (!paymemtFormData.account_number) {
      newErrors.account_number = "Please enter the account number.";
    }
    if (!paymemtFormData.foreign_bank_name) {
      newErrors.foreign_bank_name = "Please enter the foreign bank name.";
    }
    if (!paymemtFormData.foreign_account_number) {
      newErrors.foreign_account_number =
        "Please enter the foreign account number.";
    }
    if (!paymemtFormData.wallet_address) {
      newErrors.wallet_address = "Please enter the wallet address.";
    }

    setPaymentErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    console.log("Form Data being submitted:", paymemtFormData);
    if (!hasErrors) {
      CreateBusiness(paymemtFormData)
        .then(() => {
          console.log("Form submitted successfully!");
          onHide();
        })
        .catch((err) => {
          console.error("Error submitting form:", err);
        });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        const base64String = reader.result;
        setSelectedFile({
          name: file.name,
          base64: base64String,
        });
      };

      reader.onerror = (error) => {
        console.error("Error converting file to Base64:", error);
      };
    }
  };

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
    setPaymentFormData((prev) => {
      const newState = {
        ...prev,
        [name]: value,
      };
      return newState;
    });
  };

  const handleCompanySubmit = (event: React.FormEvent<HTMLFormElement>) => {
    handleDetailsSubmitSubmit(event);
  };

  return (
    <div
      className={`custom-dialog-overlay  ${
        visible ? "bg-black/30 backdrop-blur-md fixed inset-0 z-50" : "hidden"
      }`}
    >
      <Dialog
        visible={visible}
        onHide={onHide}
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        style={{ width: "40vw" }}
        className="font-IBM !overflow-y-auto"
      >
        <div className="border pb-[20px]">
          <div className="text-[16px] font-[400] grid grid-cols-2 items-center">
            <button
              className={`text-center py-2 ${
                activeDetailsTab === "company"
                  ? "bg-[#212529] text-white"
                  : "border"
              }`}
              onClick={() => setActiveDetailsTab("company")}
            >
              Company Details
            </button>
            <button
              className={`text-center py-2 ${
                activeDetailsTab === "payment"
                  ? "bg-[#212529] text-white"
                  : "border"
              }`}
              onClick={() => setActiveDetailsTab("payment")}
            >
              Payment Info
            </button>
          </div>

          {activeDetailsTab === "company" && (
            <form
              onSubmit={handleCompanySubmit}
              className=" px-[20px] scrollbar-hide scrollbar-hide::-webkit-scrollbar"
            >
              <div className="grid gap-[10px] relative z-10">
                <>
                  <div className=" my-[20px]">
                    <Image src={Logo} alt="Logo" width={50} height={50} />
                  </div>

                  <p className="text-[30px] font-[600] text-[#212529] font-IBM hidden">
                    Collaborate
                  </p>

                  <div>
                    <Input
                      type="text"
                      name="company_name"
                      placeholder="Company Name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className="text-[17px]"
                    />
                    {errors.company_name && (
                      <p className="text-red-500 text-xs">
                        {errors.company_name}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      type="text"
                      name="company_address"
                      placeholder="Company Address"
                      value={formData.company_address}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className="text-[17px]"
                    />
                    {errors.company_address && (
                      <p className="text-red-500 text-xs">
                        {errors.company_address}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      type="text"
                      name="tax_id"
                      placeholder="Tax ID"
                      value={formData.tax_id}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className="text-[17px]"
                    />
                    {errors.tax_id && (
                      <p className="text-red-500 text-xs">{errors.tax_id}</p>
                    )}
                  </div>
                  <div>
                    <Input
                      type="text"
                      name="phone_number"
                      placeholder="Phone Number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className="text-[17px]"
                    />
                    {errors.phone_number && (
                      <p className="text-red-500 text-xs">
                        {errors.phone_number}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      type="text"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditable}
                      className="text-[17px]"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs">{errors.email}</p>
                    )}
                  </div>

                  <p className="text-[16px] font-[600] text-[#212529] font-IBM ">
                    Logo
                  </p>
                  <div className="relative">
                    <input
                      type="file"
                      id="file-upload"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <label
                      htmlFor="file-upload"
                      className=" rounded-[8px] px-4 py-[8px] h-[50px] text-[14px] placeholder:text-[18px] font-[400] text-[#888888] dark:border-gray-700 dark:bg-gray-900 dark:text-white cursor-pointer flex items-center justify-between mt-1  w-full text-sm border border-gray-300   text-center bg-gray-100 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-offset-1"
                    >
                      <p>{selectedFile?.name || "Upload Logo"}</p>
                      <LuImagePlus />
                    </label>
                  </div>
                </>

                <div className="flex items-center space-x-2">
                  <button
                    // type="submit"
                    onClick={handleSaveClick}
                    className="font-IBM  text-[14px] text-white hover:text-[#000000] bg-[#000000] border border-[#000000] hover:bg-[#ffffff] hover:border-[#000000] py-[8px] px-[20px] rounded "
                  >
                    Save
                  </button>
                  <button
                    onClick={handleEditClick}
                    className="font-IBM  text-[14px] text-white hover:text-[#000000] bg-[#000000] border border-[#000000] hover:bg-[#ffffff] hover:border-[#000000] py-[8px] px-[20px] rounded"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </form>
          )}
          {activeDetailsTab === "payment" && (
            <form
              onSubmit={handlePaymentSubmit}
              className=" px-[20px] mt-[20px] scrollbar-hide scrollbar-hide::-webkit-scrollbar"
            >
              <div className="grid gap-[10px] relative z-10">
                <>
                  <div className=" space-y-[5px]">
                    <p className="text-[16px] font-[600] text-[#212529] font-IBM ">
                      Local Transfer
                    </p>

                    <div>
                      <Input
                        type="text"
                        name="bank_name"
                        placeholder="Bank Name"
                        value={paymemtFormData.bank_name}
                        onChange={handleInputChange}
                        disabled={!isPaymentEditable}
                        className="text-[17px]"
                      />
                      {paymentErrors.bank_name && (
                        <p className="text-red-500 text-xs">
                          {paymentErrors.bank_name}
                        </p>
                      )}
                    </div>
                    <div>
                      <Input
                        type="text"
                        name="account_number"
                        placeholder="Account Number"
                        value={paymemtFormData.account_number}
                        onChange={handleInputChange}
                        disabled={!isPaymentEditable}
                        className="text-[17px]"
                      />
                      {paymentErrors.account_number && (
                        <p className="text-red-500 text-xs">
                          {paymentErrors.account_number}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-[5px]">
                    <p className="text-[16px] font-[600] text-[#212529] font-IBM ">
                      Foreign Transfer
                    </p>
                    <div>
                      <Input
                        type="text"
                        name="foreign_bank_name"
                        placeholder="Bank Name"
                        value={paymemtFormData.foreign_bank_name}
                        onChange={handleInputChange}
                        disabled={!isPaymentEditable}
                        className="text-[17px]"
                      />
                      {paymentErrors.foreign_bank_name && (
                        <p className="text-red-500 text-xs">
                          {paymentErrors.foreign_bank_name}
                        </p>
                      )}
                    </div>
                    <div>
                      <Input
                        type="text"
                        name="foreign_account_number"
                        placeholder="Account Number"
                        value={paymemtFormData.foreign_account_number}
                        onChange={handleInputChange}
                        disabled={!isPaymentEditable}
                        className="text-[17px]"
                      />
                      {paymentErrors.foreign_account_number && (
                        <p className="text-red-500 text-xs">
                          {paymentErrors.foreign_account_number}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-[5px]">
                    <p className="text-[16px] font-[600] text-[#212529] font-IBM ">
                      Bitcoin Wallet
                    </p>
                    <div>
                      <Input
                        type="text"
                        name="wallet_address"
                        placeholder="Bitcoin Wallet Address"
                        value={paymemtFormData.wallet_address}
                        onChange={handleInputChange}
                        disabled={!isPaymentEditable}
                        className="text-[17px]"
                      />
                      {paymentErrors.wallet_address && (
                        <p className="text-red-500 text-xs">
                          {paymentErrors.wallet_address}
                        </p>
                      )}
                    </div>
                  </div>
                </>

                <div className="flex items-center space-x-2">
                  <button
                    // type="submit"
                    onClick={handlePaymentSaveClick}
                    className="font-IBM  text-[14px] text-white hover:text-[#000000] bg-[#000000] border border-[#000000] hover:bg-[#ffffff] hover:border-[#000000] py-[8px] px-[20px] rounded "
                  >
                    Save
                  </button>
                  <button
                    onClick={handlePaymentEditClick}
                    className="font-IBM  text-[14px] text-white hover:text-[#000000] bg-[#000000] border border-[#000000] hover:bg-[#ffffff] hover:border-[#000000] py-[8px] px-[20px] rounded"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default CompanyDetailsForm;
