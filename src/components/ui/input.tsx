import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { FiInfo, FiEye, FiEyeOff } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Tooltip = ({ info }: { info: string }) => (
  <div className="relative group">
    <FiInfo className="text-gray-400 hover:text-blue-500 cursor-pointer" />
    <div className="absolute left-[25px] top-0 transform  ml-1 hidden w-60 p-[12px] text-xs font-[400] text-white bg-black rounded-[4px] group-hover:block z-10 shadow-lg font-IBM">
      <div className="absolute left-0 top-[10px] transform -translate-y-1/2 -ml-[6px] border-black border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-black"></div>
      {info}
    </div>
  </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelClassName?: string;
  error?: string;
  validate?: "email" | "otp" | "datetime";
  info?: string;
  rounded?: boolean;
  placeholder?: string;
  value?: string | number;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
      labelClassName,
      type = "text",
      className,
      error,
      validate,
      info,
      rounded,
      placeholder,
      value,
      disabled,
      onChange,
      name,
      ...props
    },
    ref
  ) => {
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

    const handleDateChange = (date: Date | null) => {
      if (date && onChange) {
        let finalDate = new Date(date);

        // Only add a day if the value is not already set (initially null)
        if (!value) {
          finalDate.setDate(finalDate.getDate() + 1);
        }

        const formattedDate = finalDate.toISOString().slice(0, 16);

        const syntheticEvent = {
          target: {
            name,
            value: formattedDate,
          },
        } as React.ChangeEvent<HTMLInputElement>;

        onChange(syntheticEvent);
      }
    };

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    const inputType = type === "password" && showPassword ? "text" : type;

    return (
      <div className="flex flex-col space-y-2 font-IBM">
        <div className="flex items-center space-x-2">
          {label && (
            <label
              htmlFor={props.id}
              className={cn(
                "tracking-[.1rem] text-[12px] font-[400] text-[#212529] leading-[18px]",
                labelClassName
              )}
            >
              {label}
            </label>
          )}
          {info && <Tooltip info={info} />}
        </div>
        {type === "datetime-local" ? (
          <DatePicker
            selected={value ? new Date(value) : null}
            onChange={handleDateChange}
            className={cn(
              "block w-full border font-IBM border-black bg-white px-4 py-[8px] h-[50px] text-[14px] placeholder:text-[14px] font-[400] text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white",
              rounded ? "rounded-full" : "rounded-[8px]",
              (error || validationError) && "border-red-500 focus:ring-red-500",
              className
            )}
            disabled={disabled}
            dateFormat="yyyy-MM-dd HH:mm"
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            placeholderText={placeholder}
          />
        ) : (
          <div className="relative">
            <input
              type={inputType}
              ref={ref}
              className={cn(
                "block w-full border font-IBM border-black bg-white px-4 py-[8px] h-[50px] text-[14px] placeholder:text-[14px] font-[400] text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white",
                rounded ? "rounded-full" : "rounded-[8px]",
                (error || validationError) &&
                  "border-red-500 focus:ring-red-500",
                className
              )}
              placeholder={placeholder}
              value={value}
              name={name}
              onBlur={handleBlur}
              onChange={onChange}
              disabled={disabled}
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
        )}
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

Input.displayName = "Input";

export { Input };
