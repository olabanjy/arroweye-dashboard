import { cn } from "@/lib/utils";

interface EmptyInsightChartCardProps {
  className?: string;
}

export function EmptyInsightChartCard({
  className,
}: EmptyInsightChartCardProps) {
  return (
    <div
      role="img"
      aria-label="No chart data available"
      className={cn(
        "h-[430px] w-full rounded-[8px] bg-gray-200 dark:bg-muted/70",
        className,
      )}
    />
  );
}
