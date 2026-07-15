import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import ls from "localstorage-slim";
import { toast, Id as ToastId } from "react-toastify";
import axios from "axios";

if (typeof window !== "undefined" && window?.localStorage)
  ls.config.storage = localStorage;

export const setLS = (key: string, value: unknown) => {
  return ls.set(key, value, { encrypt: true });
};

export const getLS = <T>(key: string): T => {
  return ls.get(key, { decrypt: true }) as T;
};

export const removeLS = (key: string) => {
  return ls.remove(key);
};

export const clearLS = () => {
  return ls.clear();
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: any) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

export const hasAccess = (userProfile: any, allowedRoles: any = []) => {
  if (userProfile?.business_type === "Vendor") {
    return true;
  }

  return allowedRoles.includes(userProfile?.role);
};
export const hasAccessNoVendor = (userProfile: any, allowedRoles: any = []) => {
  if (userProfile?.business_type === "Vendor") {
    return false;
  }

  return allowedRoles.includes(userProfile?.role);
};

export const hasAccessExceptVendorManager = (
  userProfile: any,
  allowedRoles: any = [],
) => {
  if (userProfile?.business_type === "Vendor") {
    // Grant access to all vendors except Managers
    return userProfile?.role !== "Manager";
  }

  return allowedRoles.includes(userProfile?.role);
};

export const extractErrorMessage = (errorData: any): string => {
  // Case 1: String error
  if (typeof errorData === "string") {
    return errorData;
  }

  // Case 2: Array of strings
  if (Array.isArray(errorData)) {
    return errorData.filter(Boolean).join(", ");
  }

  // Case 3: Object with field errors
  if (errorData && typeof errorData === "object") {
    const messages: string[] = [];

    Object.entries(errorData).forEach(([field, errors]) => {
      if (Array.isArray(errors)) {
        errors.forEach((error) => {
          if (error) {
            messages.push(`${field}: ${error}`);
          }
        });
      } else if (typeof errors === "string") {
        messages.push(`${field}: ${errors}`);
      }
    });

    return messages.join(", ");
  }

  // Default case if no matching format
  return "An error occurred";
};

export const redirectToLogin = () => {
  if (typeof window !== "undefined") {
    clearLS();
    window.location.href = "/login";
  }
};

interface ToastUpdateOptions {
  toastId: ToastId;
  autoClose?: number;
}

export const handleApiError = (
  error: unknown,
  defaultMessage = "Request failed. Please try again.",
  toastUpdateOptions?: ToastUpdateOptions,
): string => {
  let errorMessage = defaultMessage;

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const errorData = error.response?.data;

    // Check for offline / network / timeout errors
    const isNetworkError = !error.response || error.code === "ERR_NETWORK" || error.message === "Network Error";
    const isTimeout = error.code === "ECONNABORTED" || error.message?.includes("timeout");

    if (isNetworkError || isTimeout) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("app-network-error"));
      }
      if (toastUpdateOptions) {
        toast.dismiss(toastUpdateOptions.toastId);
      }
      return isTimeout ? "Connection timed out" : "Network Error";
    }

    // ✅ ALWAYS handle auth first
    if (status === 401) {
      errorMessage = "Authentication required. Please log in again.";
      redirectToLogin();
    } else if (status === 403) {
      errorMessage =
        "Access denied. You don't have permission for this action.";
    }
    // ✅ THEN handle API messages
    else if (errorData) {
      errorMessage = extractErrorMessage(errorData);
    }
    // fallback
    else if (errorData?.message) {
      errorMessage = errorData.message;
    }
  }

  if (toastUpdateOptions) {
    toast.update(toastUpdateOptions.toastId, {
      render: errorMessage,
      type: "error",
      isLoading: false,
      autoClose: toastUpdateOptions.autoClose || 3000,
    });
  } else {
    toast.error(errorMessage);
  }

  return errorMessage;
};
