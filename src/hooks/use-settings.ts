"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

export const useSettings = () => {
  const { userProfile, user } = useAuth();

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
        toast.success("Copied", {
          description: "Copied to clipboard.",
        });
      })
      .catch(() => {
        toast.error("Copy failed", {
          description: "Failed to copy.",
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
    handleCopy,
  };
};
