import React from "react";
import { cn } from "@/lib/utils";
import { FiInfo } from "react-icons/fi";

interface SelectInputProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string | number; label: string }[];
  error?: string;
  info?: string;
  labelText?: string;
}

const SelectInput = React.forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ label, options, className, error, info, labelText, ...props }, ref) => {
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
        <select
          ref={ref}
          className={cn(
            "block w-full rounded-[8px] border border-black bg-white px-4 py-[12px] text-sm text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-blue-300",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        >
          <option value="">{labelText || "Select an option"}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

SelectInput.displayName = "SelectInput";

export { SelectInput };
