import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface InlineAlertProps {
  variant?: "info" | "success" | "warning" | "error";
  children: React.ReactNode;
  className?: string;
}

const variantConfig = {
  info: {
    icon: Info,
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-800 dark:text-blue-200",
    iconColor: "text-blue-500 dark:text-blue-400",
  },
  success: {
    icon: CheckCircle2,
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800",
    text: "text-emerald-800 dark:text-emerald-200",
    iconColor: "text-emerald-500 dark:text-emerald-400",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    text: "text-amber-800 dark:text-amber-200",
    iconColor: "text-amber-500 dark:text-amber-400",
  },
  error: {
    icon: AlertCircle,
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-800 dark:text-red-200",
    iconColor: "text-red-500 dark:text-red-400",
  },
};

export function InlineAlert({ variant = "info", children, className }: InlineAlertProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-md border px-3 py-2.5 text-sm",
        config.bg,
        config.border,
        config.text,
        className
      )}
      data-testid={`alert-${variant}`}
    >
      <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", config.iconColor)} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
