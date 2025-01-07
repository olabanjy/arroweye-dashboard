import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Nav from "./Nav";
import { LoginEP, VerifyLogin } from "@/services/api";

const Login = () => {
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);

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
    <div className="bg-[#e0f6e6] h-screen">
      <Nav />
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center">
          <Tabs
            defaultValue="login"
            className="px-[10px] w-full max-w-[400px] md:px-0"
          >
            <TabsList>
              <TabsTrigger value="login">Login</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              {!isOtpSent ? (
                <form
                  className="mt-[20px] space-y-[30px] w-full"
                  onSubmit={handleLoginSubmit}
                >
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={loginFormData.email}
                    onChange={handleLoginInputChange}
                    error={loginErrors.email}
                  />

                  <Button
                    label="Send OTP"
                    isLoading={isLoginLoading}
                    disabled={isLoginLoading}
                    variant="primary"
                    loadingText="Sending OTP..."
                    type="submit"
                    className="rounded-[8px] w-full font-bold"
                  />
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
                  />
                  <Button
                    label="Verify Otp"
                    isLoading={isOtpLoading}
                    disabled={isOtpLoading}
                    variant="primary"
                    loadingText="Please wait..."
                    type="submit"
                    className="rounded-[8px] w-full font-bold"
                  />
                </form>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Login;
