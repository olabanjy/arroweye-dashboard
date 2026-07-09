import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { IoMdInformationCircle } from "react-icons/io";
import { InputSwitch } from "primereact/inputswitch";
import { IoReload } from "react-icons/io5";
import { Toast } from "primereact/toast";
import { useLogin } from "@/hooks/use-login";

const Login = () => {
  const toast = useRef<Toast>(null);
  const {
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
  } = useLogin({ toastRef: toast });

  return (
    <div className="h-screen flex items-center justify-center relative">
      <Toast ref={toast} className="font-IBM" />
      {randomBgImage && (
        <Image
          src={randomBgImage}
          alt="background"
          priority={true}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-500 ${
            isBlurred ? "blur-[10px]" : "blur-none"
          }`}
        />
      )}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-20"></div>
      <div className="relative z-10 max-w-6xl w-full px-4 font-IBM">
        <div className=" grid place-items-center lg:flex items-center lg:justify-between h-full gap-[20px]">
          {/* <Image src="/aestudio.svg" alt="Logo" width={230} height={87} /> */}
          <Image
            src="https://res.cloudinary.com/dyueswnzk/image/upload/v1759782808/aestudio-new_usstzj.svg"
            alt="Logo"
            width={230}
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
                      loadingText="Sending"
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
                      loadingText="Verifying"
                      type="submit"
                      className="rounded-full bg-[#000000] font-bold text-[14px]  "
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
