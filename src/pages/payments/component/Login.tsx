import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginEP, VerifyLogin } from "@/services/api";
import Logo from "@assets/arrowLogo.svg";
import Bg1 from "@assets/image (1).webp";
import Bg2 from "@assets/image (2).webp";
import Bg3 from "@assets/image (3).webp";
import Bg4 from "@assets/image (4).webp";
import Bg5 from "@assets/image (5).webp";
import Bg6 from "@assets/image (6).webp";
import Bg7 from "@assets/image (7).webp";
import Bg8 from "@assets/image (8).webp";
import Bg9 from "@assets/image (9).webp";
import Bg10 from "@assets/image (10).webp";
import Bg11 from "@assets/image (11).webp";
import Bg12 from "@assets/image (12).webp";
import Bg13 from "@assets/image (13).webp";
import Bg14 from "@assets/image (14).webp";
import Image from "next/image";
import { IoMdInformationCircle } from "react-icons/io";
import { InputSwitch } from "primereact/inputswitch";
import { IoReload } from "react-icons/io5";

const Login = () => {
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [toggleNotifications, setToggleNotifications] = useState(false);

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

  const bgImages = [
    Bg1,
    Bg2,
    Bg3,
    Bg4,
    Bg5,
    Bg6,
    Bg7,
    Bg8,
    Bg9,
    Bg10,
    Bg11,
    Bg12,
    Bg13,
    Bg14,
  ];

  const randomBgImage = bgImages[Math.floor(Math.random() * bgImages.length)];

  useEffect(() => {}, []);

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

    setIsLoginLoading(true);

    const newLoginErrors: { email: string; otp?: string } = {
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
        } else {
          console.log("Login failed:", response.message);
          console.log("Error details:", response.errorResponse);
        }
      })
      .catch((err) => {
        console.error("Error submitting form:", err.message || err);
        console.log("Error response from catch block:", err.errorResponse);
      })
      .finally(() => {
        setIsLoginLoading(false);
      });
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsOtpLoading(true);

    const newLoginErrors: { otp: string } = {
      otp: "",
    };

    if (!otpFormData.otp || !/^\d{6}$/.test(otpFormData.otp)) {
      newLoginErrors.otp = "Please enter a valid OTP with exactly 6 digits.";
    }

    setOtpErrors(newLoginErrors);
    const hasOtpErrors = Object.values(newLoginErrors).some(
      (error) => error !== ""
    );

    if (!hasOtpErrors) {
      VerifyLogin({ token: otpFormData.otp })
        .then(() => {
          console.log("OTP verified successfully!");
          setIsOtpSent(true);
        })
        .catch((err) => {
          console.error("Error verifying OTP:", err);
        })
        .finally(() => {
          setIsOtpLoading(false);
        });
    } else {
      console.log("OTP validation failed, please correct the errors.");
      setIsOtpLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center relative">
      <Image
        src={randomBgImage}
        alt="background"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      <div className="relative z-10 max-w-6xl w-full px-4 font-IBM">
        <div className=" grid place-items-center lg:flex items-center lg:justify-between h-full gap-[20px]">
          <Image src={Logo} alt="Logo" />
          <div className="w-full max-w-[700px] bg-white  rounded-[10px] pb-[56px]">
            <div className=" bg-[#1473E6] px-[27px] py-[23px] rounded-t-[10px] text-[#FFFFFF]">
              <div className=" flex items-center gap-[14px]">
                <IoMdInformationCircle size={24} />{" "}
                <p className="text-[18px] font-[600]">
                  Please verify your credentials{" "}
                </p>
              </div>
            </div>

            <div className="w-full mt-[87px] max-w-[640px] mx-auto px-[27px]">
              {!isOtpSent ? (
                <form
                  className="mt-[20px] space-y-[30px] w-full"
                  onSubmit={handleLoginSubmit}
                >
                  <Input
                    rounded={true}
                    type="email"
                    name="email"
                    placeholder="hi@arroweye.pro"
                    value={loginFormData.email}
                    onChange={handleLoginInputChange}
                    error={loginErrors.email}
                    className="w-full text-center font-medium text-[#323131]"
                  />
                  <div className=" flex items-center justify-between">
                    <div className=" flex  items-center gap-[12px]">
                      <InputSwitch
                        id="phone"
                        checked={toggleNotifications}
                        onChange={(e) => setToggleNotifications(e.value)}
                      />
                      <p className="  text-[14px] lg:text-[22px] text-[#605C5C]">
                        Store Credentials
                      </p>
                    </div>
                    <Button
                      label="SEND OTP"
                      isLoading={isLoginLoading}
                      disabled={isLoginLoading}
                      variant="primary"
                      loadingText="Sending OTP..."
                      type="submit"
                      className="rounded-full bg-[#000000] font-bold text-[10px] lg:text-[21px]"
                    />
                  </div>
                  <div className=" flex items-center gap-[4px] text-[#1473E6]">
                    <IoReload size={18} />
                    <p className=" font-medium text-[#1473E6] text-[14px] lg:text-[22px]">
                      Resend OTP
                    </p>
                  </div>
                </form>
              ) : (
                <form
                  className="mt-[20px] space-y-[30px] w-full"
                  onSubmit={handleOtpSubmit}
                >
                  <Input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={otpFormData.otp}
                    onChange={handleOtpInputChange}
                    error={otpErrors.otp}
                    className="w-full"
                  />
                  <Button
                    label="Verify OTP"
                    isLoading={isOtpLoading}
                    disabled={isOtpLoading}
                    variant="primary"
                    loadingText="Please wait..."
                    type="submit"
                    className="rounded-[8px] w-full font-bold"
                  />
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
