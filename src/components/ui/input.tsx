import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  validate?: "email" | "otp";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, type = "text", className, error, validate, ...props }, ref) => {
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
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            "block w-full rounded-[8px] border border-black bg-white px-4 py-[20px] text-sm text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-blue-300",
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
