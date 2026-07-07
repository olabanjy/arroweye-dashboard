import { useState, useEffect, useCallback } from "react";
import { validateISRC } from "@ssh/isrc";
import barcodeValidator from "barcode-validator";

export interface ValidationResult {
  isValid: boolean;
  type: "isrc" | "upc" | null;
  error: string | null;
}

export const useIsrcUpcValidator = (initialValue: string = "") => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [type, setType] = useState<"isrc" | "upc" | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validate = useCallback(async (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) {
      setError(null);
      setIsValid(false);
      setType(null);
      setIsValidating(false);
      return;
    }

    // Remove hyphens and whitespace to normalize input formats
    const sanitized = trimmed.replace(/[-\s]/g, "");
    const isAllNumeric = /^\d+$/.test(sanitized);

    setIsValidating(true);

    if (isAllNumeric) {
      // Validate as UPC / Barcode
      const isValidUpc = barcodeValidator(sanitized);
      if (isValidUpc) {
        setError(null);
        setIsValid(true);
        setType("upc");
      } else {
        setError("Invalid UPC format. Must be a valid barcode (e.g. 12-digit UPC).");
        setIsValid(false);
        setType("upc");
      }
      setIsValidating(false);
    } else {
      // Validate as ISRC
      try {
        await validateISRC(sanitized.toUpperCase());
        setError(null);
        setIsValid(true);
        setType("isrc");
      } catch (err: any) {
        setError(err?.message || "Invalid ISRC format.");
        setIsValid(false);
        setType("isrc");
      } finally {
        setIsValidating(false);
      }
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      validate(value);
    }, 300); // 300ms debounce for local validation

    return () => {
      clearTimeout(handler);
    };
  }, [value, validate]);

  return {
    value,
    setValue,
    error,
    isValid,
    type,
    isValidating,
    triggerValidation: validate,
  };
};
