import { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { useAuth } from "@/context/auth-context";

export const useSettings = () => {
  const { userProfile } = useAuth();
  const toastRef = useRef<Toast>(null);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [labelName, setLabelName] = useState("");
  const [phone, setPhone] = useState("aE!st9023");
  const [toggleNotifications, setToggleNotifications] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setUserName(userProfile.fullname || "");
      setEmail(userProfile.staff_email || "");
      setLabelName(userProfile.business_name || "");
    }
  }, [userProfile]);

  const handleCopy = (value: string) => {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        toastRef.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Copied to clipboard!",
          life: 3000,
        });
      })
      .catch(() => {
        toastRef.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to copy!",
          life: 3000,
        });
      });
  };

  return {
    userName,
    setUserName,
    email,
    setEmail,
    labelName,
    setLabelName,
    phone,
    setPhone,
    toggleNotifications,
    setToggleNotifications,
    toastRef,
    handleCopy,
  };
};
