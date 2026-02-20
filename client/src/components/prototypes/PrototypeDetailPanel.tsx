import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Modal } from "@/components/ui/modal";
import { StatusStepper } from "./StatusStepper";
import { ReadinessIndicator } from "./ReadinessIndicator";
import { GateStatusMessage } from "./GateStatusMessage";
import { PrototypeEditForm } from "./PrototypeEditForm";
import { TestCaseForm } from "@/components/tests/TestCaseForm";
import { TestCaseList } from "@/components/tests/TestCaseList";
import { EmptyState } from "@/components/ui/empty-state";
import type { PrototypeWithTests, GateCheckResult, PrototypeStatus } from "@shared/schema";
import {
  ChevronRight,
  Plus,
  Trash2,
  X,
  Calendar,
  User,
  FlaskConical,
  Loader2,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { queryClient, apiRequest } from "@/lib/queryClient";

function computeGateCheck(prototype: PrototypeWithTests): GateCheckResult {
  const reasons: string[] = [];
  if (prototype.tests.length === 0) reasons.push("NO_TESTS");
  if (prototype.readiness < 80) reasons.push("READINESS_TOO_LOW");
  if (prototype.tests.some((t) => t.result === "FAIL")) reasons.push("HAS_FAIL");
  return { allowed: reasons.length === 0, reasons };
}

function getNextStatus(status: PrototypeStatus): PrototypeStatus | null {
  const flow: Record<string, PrototypeStatus> = {
    DESIGN: "BUILD",
    BUILD: "TEST",
    TEST: "READY",
  };
  return flow[status] || null;
}

interface PrototypeDetailPanelProps {
  prototype: PrototypeWithTests;
  onAdvanceStatus: () => void;
  isAdvancing: boolean;
  onUpdateTestResult: (testId: string, result: string) => void;
  onDeletePrototype: () => void;
  onDeleteTest: (testId: string) => void;
  onClose: () => void;
}

export function PrototypeDetailPanel({
  prototype,
  onAdvanceStatus,
  isAdvancing,
  onUpdateTestResult,
  onDeletePrototype,
  onDeleteTest,
  onClose,
}: PrototypeDetailPanelProps) {
  const [showTestForm, setShowTestForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const nextStatus = getNextStatus(prototype.status as PrototypeStatus);
  const isTestToReady = prototype.status === "TEST";
  const gateCheck = isTestToReady ? computeGateCheck(prototype) : null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b bg-background">
        <h2 className="text-sm font-semibold truncate" data-testid="text-detail-name">
          {prototype.name}
        </h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowEditForm(true)}
            data-testid="button-edit-prototype"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-testid="button-close-detail"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <StatusStepper currentStatus={prototype.status as PrototypeStatus} />
            <ReadinessIndicator value={prototype.readiness} size="lg" />
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span data-testid="text-detail-owner">{prototype.owner}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span data-testid="text-detail-target-date">{prototype.targetDate}</span>
            </div>
          </div>

          {nextStatus && (
            <div className="space-y-2">
              {gateCheck && <GateStatusMessage gateResult={gateCheck} />}
              <Button
                onClick={onAdvanceStatus}
                disabled={isAdvancing || (isTestToReady && gateCheck && !gateCheck.allowed)}
                className="w-full"
                data-testid="button-advance-status"
              >
                {isAdvancing ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-1" />
                )}
                Advance to {nextStatus}
              </Button>
            </div>
          )}

          {prototype.status === "READY" && (
            <Badge
              className="w-full justify-center py-1.5 bg-emerald-500 text-white dark:bg-emerald-400 dark:text-emerald-950"
              data-testid="badge-ready-complete"
            >
              Prototype is Ready
            </Badge>
          )}

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">
                  Test Cases ({prototype.tests.length})
                </h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTestForm(true)}
                data-testid="button-add-test"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Test
              </Button>
            </div>

            {prototype.tests.length === 0 ? (
              <EmptyState
                icon={FlaskConical}
                title="No test cases"
                description="Add test cases to define the verification plan for this prototype."
                actionLabel="Add Test Case"
                onAction={() => setShowTestForm(true)}
                className="py-8"
              />
            ) : (
              <TestCaseList
                tests={prototype.tests}
                onUpdateResult={onUpdateTestResult}
                onDeleteTest={onDeleteTest}
              />
            )}
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button
              variant="destructive"
              size="sm"
              onClick={onDeletePrototype}
              data-testid="button-delete-prototype"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Delete Prototype
            </Button>
          </div>
        </div>
      </ScrollArea>

      <Modal
        open={showTestForm}
        onOpenChange={setShowTestForm}
        title="Add Test Case"
        description={`Add a test case to "${prototype.name}"`}
      >
        <TestCaseForm
          prototypeId={prototype.id}
          onSuccess={() => {
            setShowTestForm(false);
            queryClient.invalidateQueries({ queryKey: ["/api/prototypes"] });
          }}
        />
      </Modal>

      <Modal
        open={showEditForm}
        onOpenChange={setShowEditForm}
        title="Edit Prototype"
        description="Update prototype details."
      >
        <PrototypeEditForm
          prototype={prototype}
          onSuccess={() => setShowEditForm(false)}
        />
      </Modal>
    </div>
  );
}
