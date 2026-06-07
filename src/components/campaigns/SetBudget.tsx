import { useState } from "react";
import { Input } from "@/components/ui/input";
import { fundCampaignWallet } from "@/services/api";
import Link from "next/link";
import { useRouter } from "next/router";

const PRICE_PER_TOKEN = 2500; // ₦ per token
const MIN_TOKENS = 10;
const MAX_TOKENS = 10000;
const MIN_AMOUNT = 2500;

export default function SetBudget() {
  const [tokens, setTokens] = useState(340);
  const [email, setEmail] = useState("");
  const [isrc, setIsrc] = useState("");
  const [startDate, setStartDate] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [budgetInput, setBudgetInput] = useState("850,000");
  const [tokenInput, setTokenInput] = useState("340");

  const router = useRouter();

  const budget = tokens * PRICE_PER_TOKEN;

  const formatBudget = (amount: number) =>
    new Intl.NumberFormat("en-NG").format(amount);

  const increment = () => setTokens((t) => Math.min(t + 10, MAX_TOKENS));
  const decrement = () => setTokens((t) => Math.max(t - 10, MIN_TOKENS));

  const handleTokenInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value.replace(/\D/g, ""), 10);
    if (!isNaN(val)) setTokens(Math.min(Math.max(val, MIN_TOKENS), MAX_TOKENS));
  };

  const [errors, setErrors] = useState<{
    email?: string;
    isrc?: string;
    budget?: string;
    date?: string;
    terms?: string;
  }>({});

  const handleSubmit = async () => {
    const newErrors: typeof errors = {};
    const budgetNum = parseInt(budgetInput.replace(/[^0-9]/g, ""), 10);

    // if (!email) newErrors.email = "Email is required.";
    // else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    //   newErrors.email = "Enter a valid email.";

    // if (!isrc) newErrors.isrc = "ISRC / UPC is required.";

    if (!budgetInput || isNaN(budgetNum) || budgetNum < MIN_AMOUNT)
      newErrors.budget = `Minimum amount is ₦${formatBudget(MIN_AMOUNT)}.`;

    // if (!startDate) newErrors.date = "Start date is required.";

    if (!accepted) newErrors.terms = "You must accept the terms of service.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    await fundCampaignWallet({ amount_naira: budgetNum })
      .then((data) => {
        const authUrl = data?.paystack?.data?.authorization_url;

        if (authUrl) window.open(authUrl, "_blank");

        setTimeout(() => {
          router.push("/campaigns/setup?showModal=true");
        }, 5000);
      })
      .catch((err) => {
        console.error("Error submitting form:", err);
      });
  };

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
        <Link
          href={{
            pathname: "/campaigns/setup",
            query: { showModal: "true" },
          }}
        >
          <p className="text-[#A3A3A3]">Launch Campaign</p>
        </Link>
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
          <div className="flex flex-col">
            <input
              type="text"
              inputMode="numeric"
              value={`₦${budgetInput}`}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, "");
                setBudgetInput(raw);
                const num = parseInt(raw, 10);
                if (!isNaN(num)) {
                  setTokens(Math.round(num / PRICE_PER_TOKEN));
                  setTokenInput(String(Math.round(num / PRICE_PER_TOKEN)));
                }
              }}
              onBlur={() => {
                const num = parseInt(budgetInput.replace(/[^0-9]/g, ""), 10);
                const clamped = isNaN(num) ? 0 : Math.max(num, 0);
                setTokens(Math.round(clamped / PRICE_PER_TOKEN));
                setBudgetInput(formatBudget(clamped));
              }}
              className="budget-display text-center bg-transparent border-none outline-none w-full min-w-0"
            />
            {errors.budget && (
              <p className="text-red-500 text-xs mt-1">{errors.budget}</p>
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
                const clamped = isNaN(num) ? 0 : Math.max(num, 0);
                setTokens(clamped);
                setTokenInput(String(clamped));
                setBudgetInput(formatBudget(clamped * PRICE_PER_TOKEN));
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
          <button className="buy-btn" onClick={handleSubmit}>
            Buy Token
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
