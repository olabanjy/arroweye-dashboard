import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import "react-datepicker/dist/react-datepicker.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelClassName?: string;
  error?: string;
  validate?: "email" | "otp" | "datetime";
  info?: string;
  rounded?: boolean;
  placeholder?: string;
}

const useValidation = (validate: InputProps["validate"]) => {
  const validateInput = useCallback(
    (value: string) => {
      if (validate === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      }
      if (validate === "otp") {
        const otpRegex = /^\d{6}$/;
        return otpRegex.test(value);
      }
      if (validate === "datetime") {
        const datetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
        return datetimeRegex.test(value);
      }
      return true;
    },
    [validate]
  );

  const getValidationError = useCallback(() => {
    if (validate === "email") return "Invalid email address";
    if (validate === "otp") return "OTP must be 6 digits";
    if (validate === "datetime") return "Invalid datetime format";
    return null;
  }, [validate]);

  return { validateInput, getValidationError };
};

const WeekInput = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      className,
      label = "WEEK 1",
      labelClassName,
      error,
      validate,
      rounded,
      placeholder,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState<string>("");
    const [validationError, setValidationError] = useState<string | null>(null);

    const { validateInput, getValidationError } = useValidation(validate);

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (validate && value && !validateInput(value)) {
        setValidationError(getValidationError());
      } else {
        setValidationError(null);
      }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    };

    const inputType = type === "password" ? "text" : type;

    return (
      <div className="flex flex-col space-y-2 font-IBM">
        <div className="relative">
          <p
            className={cn(
              "absolute rounded-t-[8px] bg-[#000000] top-0 left-0 flex w-full items-center justify-center  text-[9px] font-[700] text-[#888888]  dark:text-gray-400",
              labelClassName
            )}
          >
            {label}
          </p>
          <input
            type={inputType}
            ref={ref}
            className={cn(
              "block w-full border font-IBM border-black bg-white px-4 py-[8px] h-[50px] text-[14px] placeholder:text-[14px] font-[400] text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white",
              rounded ? "rounded-full" : "rounded-[8px]",
              (error || validationError) && "border-red-500 focus:ring-red-500",
              className
            )}
            placeholder={placeholder}
            value={inputValue}
            onBlur={handleBlur}
            onChange={handleChange}
            aria-invalid={!!(error || validationError)}
            aria-describedby={props.id ? `${props.id}-error` : undefined}
            {...props}
          />
        </div>

        {(error || validationError) && (
          <p
            id={props.id ? `${props.id}-error` : undefined}
            className="font-IBM text-sm text-red-500"
          >
            {error || validationError}
          </p>
        )}
      </div>
    );
  }
);

WeekInput.displayName = "WeekInput";

export { WeekInput };
