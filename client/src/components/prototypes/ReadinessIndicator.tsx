import { cn } from "@/lib/utils";

interface ReadinessIndicatorProps {
  value: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ReadinessIndicator({ value, size = "md", className }: ReadinessIndicatorProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const sizeConfig = {
    sm: { dimension: 36, strokeWidth: 3, fontSize: "text-[9px]" },
    md: { dimension: 52, strokeWidth: 4, fontSize: "text-xs" },
    lg: { dimension: 72, strokeWidth: 5, fontSize: "text-base" },
  };

  const config = sizeConfig[size];
  const radius = (config.dimension - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  const strokeColor =
    clampedValue >= 80
      ? "stroke-emerald-500 dark:stroke-emerald-400"
      : clampedValue >= 50
      ? "stroke-amber-500 dark:stroke-amber-400"
      : "stroke-red-500 dark:stroke-red-400";

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      data-testid="readiness-indicator"
    >
      <svg
        width={config.dimension}
        height={config.dimension}
        className="-rotate-90"
      >
        <circle
          cx={config.dimension / 2}
          cy={config.dimension / 2}
          r={radius}
          fill="none"
          strokeWidth={config.strokeWidth}
          className="stroke-muted"
        />
        <circle
          cx={config.dimension / 2}
          cy={config.dimension / 2}
          r={radius}
          fill="none"
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={cn("transition-all duration-700 ease-out", strokeColor)}
        />
      </svg>
      <span
        className={cn(
          "absolute font-semibold tabular-nums",
          config.fontSize
        )}
        data-testid="text-readiness-percent"
      >
        {clampedValue}%
      </span>
    </div>
  );
}
