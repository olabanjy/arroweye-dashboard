import ls from "localstorage-slim";
import type { AuthSession } from "@/types/api";

const AUTH_SESSION_KEY = "Profile";
const AUTH_COOKIE_NAME = "auth_token";
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const configureBrowserStorage = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    ls.config.storage = window.localStorage;
  }
};

export const getAuthSession = (): AuthSession | null => {
  configureBrowserStorage();
  return ls.get(AUTH_SESSION_KEY, { decrypt: true }) as AuthSession | null;
};

export const setAuthSession = (session: AuthSession) => {
  configureBrowserStorage();
  return ls.set(AUTH_SESSION_KEY, session, { encrypt: true });
};

export const setAuthTokenCookie = (token: string) => {
  if (typeof document === "undefined") return;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${AUTH_COOKIE_NAME}=${token}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
};

export const clearAuthTokenCookie = () => {
  if (typeof document === "undefined") return;

  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
};

export const clearAuthSession = () => {
  configureBrowserStorage();
  ls.remove(AUTH_SESSION_KEY);
  clearAuthTokenCookie();
};
