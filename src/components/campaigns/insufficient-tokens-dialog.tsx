"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { verifyWalletPayment } from "@/services";
import { TokenTopUpForm } from "@/components/campaigns/token-top-up-form";

interface InsufficientTokensDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableTokens: number;
  requiredTokens: number;
}

const formatTokens = (tokens: number) =>
  new Intl.NumberFormat("en-NG").format(Math.max(0, tokens));

export function InsufficientTokensDialog({
  open,
  onOpenChange,
  availableTokens,
  requiredTokens,
}: InsufficientTokensDialogProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const verifiedReference = useRef<string | null>(null);
  const shortfall = Math.max(0, requiredTokens - availableTokens);

  const reference = searchParams.get("reference");

  useEffect(() => {
    if (!reference || verifiedReference.current === reference) return;
    verifiedReference.current = reference;

    const verifyPayment = async () => {
      toast.loading("Verifying payment...", { id: "verify-wallet-payment" });

      try {
        await verifyWalletPayment(reference);
        await queryClient.invalidateQueries({ queryKey: ["wallet"] });
        toast.success("Payment verified successfully!", {
          id: "verify-wallet-payment",
        });
        router.replace(pathname, { scroll: false });
      } catch (error) {
        console.error("Payment verification failed:", error);
        toast.error("Payment verification failed. Please contact support.", {
          id: "verify-wallet-payment",
        });
      }
    };

    void verifyPayment();
  }, [pathname, queryClient, reference, router]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Top up to create this campaign</DialogTitle>
          <DialogDescription>
            Your current balance does not cover the DJs and spins in this
            campaign.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2 rounded-lg border border-border bg-muted/40 p-3 text-center">
          <div>
            <p className="text-[10px] uppercase text-muted-foreground">
              Balance
            </p>
            <p className="mt-1 font-semibold">
              {formatTokens(availableTokens)}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-muted-foreground">
              Required
            </p>
            <p className="mt-1 font-semibold">{formatTokens(requiredTokens)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-muted-foreground">
              Shortfall
            </p>
            <p className="mt-1 font-semibold text-destructive">
              {formatTokens(shortfall)}
            </p>
          </div>
        </div>

        <TokenTopUpForm
          initialTokens={shortfall}
          availableBalance={availableTokens}
        />
      </DialogContent>
    </Dialog>
  );
}
