"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const CAMPAIGN_TERMS_STORAGE_KEY = "arroweye:campaign-terms:v1";

const AddCampaign = () => {
  const [acceptedTerms, setAcceptedTerms] = useState<boolean | null>(null);

  useEffect(() => {
    setAcceptedTerms(
      window.localStorage.getItem(CAMPAIGN_TERMS_STORAGE_KEY) === "accepted",
    );
  }, []);

  const handleTermsChange = (accepted: boolean) => {
    setAcceptedTerms(accepted);

    if (accepted) {
      window.localStorage.setItem(CAMPAIGN_TERMS_STORAGE_KEY, "accepted");
    } else {
      window.localStorage.removeItem(CAMPAIGN_TERMS_STORAGE_KEY);
    }
  };

  const optionClassName =
    "w-[200px] rounded-full py-3 text-center transition-[background-color,color,opacity]";

  return (
    <section className="flex min-h-full w-full flex-col items-center justify-center bg-background px-6 py-14 text-foreground">
      <div className="text-center">
        <h1 className="text-xl font-semibold">LAUNCH YOUR CAMPAIGN</h1>
        <p className="mt-2 text-xs text-muted-foreground">
          Choose how you want to build your campaign.
        </p>
      </div>

      <div className="mt-14 flex w-full max-w-sm flex-col gap-10">
        <div className="flex flex-col items-center">
          {acceptedTerms ? (
            <Link
              href="/campaigns/setup/custom"
              className={`${optionClassName} border border-border bg-background text-foreground hover:bg-muted`}
            >
              Custom
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className={`${optionClassName} cursor-not-allowed border border-border bg-muted/40 text-muted-foreground opacity-50`}
            >
              Custom
            </span>
          )}
          <p className="mt-2 max-w-[220px] text-center text-xs italic text-muted-foreground">
            Choose DJs, cities and spin allocation
          </p>
        </div>

        <div className="flex flex-col items-center">
          {acceptedTerms ? (
            <Link
              href="/campaigns/setup/promoter"
              className={`${optionClassName} bg-primary text-primary-foreground hover:opacity-80`}
            >
              DJ Plans
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className={`${optionClassName} cursor-not-allowed bg-primary text-primary-foreground opacity-35`}
            >
              DJ Plans
            </span>
          )}
          <p className="mt-2 max-w-[220px] text-center text-xs italic text-muted-foreground">
            Launch faster with curated DJ networks
          </p>
        </div>

        <label className="mx-auto flex max-w-xs cursor-pointer items-start gap-3 text-left text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={acceptedTerms ?? false}
            onChange={(event) => handleTermsChange(event.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-primary"
          />
          <span>
            I accept the <span className="underline">terms and conditions</span>
            .
          </span>
        </label>
      </div>
    </section>
  );
};

export default AddCampaign;
