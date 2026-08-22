"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-session";
import { clearAuthSession } from "@/lib/auth-storage";

export const useProtectedRoute = (enabled = true) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (enabled && !isLoading && !isAuthenticated) {
      // Clear the proxy cookie before navigating. This also repairs sessions
      // left half-cleared by older builds, where Profile is gone but the cookie
      // still makes the proxy treat the browser as authenticated.
      clearAuthSession();
      router.replace("/login");
    }
  }, [enabled, isLoading, isAuthenticated, router]);

  return {
    isAuthenticated: enabled ? isAuthenticated : true,
    isLoading: enabled ? isLoading : false,
  };
};
