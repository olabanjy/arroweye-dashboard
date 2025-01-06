import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Nav from "./Nav";
import { LoginEP, VerifyLogin } from "@/services/api";

const Login = () => {
  const [loginFormData, setLoginFormData] = useState({
    email: "",
  });

  const [otpFormData, setOtpLoginFormData] = useState({
    otp: "",
  });

  const [recoverFormData, setRecoverFormData] = useState({
    email: "",
  });

  const [loginErrors, setLoginErrors] = useState({
    email: "",
  });
  const [otpErrors, setOtpErrors] = useState({
    otp: "",
  });

  const [recoverErrors, setRecoverErrors] = useState({
    email: "",
  });

  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRecoverInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRecoverFormData((prev) => ({
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
      return;
    }

    LoginEP(loginFormData)
      .then(() => {
        console.log("Form submitted successfully!");
        setIsOtpSent(true);
      })
      .catch((err) => {
        console.error("Error submitting form:", err);
      });
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
        });
    } else {
      console.log("OTP validation failed, please correct the errors.");
    }
  };

  const handleRecoverSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRecoverErrors = {
      email: "",
    };

    if (
      !recoverFormData.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recoverFormData.email)
    ) {
      newRecoverErrors.email = "Please enter a valid email address.";
    }

    setRecoverErrors(newRecoverErrors);

    const hasRecoverErrors = Object.values(newRecoverErrors).some(
      (error) => error !== ""
    );
    if (!hasRecoverErrors) {
      console.log("Password recovery request sent!");
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
              <TabsTrigger value="recover">Recover Password</TabsTrigger>
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
                    variant="primary"
                    isLoading={false}
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
                    label="Login"
                    variant="primary"
                    isLoading={false}
                    loadingText="Please wait..."
                    type="submit"
                    className="rounded-[8px] w-full font-bold"
                  />
                </form>
              )}
            </TabsContent>

            <TabsContent value="recover">
              <form
                className="mt-[20px] space-y-[30px]"
                onSubmit={handleRecoverSubmit}
              >
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={recoverFormData.email}
                  onChange={handleRecoverInputChange}
                  error={recoverErrors.email}
                />

                <div className="">
                  <Button
                    label="Recover Password"
                    variant="primary"
                    isLoading={false}
                    loadingText="Please wait..."
                    type="submit"
                    className="rounded-[8px] w-full font-bold"
                  />
                </div>
              </form>
              <div className="mt-[20px]">
                <p className="text-center">
                  Password recovery will be processed within 24 hours. Please
                  check your inbox for further instructions.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Login;
