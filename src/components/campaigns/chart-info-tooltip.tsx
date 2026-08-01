import { Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChartInfoTooltipProps {
  content: string | number;
}

export function ChartInfoTooltip({ content }: ChartInfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground"
          >
            <Info />
            <span className="sr-only">More information</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-60">{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
