import { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { useAuth } from "@/context/auth-context";
import { useQuery } from "@tanstack/react-query";
import { getLoggedInUser } from "@/services";

export const useSettings = () => {
  const { userProfile, user } = useAuth();
  const toastRef = useRef<Toast>(null);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [labelName, setLabelName] = useState("");
  const [phone, setPhone] = useState("aE!st9023");
  const [toggleNotifications, setToggleNotifications] = useState(false);

  useEffect(() => {
    // Determine the active profile object (React Query response, auth context fallback)
    const profile = user?.user_profile;
    if (profile) {
      setUserName(profile.fullname || user?.user_profile?.fullname || "");
      setEmail(profile.staff_email || user?.email || "");
      setLabelName(profile.business_name || "");

      const uniqueId = user?.id || profile.id || "aE!st9023";
      setPhone(String(uniqueId));
    }
  }, [user, user, userProfile]);

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
