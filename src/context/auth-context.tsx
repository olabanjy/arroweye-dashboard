import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import ls from "localstorage-slim";
import { useRouter } from "next/router";

interface UserProfile {
  fullname: string;
  staff_email: string;
  role: string;
  business_name: string;
  business_type: string;
}

interface User {
  phone_verified?: boolean;
  user_type: string;
  user_profile?: UserProfile;
  created?: string;
  last_login?: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  token: string | null;
  isAdvertiser: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (authData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAuthData = () => {
      try {
        const content: any = ls.get("Profile", { decrypt: true });
        if (content) {
          setUser(content.user || null);
          setToken(content.token || content.access || null);
        }
      } catch (error) {
        console.error("Failed to load auth data from storage", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const login = (authData: any) => {
    ls.set("Profile", authData, { encrypt: true });
    setUser(authData.user || null);
    setToken(authData.token || authData.access || null);
    router.push("/campaigns");
  };

  const logout = () => {
    ls.remove("Profile");
    setUser(null);
    setToken(null);
    router.push("/login");
  };

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
