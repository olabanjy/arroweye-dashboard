import { useState } from "react";

export const useNoNetwork = (onReconnect: () => void) => {
  const [isChecking, setIsChecking] = useState(false);

  const handleRetry = async () => {
    setIsChecking(true);

    if (typeof window !== "undefined" && !navigator.onLine) {
      setTimeout(() => {
        setIsChecking(false);
      }, 1000);
      return;
    }

    try {
      const pingUrl = process.env.NEXT_PUBLIC_APP_SERVER_DOMAIN || window.location.origin;
      await fetch(pingUrl, {
        method: "HEAD",
        mode: "no-cors",
        cache: "no-store",
      });
      onReconnect();
    } catch (error) {
      console.error("Connectivity check failed:", error);
    } finally {
      setIsChecking(false);
    }
  };

  return {
    isChecking,
    handleRetry,
  };
};
