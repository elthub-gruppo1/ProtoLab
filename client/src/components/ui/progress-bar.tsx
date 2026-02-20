import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md";
}

export function ProgressBar({ value, className, showLabel = true, size = "md" }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const barColor =
    clampedValue >= 80
      ? "bg-emerald-500 dark:bg-emerald-400"
      : clampedValue >= 50
      ? "bg-amber-500 dark:bg-amber-400"
      : "bg-red-500 dark:bg-red-400";

  return (
    <div className={cn("flex items-center gap-2", className)} data-testid="progress-bar">
      <div
        className={cn(
          "flex-1 rounded-full bg-muted overflow-hidden",
          size === "sm" ? "h-1.5" : "h-2"
        )}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-out", barColor)}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span
          className={cn(
            "font-medium tabular-nums",
            size === "sm" ? "text-xs" : "text-sm",
            "text-muted-foreground"
          )}
          data-testid="text-readiness-value"
        >
          {clampedValue}%
        </span>
      )}
    </div>
  );
}
