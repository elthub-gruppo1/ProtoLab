import { ScrollArea } from "@/components/ui/scroll-area";
import type { PrototypeWithTests } from "@shared/schema";
import { PrototypeListRow } from "./PrototypeListRow";

interface PrototypeListProps {
  prototypes: PrototypeWithTests[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function PrototypeList({ prototypes, selectedId, onSelect }: PrototypeListProps) {
  return (
    <ScrollArea className="flex-1">
      <div className="p-3 space-y-2" data-testid="prototype-list">
        {prototypes.map((prototype) => (
          <PrototypeListRow
            key={prototype.id}
            prototype={prototype}
            isSelected={selectedId === prototype.id}
            onSelect={() => onSelect(prototype.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
