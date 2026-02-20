import { Button } from "@/components/ui/button";
import { Plus, Beaker } from "lucide-react";

interface PrototypeHeaderProps {
  onCreateNew: () => void;
  count: number;
}

export function PrototypeHeader({ onCreateNew, count }: PrototypeHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2 px-6 py-4 border-b bg-background">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary/10">
          <Beaker className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-semibold leading-tight" data-testid="text-app-title">
            ProtoLab
          </h1>
          <p className="text-xs text-muted-foreground">
            {count} prototype{count !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <Button onClick={onCreateNew} size="sm" data-testid="button-create-prototype">
        <Plus className="h-4 w-4 mr-1" />
        New Prototype
      </Button>
    </div>
  );
}
