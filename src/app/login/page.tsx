"use client";

import Image from "next/image";
import { Info, RotateCcw } from "lucide-react";
import { useLogin } from "@/hooks/use-login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const Login = () => {
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
  } = useLogin();

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-4 py-8 text-foreground">
      {randomBgImage && (
        <Image
          src={randomBgImage}
          alt="background"
          fill
          priority
          sizes="100vw"
          className={`absolute top-0 left-0 w-full h-full object-cover transition-all duration-500 ${
            isBlurred ? "blur-[10px]" : "blur-none"
          }`}
        />
      )}
      <div className="absolute inset-0 bg-background/75 backdrop-blur-[2px] dark:bg-background/70" />
      <div className="relative z-10 w-full max-w-6xl font-SansFlex">
        <div className="grid min-h-[min(680px,calc(100svh-4rem))] place-items-center gap-8 lg:flex lg:items-center lg:justify-between">
          <Image
            src="https://res.cloudinary.com/dyueswnzk/image/upload/v1759782808/aestudio-new_usstzj.svg"
            alt="Arroweye Studio"
            width={230}
            height={87}
            priority
          />
          <section className="w-full max-w-[400px] overflow-hidden rounded-[10px] border border-border bg-card pb-10 text-card-foreground shadow-xl">
            <div className="bg-primary px-[27px] py-[23px] text-primary-foreground">
              <div className="flex items-center gap-[14px]">
                <Info size={22} strokeWidth={2} />
                <p className="text-[16px] font-medium">
                  Please verify your credentials
                </p>
              </div>
            </div>

            <div className="w-full mx-auto px-[27px]">
              {!isOtpSent ? (
                <form
                  className="mt-[20px] w-full space-y-5"
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
                    className="login-input-themed w-full border-input bg-background text-center text-[15px] font-medium text-foreground placeholder:text-muted-foreground"
                  />
                  <div className="flex items-center justify-between gap-4">
                    <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <Switch
                        size="sm"
                        checked={toggleNotifications}
                        onCheckedChange={setToggleNotifications}
                      />
                      Remember email
                    </label>
                    <Button
                      disabled={isLoginLoading}
                      size="lg"
                      className="h-10 rounded-full px-5 font-bold"
                    >
                      {isLoginLoading ? "Sending" : "Send OTP"}
                    </Button>
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
                    className="login-input-themed w-full border-input bg-background text-center font-medium text-foreground placeholder:text-muted-foreground"
                  />

                  <div className="flex items-center justify-between gap-4">
                    <button
                      type="button"
                      className="flex items-center gap-[6px] text-sm font-medium text-primary transition-colors hover:text-primary/80"
                      onClick={() => setIsOtpSent(false)}
                    >
                      <RotateCcw size={16} strokeWidth={2} />
                      Resend OTP
                    </button>
                    <Button
                      disabled={isOtpLoading}
                      size="lg"
                      className="h-10 rounded-full px-5 font-bold"
                    >
                      {isOtpLoading ? "Verifying" : "Verify OTP"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Login;
