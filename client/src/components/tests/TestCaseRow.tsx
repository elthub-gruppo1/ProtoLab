import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TestResultSelect } from "./TestResultSelect";
import type { TestCase } from "@shared/schema";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const typeLabels: Record<string, string> = {
  FUNCTIONAL: "Functional",
  ENVIRONMENTAL: "Environmental",
  INTEGRATION: "Integration",
};

const typeBadgeColors: Record<string, string> = {
  FUNCTIONAL: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  ENVIRONMENTAL: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  INTEGRATION: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
};

interface TestCaseRowProps {
  test: TestCase;
  onUpdateResult: (result: string) => void;
  onDelete: () => void;
}

export function TestCaseRow({ test, onUpdateResult, onDelete }: TestCaseRowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-md border p-3 bg-card",
        test.result === "FAIL" && "border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-950/20"
      )}
      data-testid={`card-test-${test.id}`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" data-testid={`text-test-title-${test.id}`}>
          {test.title}
        </p>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium mt-1",
            typeBadgeColors[test.type]
          )}
        >
          {typeLabels[test.type]}
        </span>
      </div>

      <TestResultSelect
        value={test.result}
        onChange={onUpdateResult}
        testId={test.id}
      />

      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="shrink-0 text-muted-foreground"
        data-testid={`button-delete-test-${test.id}`}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
