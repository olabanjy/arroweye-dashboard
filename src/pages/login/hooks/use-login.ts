import React, { useState, useEffect } from "react";
import { StaticImageData } from "next/image";
import { Toast } from "primereact/toast";
import { LoginEP, VerifyLogin } from "@/services/api";
import { useAuth } from "@/context/auth-context";

import Bg1 from "@assets/image (1).webp";
import Bg2 from "@assets/image (2).webp";
import Bg3 from "@assets/image (3).webp";
import Bg4 from "@assets/image (4).webp";
import Bg5 from "@assets/image (5).webp";
import Bg6 from "@assets/image (6).webp";
import Bg7 from "@assets/image (7).webp";
import Bg9 from "@assets/image (9).webp";
import Bg13 from "@assets/image (13).webp";
import Bg14 from "@assets/image (14).webp";

const bgImages = [Bg1, Bg2, Bg3, Bg4, Bg5, Bg6, Bg7, Bg9, Bg13, Bg14];

const getDeterministicBgImage = () => {
  const day = new Date().getUTCDate();
  return bgImages[day % bgImages.length];
};

interface UseLoginProps {
  toastRef: React.RefObject<Toast | null>;
}

export const useLogin = ({ toastRef }: UseLoginProps) => {
  const { login } = useAuth();

  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [toggleNotifications, setToggleNotifications] = useState(false);

  const [randomBgImage] = useState<StaticImageData | string>(
    getDeterministicBgImage()
  );
  const [isBlurred, setIsBlurred] = useState(true);

  const [loginFormData, setLoginFormData] = useState({
    email: "",
  });

  const [otpFormData, setOtpLoginFormData] = useState({
    otp: "",
  });

  const [loginErrors, setLoginErrors] = useState({
    email: "",
  });

  const [otpErrors, setOtpErrors] = useState({
    otp: "",
  });

  const [isOtpSent, setIsOtpSent] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("storedEmail");
    if (storedEmail) {
      setLoginFormData((prevData) => ({ ...prevData, email: storedEmail }));
      setToggleNotifications(true);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBlurred(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOtpInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOtpLoginFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (toggleNotifications) {
      localStorage.setItem("storedEmail", loginFormData.email);
    } else {
      localStorage.removeItem("storedEmail");
    }

    setIsLoginLoading(true);

    const newLoginErrors = {
      email: "",
    };

    if (
      !loginFormData.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginFormData.email)
    ) {
      newLoginErrors.email = "Please enter a valid email address.";
    }

    if (newLoginErrors.email !== "") {
      setLoginErrors(newLoginErrors);
      setIsLoginLoading(false);
      return;
    }

    LoginEP(loginFormData)
      .then((response) => {
        if (!response?.errorResponse) {
          setIsOtpSent(true);
          toastRef.current?.show({
            severity: "success",
            summary: "Success",
            detail: response.message,
            life: 3000,
            className: " bg-white border border-[#e0e0e0] !text-[#000000]",
          });
        } else {
          toastRef.current?.show({
            severity: "error",
            summary: "Login Failed",
            detail: response.message,
            life: 3000,
            className: " bg-white border border-[#e0e0e0] !text-[#000000]",
          });
        }
      })
      .catch((err) => {
        console.error("Error submitting form:", err.message || err);
      })
      .finally(() => {
        setIsLoginLoading(false);
      });
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOtpLoading(true);

    const newLoginErrors = {
      otp: "",
    };

    if (!otpFormData.otp || !/^\d{6}$/.test(otpFormData.otp)) {
      newLoginErrors.otp = "Please enter a valid OTP with exactly 6 digits.";
    }

    setOtpErrors(newLoginErrors);

    if (newLoginErrors.otp === "") {
      VerifyLogin({ token: otpFormData.otp })
        .then((response) => {
          toastRef.current?.show({
            severity: "success",
            summary: "Success",
            detail: "Verification successful!",
            life: 3000,
            className: " bg-white border border-[#e0e0e0] !text-[#000000]",
          });
          login(response);
        })
        .catch((err) => {
          console.error("Error verifying OTP:", err);
          toastRef.current?.show({
            severity: "error",
            summary: "Verification Failed",
            detail: "Failed to verify OTP. Please try again.",
            life: 3000,
            className: " bg-white border border-[#e0e0e0] !text-[#000000]",
          });
        })
        .finally(() => {
          setIsOtpLoading(false);
        });
    } else {
      setIsOtpLoading(false);
    }
  };

  return {
    isLoginLoading,
    isOtpLoading,
    toggleNotifications,
    setToggleNotifications,
    randomBgImage,
    isBlurred,
    loginFormData,
    otpFormData,
    loginErrors,
    otpErrors,
    isOtpSent,
    setIsOtpSent,
    handleLoginInputChange,
    handleOtpInputChange,
    handleLoginSubmit,
    handleOtpSubmit,
  };
};
