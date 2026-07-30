import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

type SliderProps = React.ComponentPropsWithoutRef<
  typeof SliderPrimitive.Root
> & {
  variant?: "default" | "light";
};

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, variant = "default", ...props }, ref) => {
  const isLight = variant === "light";

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        className={cn(
          "relative h-1.5 w-full grow overflow-hidden rounded-full",
          isLight
            ? "bg-white/20"
            : "bg-oklch(0.21 0.006 285.885)/20 dark:bg-oklch(0.92 0.004 286.32)/20",
        )}
      >
        <SliderPrimitive.Range
          className={cn(
            "absolute h-full",
            isLight
              ? "bg-white"
              : "bg-oklch(0.21 0.006 285.885) dark:bg-oklch(0.92 0.004 286.32)",
          )}
        />
      </SliderPrimitive.Track>

      <SliderPrimitive.Thumb
        className={cn(
          "block h-4 w-4 rounded-full shadow transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50",
          isLight
            ? "bg-white border border-white/50 focus-visible:ring-white"
            : "border border-oklch(0.92 0.004 286.32) border-oklch(0.21 0.006 285.885)/50 bg-oklch(1 0 0) dark:bg-oklch(0.141 0.005 285.823)",
        )}
      />
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
