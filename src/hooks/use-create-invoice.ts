import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-session";
import { hasAccessExceptVendorManager } from "@/lib/utils";

const CREATE_INVOICE_TRANSITION_MS = 300;

export const useCreateInvoice = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const { userProfile } = useAuth();

  // Keep the form mounted until the collapse finishes so it can animate out.
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      return;
    }
    const timeout = setTimeout(
      () => setIsRendered(false),
      CREATE_INVOICE_TRANSITION_MS,
    );
    return () => clearTimeout(timeout);
  }, [isOpen]);

  return {
    canCreate: hasAccessExceptVendorManager(userProfile, [""]),
    isOpen,
    isRendered: isOpen || isRendered,
    toggle: () => setIsOpen((open) => !open),
  };
};

export type CreateInvoiceState = ReturnType<typeof useCreateInvoice>;
