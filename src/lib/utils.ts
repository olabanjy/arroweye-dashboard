import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import ls from "localstorage-slim";

if (typeof window !== "undefined" && window?.sessionStorage)
  ls.config.storage = sessionStorage;

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
