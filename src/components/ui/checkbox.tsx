import React from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, error, ...props }, ref) => {
    return (
      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          ref={ref}
          className={cn(
            "h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:focus:ring-blue-300",
            className
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={props.id}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        {error && <p className="text-sm text-red-500 ml-2">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
