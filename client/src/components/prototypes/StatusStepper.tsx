import { cn } from "@/lib/utils";
import { STATUSES, type PrototypeStatus } from "@shared/schema";
import { Pencil, Wrench, FlaskConical, Rocket, Check } from "lucide-react";

const statusIcons: Record<string, React.ElementType> = {
  DESIGN: Pencil,
  BUILD: Wrench,
  TEST: FlaskConical,
  READY: Rocket,
};

const statusLabels: Record<string, string> = {
  DESIGN: "Design",
  BUILD: "Build",
  TEST: "Test",
  READY: "Ready",
};

interface StatusStepperProps {
  currentStatus: PrototypeStatus;
  className?: string;
}

export function StatusStepper({ currentStatus, className }: StatusStepperProps) {
  const currentIndex = STATUSES.indexOf(currentStatus);

  return (
    <div className={cn("flex items-center gap-1", className)} data-testid="status-stepper">
      {STATUSES.map((status, index) => {
        const Icon = statusIcons[status];
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={status} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                  isCompleted &&
                    "bg-emerald-500 border-emerald-500 text-white dark:bg-emerald-400 dark:border-emerald-400 dark:text-emerald-950",
                  isCurrent &&
                    "bg-primary border-primary text-primary-foreground",
                  !isCompleted &&
                    !isCurrent &&
                    "border-muted-foreground/30 text-muted-foreground/50"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Icon className="h-3.5 w-3.5" />
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium leading-none",
                  isCurrent ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {statusLabels[status]}
              </span>
            </div>
            {index < STATUSES.length - 1 && (
              <div
                className={cn(
                  "w-6 h-0.5 mx-0.5 mb-4",
                  index < currentIndex
                    ? "bg-emerald-500 dark:bg-emerald-400"
                    : "bg-muted-foreground/20"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
