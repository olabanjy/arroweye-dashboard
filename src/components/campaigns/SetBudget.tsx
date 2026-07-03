import { useEffect, useRef, useState } from "react";
import ls from "localstorage-slim";
import { Input } from "@/components/ui/input";
import { fundCampaignWallet, getCampaignWallet } from "@/services/api";
import { useRouter } from "next/router";

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
  const [tokens, setTokens] = useState(340);
  const [email, setEmail] = useState("");
  const [isrc, setIsrc] = useState("");
  const [startDate, setStartDate] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [budgetInput, setBudgetInput] = useState("850,000");
  const [tokenInput, setTokenInput] = useState("340");

  const router = useRouter();

  const [availableBalance, setAvailableBalance] = useState(0);

  useEffect(() => {
    getCampaignWallet()
      .then((data: any) => {
        setAvailableBalance(Number(data?.available_balance) || 0);
      })
      .catch((err) => {
        console.error("Failed to load wallet balance:", err);
      });
  }, [refreshToken]);

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
    isrc?: string;
    budget?: string;
    date?: string;
    terms?: string;
  }>({});

  const handleBuyToken = async () => {
    const newErrors: typeof errors = {};
    const budgetNum = parseInt(budgetInput.replace(/[^0-9]/g, ""), 10);

    if (!budgetInput || isNaN(budgetNum) || budgetNum < MIN_AMOUNT)
      newErrors.budget = `Minimum amount is ₦${formatBudget(MIN_AMOUNT)}.`;

    if (!accepted) newErrors.terms = "You must accept the terms of service.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const callbackUrl = `${window.location.origin}/campaigns/setup?showModal=true`;

    await fundCampaignWallet({
      amount_naira: budgetNum,
      callback_url: callbackUrl,
    })
      .then((data) => {
        const authUrl = data?.paystack?.authorization_url;
        if (authUrl) {
          window.location.href = authUrl;
        } else {
          setErrors({
            budget: "Could not start payment. Please try again.",
          });
        }
      })
      .catch((err) => {
        console.error("Error submitting form:", err);
      });
  };

  const handleContinue = () => {
    if (!accepted) {
      setErrors({ terms: "You must accept the terms of service." });
      return;
    }
    setErrors({});
    router.push("/campaigns/setup?showModal=true");
  };

  const handleSubmit = () => (needsTopUp ? handleBuyToken() : handleContinue());

  return (
    <div className="bg-[#f0f0ef] p-4 sm:p-7">
      <style>{`
        .budget-card {
          background: #ffffff;
          box-shadow: 0 2px 24px 0 rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04);
        }

        .counter-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #111;
          color: #fff;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.12s ease, background 0.12s ease;
          border: none;
          flex-shrink: 0;
          user-select: none;
        }
        .counter-btn:hover { background: #333; transform: scale(1.07); }
        .counter-btn:active { transform: scale(0.95); }

        .budget-display {
          font-size: clamp(2rem, 6vw, 3.25rem);
          font-weight: 500;
          letter-spacing: -0.02em;
          color: #111;
          line-height: 1;
        }

        .buy-btn {
          background: #111;
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 16px 40px;
          font-size: 1.0625rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.12s ease;
          width: 100%;
          max-width: 320px;
          letter-spacing: 0.01em;
        }
        .buy-btn:hover { background: #2a2a2a; }
        .buy-btn:active { transform: scale(0.98); }

        .custom-checkbox {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid #bbb;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          flex-shrink: 0;
        }
        .custom-checkbox.checked {
          border-color: #111;
          background: #111;
        }
        .custom-checkbox.checked::after {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: white;
        }

        input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0.4;
          cursor: pointer;
        }

        .hint-text {
          font-size: 0.75rem;
          color: #999;
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 6px;
        }
      `}</style>
      <div className="flex justify-center items-center gap-2 mb-7 my-10">
        <p>Set Budget</p>
        <div className="h-[1px] w-8 bg-[#A3A3A3]" />
        <p className="text-[#A3A3A3] cursor-not-allowed select-none">
          Launch Campaign
        </p>
      </div>
      <div className="mt-10 mb-20 budget-card w-full px-6 py-10 sm:px-10 sm:py-12">
        {/* Email & ISRC row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <Input
              type="text"
              placeholder="ISRC / UPC"
              value={isrc}
              onChange={(e) => setIsrc(e.target.value)}
            />
            {errors.isrc && (
              <p className="text-red-500 text-xs mt-1">{errors.isrc}</p>
            )}
          </div>
        </div>

        {/* Budget counter */}
        <div className="flex items-center justify-center gap-5 sm:gap-8 mb-10 py-4">
          <button
            className="counter-btn"
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
              style={{ color: needsTopUp ? "#e11d48" : "#111" }}
              className="budget-display text-center bg-transparent border-none outline-none w-full min-w-0"
            />
            {errors.budget && (
              <p className="text-red-500 text-xs mt-1">{errors.budget}</p>
            )}
            <p className="text-xs text-[#999] mt-2">
              Wallet balance: {formatBudget(availableBalance)} tokens
            </p>
            {needsTopUp && (
              <p className="text-xs text-[#e11d48] mt-1">
                Exceeds your balance - buy{" "}
                {formatBudget(tokens - availableBalance)} more token
                {tokens - availableBalance === 1 ? "" : "s"} to cover this
                budget.
              </p>
            )}
          </div>
          <button
            className="counter-btn"
            onClick={increment}
            aria-label="Increase"
          >
            +
          </button>
        </div>

        {/* Tokens & Start Date row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div>
            <Input
              type="text"
              inputMode="numeric"
              value={tokenInput}
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
          <div>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="01/01/2034"
            />
            {errors.date && (
              <p className="text-red-500 text-xs mt-1">{errors.date}</p>
            )}
            <p className="hint-text">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <circle
                  cx="8"
                  cy="8"
                  r="7.25"
                  stroke="#bbb"
                  strokeWidth="1.5"
                />
                <rect
                  x="7.25"
                  y="6.75"
                  width="1.5"
                  height="5"
                  rx=".75"
                  fill="#bbb"
                />
                <rect
                  x="7.25"
                  y="4.25"
                  width="1.5"
                  height="1.5"
                  rx=".75"
                  fill="#bbb"
                />
              </svg>
              Campaigns run for 30 days from the start date.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4">
          <button
            className="buy-btn"
            onClick={handleSubmit}
            disabled={!accepted}
            style={
              !accepted ? { opacity: 0.5, cursor: "not-allowed" } : undefined
            }
          >
            {needsTopUp ? "Buy Token" : "Continue"}
          </button>
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <div
              className={`custom-checkbox ${accepted ? "checked" : ""}`}
              onClick={() => setAccepted((a) => !a)}
              role="checkbox"
              aria-checked={accepted}
              tabIndex={0}
              onKeyDown={(e) => e.key === " " && setAccepted((a) => !a)}
            />
            <span className="text-sm text-[#555]">
              I accept the{" "}
              <a
                href="#"
                className="underline underline-offset-2 text-[#333] hover:text-[#111] transition-colors"
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
