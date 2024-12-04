import React from "react";
import { cn } from "@/lib/utils";
import { FiInfo } from "react-icons/fi";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  validate?: "email" | "otp";
  info?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, type = "text", className, error, validate, info, ...props },
    ref
  ) => {
    const validateInput = (value: string) => {
      if (validate === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      }
      if (validate === "otp") {
        const otpRegex = /^\d{6}$/;
        return otpRegex.test(value);
      }
      return true;
    };

    const [validationError, setValidationError] = React.useState<string | null>(
      null
    );

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (validate && value && !validateInput(value)) {
        setValidationError(
          validate === "email"
            ? "Invalid email address"
            : "OTP must be 6 digits"
        );
      } else {
        setValidationError(null);
      }
    };

    return (
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          {label && (
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </label>
          )}
          {info && (
            <div className="relative group">
              <FiInfo className="text-gray-400 hover:text-blue-500" />
              <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 hidden w-48 p-2 text-xs text-white bg-black rounded-lg group-hover:block">
                {info}
              </div>
            </div>
          )}
        </div>
        <input
          type={type}
          ref={ref}
          className={cn(
            "block w-full rounded-[8px] border border-black bg-white px-4 py-[10px] text-sm text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-blue-300",
            (error || validationError) && "border-red-500 focus:ring-red-500",
            className
          )}
          onBlur={handleBlur}
          {...props}
        />
        {(error || validationError) && (
          <p className="text-sm text-red-500">{error || validationError}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
