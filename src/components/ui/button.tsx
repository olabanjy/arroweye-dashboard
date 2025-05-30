import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      label,
      variant = "primary",
      size = "medium",
      isLoading,
      loadingText,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "flex items-center justify-center font-medium text-white focus:outline-none transition duration-200 ease-in-out rounded-full";

    const variantStyles = {
      primary: "bg-[#020d2a] focus:ring-2 focus:ring-blue-500",
      secondary: " ",
      danger: " ",
    };

    const sizeStyles = {
      small: "px-4 py-2 text-sm",
      medium: "px-6 py-3 text-base",
      large: "px-8 py-4 text-lg",
    };

    // Combine isLoading and the passed disabled prop
    const isDisabled = isLoading || disabled;

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          isDisabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
        disabled={isDisabled}
        style={{ fontFamily: "IBM Plex Sans" }}
      >
        {!isLoading && (label || "Button")}
        {isLoading && loadingText && <span className="">{loadingText}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
