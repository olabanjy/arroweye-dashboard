import React, { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { FiInfo, FiEye, FiEyeOff } from "react-icons/fi";

const Tooltip = ({ info }: { info: string }) => (
  <div className="relative group">
    <FiInfo className="text-gray-400 hover:text-blue-500 cursor-pointer" />
    <div className="absolute font-[300] left-1/2 transform -translate-x-1/2 bottom-full mb-1 hidden w-48 p-2 text-xs text-white bg-black rounded-lg group-hover:block z-10 shadow-lg">
      {info}
    </div>
  </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  validate?: "email" | "otp" | "datetime";
  info?: string;
  options?: { value: string; label: string; email: string }[];
  selectedValue?: string;
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

const DropDownInput = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      type = "text",
      className,
      error,
      validate,
      info,
      options = [],
      selectedValue,
      ...props
    },
    ref
  ) => {
    const initialOption = options.find(
      (option) => option.value === selectedValue
    );
    const [inputValue, setInputValue] = useState<string>(
      initialOption?.email || ""
    );
    const [validationError, setValidationError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    useEffect(() => {
      const selected = options.find((option) => option.value === selectedValue);
      if (selected) {
        setInputValue(selected.email);
      }
    }, [selectedValue, options]);

    const { validateInput, getValidationError } = useValidation(validate);

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (validate && value && !validateInput(value)) {
        setValidationError(getValidationError());
      } else {
        setValidationError(null);
      }
      setTimeout(() => setShowDropdown(false), 200);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
      setShowDropdown(true);
    };

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    const handleOptionSelect = (value: string, email: string) => {
      setInputValue(email);
      setShowDropdown(false);
      if (props.onChange) {
        const event = {
          target: {
            value: email,
            name: props.name,
          },
        } as React.ChangeEvent<HTMLInputElement>;
        props.onChange(event);
      }
    };

    const inputType = type === "password" && showPassword ? "text" : type;

    return (
      <div className="flex flex-col space-y-2 font-IBM">
        <div className="flex items-center space-x-2">
          {label && (
            <label
              htmlFor={props.id}
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
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
              "block w-full rounded-[8px] border border-black bg-white px-4 py-[8px] h-[50px]  text-gray-900 shadow-sm  dark:text-white  text-[17px] font-[400]",
              (error || validationError) && "border-red-500 focus:ring-red-500",
              className
            )}
            value={inputValue}
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={() => setShowDropdown(true)}
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
          {showDropdown && options.length > 0 && (
            <div className="absolute left-0 w-full mt-[20px] bg-white shadow-lg rounded-[8px] z-10 dark:bg-gray-900 max-h-[130px] overflow-y-auto scrollbar-hide scrollbar-hide::-webkit-scrollbar">
              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleOptionSelect(option.value, option.email)}
                  className="grid gap-[6px] px-4 py-2 text-sm text-gray-900 cursor-pointer hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700"
                >
                  <p className="font-[600] text-[16px] font-IBM text-[#212529]">
                    {option.label}
                  </p>
                  <p className="text-[14px] font-[400] text-[#212529] font-IBM">
                    {option.email}
                  </p>
                </div>
              ))}
            </div>
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

DropDownInput.displayName = "DropDownInput";

export { DropDownInput };
