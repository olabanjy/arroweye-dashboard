import { Card, CardContent } from "@/components/ui/card";

interface CampaignStatsProps {
  availableTokens: number | string;
  allocatedTokens: number;
  selectedDjs: number;
  compact?: boolean;
}

export function CampaignStats({
  availableTokens,
  allocatedTokens,
  selectedDjs,
  compact = false,
}: CampaignStatsProps) {
  const available = Number(availableTokens) || 0;
  const stats = [
    ["Total tokens", available],
    ["Tokens allocated", allocatedTokens || 0],
    ["Tokens remaining", allocatedTokens > 0 ? available - allocatedTokens : 0],
    ["DJs selected", selectedDjs || 0],
  ];

  return (
    <Card className="gap-0 rounded-lg bg-muted/50 py-0 shadow-none">
      <CardContent className="grid grid-cols-2 divide-x divide-y p-0 md:grid-cols-4 md:divide-y-0">
        {stats.map(([label, value]) => (
          <div
            key={label}
            className={`flex flex-col items-center justify-center gap-2 px-3 text-center ${compact ? "min-h-24 py-4" : "min-h-32 py-6"}`}
          >
            <p className="text-xs font-medium uppercase text-muted-foreground">
              {label}
            </p>
            <p
              className={
                compact ? "text-3xl font-semibold" : "text-4xl font-semibold"
              }
            >
              {value}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
