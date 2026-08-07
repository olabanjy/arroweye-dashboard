"use client";

import { createContext, ReactNode, useContext, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ls from "localstorage-slim";
import type {
  AuthenticatedUser,
  AuthSession,
  UserProfile,
} from "@/types/api";

if (typeof window !== "undefined" && window?.localStorage)
  ls.config.storage = localStorage;

interface AuthContextType {
  user: AuthenticatedUser | null;
  userProfile: UserProfile | null;
  token: string | null;
  isAdvertiser: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (authData: AuthSession) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthSessionProviderProps {
  children: ReactNode;
  navigate: (href: string) => void;
}

export const AuthSessionProvider = ({
  children,
  navigate,
}: AuthSessionProviderProps) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<AuthSession | null>({
    queryKey: ["auth", "session"],
    queryFn: async () =>
      ls.get("Profile", { decrypt: true }) as AuthSession | null,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  useEffect(() => {
    if (!isLoading && typeof window !== "undefined") {
      const token = data?.token || data?.access || null;
      if (token) {
        document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure`;
      } else {
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    }
  }, [data, isLoading]);

  const login = (authData: AuthSession) => {
    const token = authData?.token || authData?.access || null;
    if (token && typeof window !== "undefined") {
      document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax; Secure`;
    }
    ls.set("Profile", authData, { encrypt: true });
    queryClient.setQueryData(["auth", "session"], authData);
    navigate("/campaigns");
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    ls.remove("Profile");
    queryClient.setQueryData(["auth", "session"], null);
    navigate("/login");
  };

  const user = data?.user || null;
  const token = data?.token || data?.access || null;
  const userProfile = user?.user_profile || null;
  const isAdvertiser = user?.user_type === "Advertiser";
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        token,
        isAdvertiser,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
