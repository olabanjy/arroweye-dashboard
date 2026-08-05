"use client";
import { useEffect, useRef, useState } from "react";
import ls from "localstorage-slim";
import { Input } from "@/components/ui/input";
import { fundCampaignWallet, getCampaignWallet } from "@/services";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-session";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

const PRICE_PER_TOKEN = 2500; // ₦ per token
const MIN_TOKENS = 1;
const MAX_TOKENS = 10000;
const MIN_AMOUNT = 2500;
const BUDGET_STORAGE_KEY = "SetBudgetTokens";

export default function SetBudget({
  refreshToken = 0,
}: {
  refreshToken?: number;
}) {
  const { user, userProfile } = useAuth();
  const [tokens, setTokens] = useState(10);
  const [email, setEmail] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [budgetInput, setBudgetInput] = useState("25,000");
  const [tokenInput, setTokenInput] = useState("10");
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);
  const paymentInFlightRef = useRef(false);

  useEffect(() => {
    const currentUserEmail = user?.email || userProfile?.staff_email;

    if (currentUserEmail) {
      setEmail((currentEmail) => currentEmail || currentUserEmail);
    }
  }, [user?.email, userProfile?.staff_email]);

  useEffect(() => {
    const resetPaymentState = () => {
      paymentInFlightRef.current = false;
      setIsInitiatingPayment(false);
    };

    window.addEventListener("pageshow", resetPaymentState);
    return () => window.removeEventListener("pageshow", resetPaymentState);
  }, []);

  const router = useRouter();

  const { data: walletData, refetch: refetchWallet } = useQuery({
    queryKey: ["wallet"],
    queryFn: getCampaignWallet,
  });

  const availableBalance = Number(walletData?.available_balance) || 0;

  useEffect(() => {
    refetchWallet();
  }, [refreshToken, refetchWallet]);

  const needsTopUp = tokens > availableBalance;

  const formatBudget = (amount: number) =>
    new Intl.NumberFormat("en-NG").format(amount);

  // Single source of truth: update all three states together
  const applyTokens = (newTokens: number) => {
    const clamped = Math.min(Math.max(newTokens, MIN_TOKENS), MAX_TOKENS);
    setTokens(clamped);
    setTokenInput(String(clamped));
    setBudgetInput(formatBudget(clamped * PRICE_PER_TOKEN));
  };

  const increment = () => applyTokens(tokens + 10);
  const decrement = () => applyTokens(tokens - 10);

  // Restore the previously selected budget on mount (survives back-navigation)
  const skipPersist = useRef(true);

  useEffect(() => {
    const saved = Number(ls.get(BUDGET_STORAGE_KEY));
    if (!isNaN(saved) && saved > 0) applyTokens(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (skipPersist.current) {
      skipPersist.current = false;
      return;
    }
    ls.set(BUDGET_STORAGE_KEY, tokens);
  }, [tokens]);

  const [errors, setErrors] = useState<{
    email?: string;
    budget?: string;
    terms?: string;
  }>({});

  const toggleAccepted = () => {
    const nextAccepted = !accepted;
    setAccepted(nextAccepted);

    if (nextAccepted) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        terms: undefined,
      }));
    }
  };

  const handleBuyToken = async () => {
    if (paymentInFlightRef.current) return;

    const newErrors: typeof errors = {};
    const budgetNum = parseInt(budgetInput.replace(/[^0-9]/g, ""), 10);

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!budgetInput || isNaN(budgetNum) || budgetNum < MIN_AMOUNT)
      newErrors.budget = `Minimum amount is ₦${formatBudget(MIN_AMOUNT)}.`;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const callbackUrl = `${window.location.origin}/campaigns/setup?showModal=true`;
    paymentInFlightRef.current = true;
    setIsInitiatingPayment(true);

    try {
      const data = await fundCampaignWallet({
        amount_naira: budgetNum,
        callback_url: callbackUrl,
      });

      const authUrl = data?.paystack?.authorization_url;
      if (authUrl) {
        window.location.assign(authUrl);
        return;
      }

      setErrors({
        budget: "Could not start payment. Please try again.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({
        budget: "Could not start payment. Please try again.",
      });
    }

    paymentInFlightRef.current = false;
    setIsInitiatingPayment(false);
  };

  const handleContinue = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    router.push("/campaigns/setup?showModal=true");
  };

  const handleSubmit = () => {
    if (!accepted) {
      const termsError = "Please accept the terms of service to continue.";
      setErrors((currentErrors) => ({
        ...currentErrors,
        terms: termsError,
      }));
      // toast.error(termsError);
      return;
    }

    return needsTopUp ? handleBuyToken() : handleContinue();
  };

  return (
    <div className="p-4 sm:p-7">
      <div className="flex justify-center items-center gap-2 mb-7 my-10 text-gray-950 dark:text-foreground">
        <p>Set Budget</p>
        <div className="h-[1px] w-8 bg-[#A3A3A3] dark:bg-border" />
        <p className="text-[#A3A3A3] dark:text-muted-foreground cursor-not-allowed select-none">
          Launch Campaign
        </p>
      </div>
      <div className="mt-10 mb-20 w-full px-6 py-10 sm:px-10 sm:py-12 text-gray-950 dark:text-foreground">
        {/* Email & Tokens row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="dark:bg-transparent"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="Tokens"
              value={tokenInput}
              className="dark:bg-transparent"
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, "");
                setTokenInput(raw);
                const num = parseInt(raw, 10);
                if (!isNaN(num)) {
                  setTokens(num);
                  setBudgetInput(formatBudget(num * PRICE_PER_TOKEN));
                }
              }}
              onBlur={() => {
                const num = parseInt(tokenInput, 10);
                const clamped = isNaN(num)
                  ? MIN_TOKENS
                  : Math.max(num, MIN_TOKENS);
                applyTokens(clamped);
              }}
            />
          </div>
        </div>

        {/* Budget counter */}
        <div className="flex items-center justify-center gap-5 sm:gap-8 mb-10 py-4">
          <button
            className="w-12 h-12 rounded-full bg-[#111] text-white text-2xl flex items-center justify-center cursor-pointer transition-[transform,background] duration-120 ease-out border-none shrink-0 select-none hover:bg-[#333] hover:scale-107 active:scale-95 dark:bg-primary dark:text-primary-foreground dark:hover:brightness-[0.92]"
            onClick={decrement}
            aria-label="Decrease"
          >
            -
          </button>
          <div className="flex flex-col items-center">
            <input
              type="text"
              inputMode="numeric"
              value={`₦${budgetInput}`}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, "");
                setBudgetInput(raw);
                const num = parseInt(raw, 10);
                if (!isNaN(num)) {
                  const newTokens = Math.round(num / PRICE_PER_TOKEN);
                  setTokens(newTokens);
                  setTokenInput(String(newTokens));
                }
              }}
              onBlur={() => {
                const num = parseInt(budgetInput.replace(/[^0-9]/g, ""), 10);
                const clamped = isNaN(num) ? MIN_AMOUNT : Math.max(num, 0);
                const newTokens = Math.round(clamped / PRICE_PER_TOKEN);
                setTokens(newTokens);
                setTokenInput(String(newTokens));
                setBudgetInput(formatBudget(clamped));
              }}
              className={`text-center bg-transparent border-none outline-none w-full min-w-0 text-[clamp(2rem,6vw,3.25rem)] font-medium tracking-[-0.02em] text-[#111] leading-none dark:text-foreground ${
                needsTopUp ? "!text-rose-600 dark:!text-rose-400" : ""
              }`}
            />
            {errors.budget && (
              <p className="text-red-500 text-xs mt-1">{errors.budget}</p>
            )}
            <p className="text-xs text-[#999] dark:text-muted-foreground mt-2">
              Wallet balance: {formatBudget(availableBalance)} tokens
            </p>
            {needsTopUp && (
              <p className="text-xs text-[#e11d48] dark:text-rose-400 mt-1">
                Exceeds your balance - buy{" "}
                {formatBudget(tokens - availableBalance)} more token
                {tokens - availableBalance === 1 ? "" : "s"} to cover this
                budget.
              </p>
            )}
          </div>
          <button
            className="w-12 h-12 rounded-full bg-[#111] text-white text-2xl flex items-center justify-center cursor-pointer transition-[transform,background] duration-120 ease-out border-none shrink-0 select-none hover:bg-[#333] hover:scale-107 active:scale-95 dark:bg-primary dark:text-primary-foreground dark:hover:brightness-[0.92]"
            onClick={increment}
            aria-label="Increase"
          >
            +
          </button>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4">
          <button
            className="flex items-center justify-center gap-2 bg-[#111] text-white border-none rounded-xl py-4 px-10 text-[1.0625rem] font-semibold cursor-pointer transition-[background,transform] duration-150 ease-out w-full max-w-[320px] tracking-[0.01em] hover:bg-[#2a2a2a] active:scale-98 dark:bg-primary dark:text-primary-foreground dark:hover:brightness-[0.92] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={isInitiatingPayment}
          >
            {isInitiatingPayment && <LoaderCircle className="animate-spin" />}
            {isInitiatingPayment
              ? "Initiating payment..."
              : needsTopUp
                ? "Buy Token"
                : "Continue"}
          </button>
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <div
              className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center cursor-pointer transition-[border-color,background-color] duration-150 shrink-0 ${
                accepted
                  ? "border-[#111] bg-[#111] dark:border-primary dark:bg-primary"
                  : "border-[#bbb] bg-white dark:border-border dark:bg-card"
              }`}
              onClick={toggleAccepted}
              role="checkbox"
              aria-checked={accepted}
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === " " || event.key === "Enter") {
                  event.preventDefault();
                  toggleAccepted();
                }
              }}
            >
              {accepted && (
                <div className="w-[6px] h-[6px] rounded-full bg-white dark:bg-primary-foreground" />
              )}
            </div>
            <span className="text-sm text-[#555] dark:text-muted-foreground">
              I accept the{" "}
              <a
                href="#"
                className="underline underline-offset-2 text-[#333] hover:text-[#111] dark:text-foreground transition-colors"
              >
                terms of service
              </a>
            </span>
          </label>
          {errors.terms && (
            <p className="text-red-500 text-xs">{errors.terms}</p>
          )}
        </div>
      </div>
    </div>
  );
}
