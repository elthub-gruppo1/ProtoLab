import type { TestCase } from "@shared/schema";
import { TestCaseRow } from "./TestCaseRow";

interface TestCaseListProps {
  tests: TestCase[];
  onUpdateResult: (testId: string, result: string) => void;
  onDeleteTest: (testId: string) => void;
}

export function TestCaseList({ tests, onUpdateResult, onDeleteTest }: TestCaseListProps) {
  return (
    <div className="space-y-2" data-testid="test-case-list">
      {tests.map((test) => (
        <TestCaseRow
          key={test.id}
          test={test}
          onUpdateResult={(result) => onUpdateResult(test.id, result)}
          onDelete={() => onDeleteTest(test.id)}
        />
      ))}
    </div>
  );
}
