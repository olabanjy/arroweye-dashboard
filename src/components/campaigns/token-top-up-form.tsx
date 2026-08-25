"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { fundCampaignWallet } from "@/services";

const PRICE_PER_TOKEN = 2500;
const MIN_TOKENS = 1;
const MAX_TOKENS = 10000;
const MIN_AMOUNT = 2500;

interface TokenTopUpFormProps {
  initialTokens: number;
  availableBalance: number;
}

const formatNumber = (amount: number) =>
  new Intl.NumberFormat("en-NG").format(amount);

export function TokenTopUpForm({
  initialTokens,
  availableBalance,
}: TokenTopUpFormProps) {
  const startingTokens = Math.min(
    Math.max(Math.ceil(initialTokens), MIN_TOKENS),
    MAX_TOKENS,
  );
  const [tokens, setTokens] = useState(startingTokens);
  const [tokenInput, setTokenInput] = useState(String(startingTokens));
  const [budgetInput, setBudgetInput] = useState(
    formatNumber(startingTokens * PRICE_PER_TOKEN),
  );
  const [error, setError] = useState("");
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);

  const applyTokens = (nextTokens: number) => {
    const clamped = Math.min(Math.max(nextTokens, MIN_TOKENS), MAX_TOKENS);
    setTokens(clamped);
    setTokenInput(String(clamped));
    setBudgetInput(formatNumber(clamped * PRICE_PER_TOKEN));
    setError("");
  };

  const handleBuyTokens = async () => {
    if (isInitiatingPayment) return;

    const amountNaira = Number(budgetInput.replace(/[^0-9]/g, ""));
    if (!amountNaira || amountNaira < MIN_AMOUNT) {
      setError(`Minimum amount is ₦${formatNumber(MIN_AMOUNT)}.`);
      return;
    }

    setError("");
    setIsInitiatingPayment(true);

    try {
      const callbackUrl = `${window.location.origin}${window.location.pathname}`;
      const data = await fundCampaignWallet({
        amount_naira: amountNaira,
        callback_url: callbackUrl,
      });
      const authorizationUrl = data?.paystack?.authorization_url;

      if (authorizationUrl) {
        window.location.assign(authorizationUrl);
        return;
      }

      setError("Could not start payment. Please try again.");
    } catch (paymentError) {
      console.error("Error initiating wallet top-up:", paymentError);
      setError("Could not start payment. Please try again.");
      toast.error("Could not start payment. Please try again.");
    }

    setIsInitiatingPayment(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="top-up-tokens"
            className="mb-2 block text-xs font-medium text-foreground"
          >
            Tokens
          </label>
          <input
            id="top-up-tokens"
            type="text"
            inputMode="numeric"
            value={tokenInput}
            onChange={(event) => {
              const raw = event.target.value.replace(/[^0-9]/g, "");
              setTokenInput(raw);
              const nextTokens = Number(raw);
              if (nextTokens) {
                setTokens(nextTokens);
                setBudgetInput(formatNumber(nextTokens * PRICE_PER_TOKEN));
              }
            }}
            onBlur={() => applyTokens(Number(tokenInput) || MIN_TOKENS)}
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          />
        </div>

        <div>
          <label
            htmlFor="top-up-amount"
            className="mb-2 block text-xs font-medium text-foreground"
          >
            Amount
          </label>
          <input
            id="top-up-amount"
            type="text"
            inputMode="numeric"
            value={`₦${budgetInput}`}
            onChange={(event) => {
              const raw = event.target.value.replace(/[^0-9]/g, "");
              setBudgetInput(raw);
              const amount = Number(raw);
              if (amount) {
                const nextTokens = Math.round(amount / PRICE_PER_TOKEN);
                setTokens(nextTokens);
                setTokenInput(String(nextTokens));
              }
            }}
            onBlur={() => {
              const amount =
                Number(budgetInput.replace(/[^0-9]/g, "")) || MIN_AMOUNT;
              applyTokens(Math.round(amount / PRICE_PER_TOKEN));
            }}
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-5 py-2 sm:gap-8">
        <button
          type="button"
          onClick={() => applyTokens(tokens - 10)}
          className="flex size-11 shrink-0 items-center justify-center rounded-full border-none bg-[#111] text-2xl text-white transition-[transform,background] duration-150 hover:bg-[#333] active:scale-95 dark:bg-primary dark:text-primary-foreground"
          aria-label="Decrease tokens"
        >
          -
        </button>

        <div className="min-w-0 text-center">
          <p className="text-[clamp(2rem,6vw,3rem)] font-medium leading-none tracking-[-0.02em] text-foreground">
            ₦{budgetInput}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Wallet balance: {formatNumber(availableBalance)} tokens
          </p>
        </div>

        <button
          type="button"
          onClick={() => applyTokens(tokens + 10)}
          className="flex size-11 shrink-0 items-center justify-center rounded-full border-none bg-[#111] text-2xl text-white transition-[transform,background] duration-150 hover:bg-[#333] active:scale-95 dark:bg-primary dark:text-primary-foreground"
          aria-label="Increase tokens"
        >
          +
        </button>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <button
        type="button"
        onClick={handleBuyTokens}
        disabled={isInitiatingPayment}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#111] px-5 font-semibold text-white transition-[background,transform] duration-150 hover:bg-[#2a2a2a] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary dark:text-primary-foreground"
      >
        {isInitiatingPayment && (
          <LoaderCircle className="size-4 animate-spin" />
        )}
        {isInitiatingPayment ? "Initiating payment..." : "Buy tokens"}
      </button>
    </div>
  );
}
