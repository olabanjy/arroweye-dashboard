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

  // Fetch the fresh profile data using React Query
  const { data: meData } = useQuery({
    queryKey: ["me"],
    queryFn: getLoggedInUser,
  });

  useEffect(() => {
    // Determine the active profile object (React Query response, auth context fallback)
    const profile = meData?.user_profile || user?.user_profile || meData || user;
    if (profile) {
      setUserName(
        profile.fullname ||
          profile.fullName ||
          profile.name ||
          meData?.fullname ||
          user?.fullname ||
          ""
      );
      setEmail(
        profile.staff_email ||
          profile.email ||
          meData?.email ||
          user?.email ||
          ""
      );
      setLabelName(profile.business_name || "");
      
      const uniqueId =
        meData?.unique_id ||
        meData?.id ||
        user?.id ||
        profile.id ||
        "aE!st9023";
      setPhone(String(uniqueId));
    }
  }, [meData, user, userProfile]);

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
