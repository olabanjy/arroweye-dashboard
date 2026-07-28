import React, {
  createContext,
  useContext,
  ReactNode,
} from "react";
import ls from "localstorage-slim";
import { useRouter } from "next/router";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface UserProfile {
  fullname: string;
  staff_email: string;
  role: string;
  business_name: string;
  business_type: string;
  id?: string | number;
}

interface User {
  phone_verified?: boolean;
  user_type: string;
  user_profile?: UserProfile;
  created?: string;
  last_login?: string;
  email?: string;
  id?: string | number;
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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<any>({
    queryKey: ["auth", "session"],
    queryFn: async () => ls.get("Profile", { decrypt: true }),
    staleTime: Infinity,
  });

  const login = (authData: any) => {
    ls.set("Profile", authData, { encrypt: true });
    queryClient.setQueryData(["auth", "session"], authData);
    router.push("/campaigns");
  };

  const logout = () => {
    ls.remove("Profile");
    queryClient.setQueryData(["auth", "session"], null);
    router.push("/login");
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
