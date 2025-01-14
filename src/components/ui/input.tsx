import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { FiInfo, FiEye, FiEyeOff } from "react-icons/fi";

const Tooltip = ({ info }: { info: string }) => (
  <div className="relative group">
    <FiInfo className="text-gray-400 hover:text-blue-500 cursor-pointer" />
    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-1 hidden w-48 p-2 text-xs text-white bg-black rounded-lg group-hover:block z-10 shadow-lg">
      {info}
    </div>
  </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  validate?: "email" | "otp" | "datetime";
  info?: string;
  rounded?: boolean;
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

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      type = "text",
      className,
      error,
      validate,
      info,
      rounded,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState<string>("");
    const [validationError, setValidationError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);

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

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    const inputType = type === "password" && showPassword ? "text" : type;

    return (
      <div className="flex flex-col space-y-2 font-IBM ">
        <div className="flex items-center space-x-2">
          {label && (
            <label
              htmlFor={props.id}
              className="tracking-[.1rem] text-[12px] font-[400] text-[#212529] leading-[18px]"
            >
              {label}
            </label>
          )}
          {info && <Tooltip info={info} />}
        </div>
        <div className="relative">
          <input
            type={inputType}
            ref={ref}
            className={cn(
              "block w-full border font-IBM border-black bg-white px-4 py-[8px] h-[50px] text-sm text-gray-900 shadow-sm  dark:border-gray-700 dark:bg-gray-900 dark:text-white ",
              rounded ? "rounded-full" : "rounded-[8px]",
              (error || validationError) && "border-red-500 focus:ring-red-500",
              className
            )}
            value={inputValue}
            onBlur={handleBlur}
            onChange={handleChange}
            aria-invalid={!!(error || validationError)}
            aria-describedby={props.id ? `${props.id}-error` : undefined}
            {...props}
          />
          {type === "password" && (
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400"
              onClick={togglePasswordVisibility}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          )}
        </div>
        {(error || validationError) && (
          <p
            id={props.id ? `${props.id}-error` : undefined}
            className="text-sm text-red-500"
          >
            {error || validationError}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
