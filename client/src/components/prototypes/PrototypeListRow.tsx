import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { PrototypeWithTests } from "@shared/schema";
import { Calendar, User } from "lucide-react";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  DESIGN: "secondary",
  BUILD: "outline",
  TEST: "default",
  READY: "default",
};

const areaColors: Record<string, string> = {
  Space: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  Automotive: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  Industrial: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Other: "bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300",
};

interface PrototypeListRowProps {
  prototype: PrototypeWithTests;
  isSelected: boolean;
  onSelect: () => void;
}

export function PrototypeListRow({ prototype, isSelected, onSelect }: PrototypeListRowProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left rounded-md border p-3 transition-colors hover-elevate",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border bg-card"
      )}
      data-testid={`card-prototype-${prototype.id}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-sm truncate" data-testid={`text-name-${prototype.id}`}>
            {prototype.name}
          </h3>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {prototype.owner}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {prototype.targetDate}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
              areaColors[prototype.area]
            )}
          >
            {prototype.area}
          </span>
          <Badge
            variant={statusVariant[prototype.status]}
            className={cn(
              "text-[10px]",
              prototype.status === "READY" &&
                "bg-emerald-500 text-white dark:bg-emerald-400 dark:text-emerald-950"
            )}
            data-testid={`badge-status-${prototype.id}`}
          >
            {prototype.status}
          </Badge>
        </div>
      </div>
      <ProgressBar value={prototype.readiness} size="sm" />
    </button>
  );
}
