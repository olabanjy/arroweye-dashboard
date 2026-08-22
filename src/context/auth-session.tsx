"use client";

import { createContext, ReactNode, useContext, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  clearAuthSession,
  clearAuthTokenCookie,
  getAuthSession,
  setAuthSession,
  setAuthTokenCookie,
} from "@/lib/auth-storage";
import type {
  AuthenticatedUser,
  AuthSession,
  UserProfile,
} from "@/types/api";

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
    queryFn: async () => getAuthSession(),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  useEffect(() => {
    if (isLoading) return;

    const token = data?.access || data?.token || null;
    if (token) {
      setAuthTokenCookie(token);
    } else {
      // The proxy only sees the cookie. Remove an orphaned cookie when browser
      // storage no longer contains a session, otherwise /login redirects back
      // to /campaigns forever without making an API request.
      clearAuthTokenCookie();
    }
  }, [data, isLoading]);

  const login = (authData: AuthSession) => {
    const token = authData?.access || authData?.token || null;
    if (token && typeof window !== "undefined") {
      setAuthTokenCookie(token);
    }
    setAuthSession(authData);
    queryClient.setQueryData(["auth", "session"], authData);
    navigate("/campaigns");
  };

  const logout = () => {
    clearAuthSession();
    queryClient.setQueryData(["auth", "session"], null);
    navigate("/login");
  };

  const user = data?.user || null;
  const token = data?.access || data?.token || null;
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
