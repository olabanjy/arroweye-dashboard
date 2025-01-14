import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginEP, VerifyLogin } from "@/services/api";
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
import Image, { StaticImageData } from "next/image";
import { IoMdInformationCircle } from "react-icons/io";
import { InputSwitch } from "primereact/inputswitch";
import { IoReload } from "react-icons/io5";
import { Toast } from "primereact/toast";

const Login = () => {
  const toast = useRef<Toast>(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [toggleNotifications, setToggleNotifications] = useState(false);

  const [randomBgImage, setRandomBgImage] = useState<StaticImageData | string>(
    ""
  );

  useEffect(() => {
    const storedEmail = localStorage.getItem("storedEmail");
    if (storedEmail) {
      setLoginFormData((prevData) => ({ ...prevData, email: storedEmail }));
      setToggleNotifications(true);
    }
  }, []);

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

  const bgImages = [Bg1, Bg2, Bg3, Bg4, Bg5, Bg6, Bg7, Bg9, Bg13, Bg14];
  const [isBlurred, setIsBlurred] = useState(true);

  useEffect(() => {
    const selectedImage = bgImages[Math.floor(Math.random() * bgImages.length)];
    setRandomBgImage(selectedImage);

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
          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: response.message,
            life: 3000,

            className: " bg-white border border-[#e0e0e0] !text-[#000000]",
          });
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Login Failed",
            detail: response.message,
            life: 3000,
            className: " bg-white border border-[#e0e0e0] !text-[#000000]",
          });
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
      <Toast ref={toast} className=" font-IBM" />;
      {randomBgImage && (
        <Image
          src={randomBgImage}
          alt="background"
          loading="lazy"
          className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-500 ${
            isBlurred ? "blur-[10px]" : "blur-none"
          }`}
        />
      )}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-20"></div>
      <div className="relative z-10 max-w-6xl w-full px-4 font-IBM">
        <div className=" grid place-items-center lg:flex items-center lg:justify-between h-full gap-[20px]">
          <Image
            src="https://res.cloudinary.com/dih0krdcj/image/upload/v1736795669/Pine%20and%20Ginger/ae-black_syuh1o.svg"
            alt="Logo"
            width={250}
            height={87}
          />
          <div className="w-full max-w-[400px] bg-white  rounded-[10px] pb-[56px]">
            <div className=" bg-[#1473E6] px-[27px] py-[23px] rounded-t-[10px] text-[#FFFFFF]">
              <div className=" flex items-center gap-[14px]">
                <IoMdInformationCircle size={24} />{" "}
                <p className="text-[16px] font-[600]">
                  Please verify your credentials{" "}
                </p>
              </div>
            </div>

            <div className="w-full mx-auto px-[27px]">
              {!isOtpSent ? (
                <form
                  className=" mt-[20px] space-y-[30px] w-full"
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
                    className="w-full text-center font-medium text-[#323131] text-[15px]"
                  />
                  <div className=" flex items-center justify-between">
                    <div className=" flex  items-center gap-[12px]">
                      <InputSwitch
                        id="phone"
                        checked={toggleNotifications}
                        onChange={(e) => setToggleNotifications(e.value)}
                        className="custom-switch"
                      />

                      <p className="  text-[14px] text-[#605C5C]">
                        Store Credentials
                      </p>
                    </div>
                    <Button
                      label="Send OTP"
                      isLoading={isLoginLoading}
                      disabled={isLoginLoading}
                      variant="primary"
                      loadingText="Sending..."
                      type="submit"
                      className="rounded-full bg-[#000000] font-bold text-[14px]"
                    />
                  </div>
                </form>
              ) : (
                <form
                  className="mt-[20px] space-y-[20px] w-full"
                  onSubmit={handleOtpSubmit}
                >
                  <Input
                    rounded={true}
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={otpFormData.otp}
                    onChange={handleOtpInputChange}
                    error={otpErrors.otp}
                    className="w-full text-center font-medium text-[#323131]"
                  />

                  <div className=" flex items-center justify-between">
                    <div
                      className=" flex items-center cursor-pointer gap-[4px] text-[#1473E6]"
                      onClick={() => setIsOtpSent(false)}
                    >
                      <IoReload size={18} />
                      <p className=" font-medium text-[#1473E6] text-[14px] ">
                        Resend OTP
                      </p>
                    </div>
                    <Button
                      label="Verify OTP"
                      isLoading={isOtpLoading}
                      disabled={isOtpLoading}
                      variant="primary"
                      loadingText="Please wait..."
                      type="submit"
                      className="rounded-full  bg-[#000000] font-bold text-[14px]  "
                    />
                  </div>
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
