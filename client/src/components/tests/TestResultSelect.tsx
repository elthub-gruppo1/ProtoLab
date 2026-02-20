import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TEST_RESULTS } from "@shared/schema";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, MinusCircle } from "lucide-react";

const resultConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  NOT_RUN: {
    label: "Not Run",
    icon: MinusCircle,
    color: "text-muted-foreground",
  },
  PASS: {
    label: "Pass",
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
  },
  FAIL: {
    label: "Fail",
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
  },
};

interface TestResultSelectProps {
  value: string;
  onChange: (value: string) => void;
  testId: string;
}

export function TestResultSelect({ value, onChange, testId }: TestResultSelectProps) {
  const config = resultConfig[value] || resultConfig.NOT_RUN;
  const Icon = config.icon;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn("w-[120px] text-xs", config.color)}
        data-testid={`select-result-${testId}`}
      >
        <div className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {TEST_RESULTS.map((result) => {
          const rc = resultConfig[result];
          const RIcon = rc.icon;
          return (
            <SelectItem
              key={result}
              value={result}
              data-testid={`option-result-${result}`}
            >
              <div className={cn("flex items-center gap-1.5", rc.color)}>
                <RIcon className="h-3.5 w-3.5" />
                {rc.label}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
