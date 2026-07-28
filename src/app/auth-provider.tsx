"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AuthSessionProvider } from "@/context/auth-session";

export function AppAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <AuthSessionProvider navigate={(href) => router.push(href)}>
      {children}
    </AuthSessionProvider>
  );
}
