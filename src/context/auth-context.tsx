"use client";

import { ReactNode } from "react";
import { useRouter } from "next/router";
import { AuthSessionProvider, useAuth } from "./auth-session";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();

  return (
    <AuthSessionProvider navigate={(href) => router.push(href)}>
      {children}
    </AuthSessionProvider>
  );
};

export { useAuth };
