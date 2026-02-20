import { InlineAlert } from "@/components/ui/inline-alert";
import type { GateCheckResult } from "@shared/schema";
import { ShieldCheck, ShieldAlert } from "lucide-react";

const reasonLabels: Record<string, string> = {
  READINESS_TOO_LOW: "Readiness is below 80%",
  HAS_FAIL: "There are failing tests",
  NO_TESTS: "At least one test case is required",
};

interface GateStatusMessageProps {
  gateResult: GateCheckResult;
  className?: string;
}

export function GateStatusMessage({ gateResult, className }: GateStatusMessageProps) {
  if (gateResult.allowed) {
    return (
      <InlineAlert variant="success" className={className}>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" />
          <span className="font-medium">Gate passed — prototype can be marked as Ready</span>
        </div>
      </InlineAlert>
    );
  }

  return (
    <InlineAlert variant="warning" className={className}>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 font-medium">
          <ShieldAlert className="h-4 w-4" />
          <span>Gate not satisfied — cannot advance to Ready</span>
        </div>
        <ul className="list-disc list-inside text-xs space-y-0.5 ml-6">
          {gateResult.reasons.map((reason) => (
            <li key={reason} data-testid={`text-gate-reason-${reason}`}>
              {reasonLabels[reason] || reason}
            </li>
          ))}
        </ul>
      </div>
    </InlineAlert>
  );
}
