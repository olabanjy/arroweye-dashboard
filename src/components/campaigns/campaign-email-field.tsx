import { Input } from "@/components/ui/input";

export const isValidCampaignEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

interface CampaignEmailFieldProps {
  email: string;
  onChange: (email: string) => void;
}

export function CampaignEmailField({
  email,
  onChange,
}: CampaignEmailFieldProps) {
  const showError = email.length > 0 && !isValidCampaignEmail(email);

  return (
    <div className="space-y-2">
      <label
        htmlFor="campaign-email"
        className="text-xs font-semibold text-foreground"
      >
        Campaign email
      </label>
      <Input
        id="campaign-email"
        type="email"
        autoComplete="email"
        value={email}
        placeholder="you@example.com"
        aria-invalid={showError}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 border-border bg-card dark:bg-card/50"
      />
      <p className="text-xs text-muted-foreground">
        Enter a valid email to continue with your ISRC or UPC.
      </p>
      {showError && (
        <p className="text-xs font-medium text-destructive">
          Enter a valid email address.
        </p>
      )}
    </div>
  );
}
